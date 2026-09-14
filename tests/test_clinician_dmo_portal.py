"""
Smriti-NER (স্মৃতি) — Sub-Phase 9.3: District Medical Officer / Clinician View Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates district-wide cognitive cohort surveillance, DISHA-gated patient drilldown,
automated >3-point MMSE drop flagging, and e-Sanjeevani teleconsultation handoff.
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from fastapi.testclient import TestClient
    from server.main import app, CLINICIAN_INTERVENTION_FLAGS_STORE
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestClinicianDmoPortal(unittest.TestCase):

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_district_cognitive_overview(self):
        """Validates district-scale cognitive surveillance metrics and prevalence."""
        resp = client.get("/api/v1/clinician/district-overview?district_id=dist_majuli")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertEqual(data["district_id"], "dist_majuli")
        self.assertEqual(data["district_name"], "Majuli River Island District")
        self.assertEqual(data["state"], "Assam")
        self.assertEqual(data["total_monitored_elders"], 412)
        self.assertEqual(data["prevalence_percentage"], 7.8)
        self.assertEqual(data["average_mmse_score"], 23.4)

        # Cohort breakdown
        cb = data["cohort_breakdown"]
        self.assertEqual(cb["normal_count"] + cb["mci_count"] + cb["dementia_count"], 412)

        # Channel breakdown (PWA vs IVR vs Hybrid)
        chb = data["channel_breakdown"]
        self.assertTrue(chb["app_users"] > 0)
        self.assertTrue(chb["ivr_users"] > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_patient_drilldown_disha_consent(self):
        """Validates patient drilldown with valid DISHA token vs unconsented de-identification."""
        # 1. Valid consent
        valid_resp = client.get("/api/v1/clinician/patient-drilldown/p4?consent_token=cst_valid_token_26003")
        self.assertEqual(valid_resp.status_code, 200)
        v_data = valid_resp.json()
        self.assertTrue(v_data["consent_verified"])
        self.assertEqual(v_data["name"], "Purnima Devi Gogoi")
        self.assertEqual(v_data["abha_id"], "91-4021-8891-2301")
        self.assertEqual(len(v_data["domain_scores"]), 4)

        domains = [d["domain"] for d in v_data["domain_scores"]]
        self.assertIn("MEMORY", domains)
        self.assertIn("ATTENTION", domains)
        self.assertIn("EXECUTIVE", domains)
        self.assertIn("LANGUAGE", domains)

        # 2. De-identified access without consent
        anon_resp = client.get("/api/v1/clinician/patient-drilldown/p4?consent_token=cst_unauthorized")
        self.assertEqual(anon_resp.status_code, 200)
        a_data = anon_resp.json()
        self.assertFalse(a_data["consent_verified"])
        self.assertIn("DE-IDENTIFIED", a_data["name"])
        self.assertIn("****", a_data["abha_id"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_clinical_export_report_generation(self):
        """Validates clinical summary PDF and FHIR R4 DiagnosticReport bundle generation."""
        resp = client.post("/api/v1/clinician/reports/generate", json={
            "patient_id": "p4",
            "clinician_name": "Dr. Sanjib Kakoti (DMO, Majuli)",
        })
        self.assertEqual(resp.status_code, 200)
        report = resp.json()

        self.assertTrue(report["report_id"].startswith("rep_"))
        self.assertTrue(report["fhir_bundle_id"].startswith("fhir_diag_"))
        self.assertIn("Comprehensive Clinical", report["clinical_summary_text"])
        self.assertTrue(report["pdf_download_url"].endswith(".pdf"))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_automated_intervention_flagging(self):
        """Validates automated flagging for elders with acute >3-point MMSE decline."""
        resp = client.get("/api/v1/clinician/intervention-flags")
        self.assertEqual(resp.status_code, 200)
        flags = resp.json()
        self.assertTrue(len(flags) >= 2)

        p4_flag = next(f for f in flags if f["patient_id"] == "p4")
        self.assertEqual(p4_flag["severity"], "URGENT_INTERVENTION")
        self.assertEqual(p4_flag["score_drop_points"], 4)
        self.assertEqual(p4_flag["baseline_mmse"], 18)
        self.assertEqual(p4_flag["current_mmse"], 14)
        self.assertIn("Acute 4-point MMSE drop", p4_flag["trigger_reason"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_esanjeevani_teleconsultation_handoff(self):
        """Validates e-Sanjeevani national teleconsultation referral packet creation."""
        resp = client.post("/api/v1/clinician/esanjeevani/handoff", json={
            "patient_id": "p4",
            "doctor_notes": "Urgent tertiary tele-neurology review requested for rapid 4-point decline.",
        })
        self.assertEqual(resp.status_code, 200)
        packet = resp.json()

        self.assertTrue(packet["referral_id"].startswith("esanj_"))
        self.assertEqual(packet["patient_id"], "p4")
        self.assertEqual(packet["referral_priority"], "HIGH")
        self.assertIn("GMCH Tele-medicine Node", packet["telemedicine_node"])
        self.assertEqual(packet["score_drop_30_days"], 4)

        # Check that flag status updated to ESANJEEVANI_QUEUED
        flags_resp = client.get("/api/v1/clinician/intervention-flags")
        p4_flag = next(f for f in flags_resp.json() if f["patient_id"] == "p4")
        self.assertEqual(p4_flag["status"], "ESANJEEVANI_QUEUED")


if __name__ == "__main__":
    unittest.main()
