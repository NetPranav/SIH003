"""
Unit tests for Smriti-NER Clinical Pilot Site Selection & Setup
Sub-Phase 14.1: 10 PHC sites qualification, IEC ethical approval clearance,
50-tablet MDM kiosk inventory, 500-patient register, and 50-patient IVR-only cohort.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestClinicalPilotSite(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_phc_site_qualification_matrix(self):
        """Validates that exactly 10 qualified PHC sites across 4 NER districts are operational."""
        res = client.get("/api/v1/pilot/sites")
        self.assertEqual(res.status_code, 200)
        sites = res.json()
        self.assertEqual(len(sites), 10)
        districts = {s["district"] for s in sites}
        self.assertEqual(districts, {"Kamrup Metro", "Majuli", "Ri-Bhoi", "Churachandpur"})
        for site in sites:
            self.assertEqual(site["status"], "OPERATIONAL")
            self.assertGreaterEqual(site["asha_count"], 5)
            self.assertEqual(site["target_enrollment"], 50)
            self.assertTrue(site["solar_backup_available"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_iec_ethical_approval_clearance(self):
        """Validates IEC ethical clearance protocol, ICMR compliance, and 8-language dual-consent mandating."""
        res = client.get("/api/v1/pilot/ethical-approval")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["protocol_number"], "SIH2026/MDoNER/IEC-PILOT-09")
        self.assertTrue(data["icmr_guidelines_compliance"])
        self.assertTrue(data["dual_consent_mandated"])
        self.assertTrue(data["lar_consent_required"])
        self.assertTrue(data["audio_assent_recording_enabled"])
        self.assertEqual(data["status"], "APPROVED")
        self.assertGreaterEqual(len(data["languages_covered"]), 8)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_provisioned_device_inventory_fleet(self):
        """Validates fleet of 50 ruggedized Android tablets provisioned with MDM kiosk and AES-256-GCM."""
        res = client.get("/api/v1/pilot/devices")
        self.assertEqual(res.status_code, 200)
        devices = res.json()
        self.assertEqual(len(devices), 50)
        for d in devices:
            self.assertTrue(d["kiosk_lockdown_active"])
            self.assertEqual(d["offline_storage_cipher"], "AES-256-GCM")
            self.assertTrue(d["bhashini_offline_packs_installed"])
            self.assertGreaterEqual(d["battery_health_pct"], 90)
            self.assertEqual(d["status"], "DEPLOYED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_enrolled_patient_stratification(self):
        """Validates full register of 500 mild-to-moderate dementia patients (450 App, 50 IVR-Only)."""
        res = client.get("/api/v1/pilot/patients")
        self.assertEqual(res.status_code, 200)
        patients = res.json()
        self.assertEqual(len(patients), 500)
        for p in patients:
            self.assertTrue(14 <= p["baseline_mmse"] <= 26, f"Invalid baseline MMSE: {p['baseline_mmse']}")
            self.assertTrue(60 <= p["age"] <= 95)
            self.assertTrue(p["has_caregiver_assigned"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ivr_only_sub_cohort_isolation(self):
        """Validates that exactly 50 no-device patients are isolated for the IVR-only comparative arm."""
        res = client.get("/api/v1/pilot/patients?cohort_type=IVR_ONLY_COHORT")
        self.assertEqual(res.status_code, 200)
        ivr_patients = res.json()
        self.assertEqual(len(ivr_patients), 50)
        for p in ivr_patients:
            self.assertEqual(p["cohort_type"], "IVR_ONLY_COHORT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_pilot_setup_summary(self):
        """Validates consolidated clinical pilot readiness metrics."""
        res = client.get("/api/v1/pilot/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["phcs_operational"], 10)
        self.assertEqual(data["total_enrollment_target"], 500)
        self.assertEqual(data["currently_enrolled_count"], 500)
        self.assertEqual(data["app_cohort_count"], 450)
        self.assertEqual(data["ivr_only_cohort_count"], 50)
        self.assertEqual(data["devices_provisioned"], 50)
        self.assertTrue(data["ethical_clearance_active"])
        self.assertEqual(data["status"], "SETUP_COMPLETE_READY_FOR_TRAINING")


if __name__ == "__main__":
    unittest.main()
