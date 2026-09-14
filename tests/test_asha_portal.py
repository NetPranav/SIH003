"""
Smriti-NER (স্মৃতি) — Sub-Phase 9.2: ASHA Worker Portal (Community View) Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates multi-patient cohort triage, offline Bluetooth Low Energy delta sync (<30s),
village home-visit checklist audits, and Anganwadi Community Circle scheduling.
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from fastapi.testclient import TestClient
    from server.main import (
        app,
        ASHA_VILLAGE_VISITS_STORE,
        ASHA_COMMUNITY_CIRCLES_STORE,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAshaPortal(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            ASHA_VILLAGE_VISITS_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_get_asha_cohort(self):
        """Validates rural multi-patient cohort with cognitive staging, channels, and trend arrows."""
        resp = client.get("/api/v1/asha/cohort")
        self.assertEqual(resp.status_code, 200)
        cohort = resp.json()
        self.assertTrue(len(cohort) >= 6)

        # Check patient attributes
        for p in cohort:
            self.assertIn("id", p)
            self.assertIn("name", p)
            self.assertIn("mmse", p)
            self.assertIn(p["trend_arrow"], ["UP", "FLAT", "DOWN"])
            self.assertIn(p["channel"], ["APP", "IVR", "HYBRID"])

        # Check IVR-only elder presence (Sub-Phase 8.4 cross-channel continuity)
        ivr_patient = next(p for p in cohort if p["channel"] == "IVR")
        self.assertEqual(ivr_patient["id"], "p6")
        self.assertIn("IVR", ivr_patient["village"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_bluetooth_delta_sync(self):
        """Validates offline peer-to-peer Bluetooth sync completing in <30s with checksum verification."""
        resp = client.post("/api/v1/asha/sync/bluetooth", json={"patient_id": "p1"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertEqual(data["patient_id"], "p1")
        self.assertTrue(data["checksum_verified"])
        self.assertTrue(data["bytes_transferred"] > 40000)
        # Milestone M9 criteria: duration < 30,000ms
        self.assertTrue(data["duration_ms"] < 30000)
        self.assertEqual(data["records_count"], 28)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_village_visit_audit_workflow(self):
        """Validates home-visit checklist audit submission and history retrieval."""
        patient_id = "p4"

        # Submit visit audit with clinician escalation flag
        visit_payload = {
            "patient_id": patient_id,
            "asha_worker_name": "Jonali Saikia (Kamalabari PHC)",
            "visit_date": "2026-09-18T11:00:00Z",
            "mmse_checked": True,
            "pill_count_verified": True,
            "caregiver_burnout_assessed": True,
            "fall_risk_inspected": True,
            "voice_notes_url": "/audio/asha_notes_p4.mp3",
            "clinician_escalation_needed": True,
            "notes": "Elder showed signs of sundowning agitation; pill blister pack had 2 missed morning doses.",
        }

        submit_resp = client.post("/api/v1/asha/visits/submit", json=visit_payload)
        self.assertEqual(submit_resp.status_code, 200)
        sub_data = submit_resp.json()
        self.assertTrue(sub_data["visit_id"].startswith("vis_"))
        self.assertTrue(sub_data["clinician_escalation_needed"])

        # Retrieve visit records for patient
        get_resp = client.get(f"/api/v1/asha/visits/{patient_id}")
        self.assertEqual(get_resp.status_code, 200)
        visits = get_resp.json()
        self.assertEqual(len(visits), 1)
        self.assertEqual(visits[0]["notes"], visit_payload["notes"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_community_circle_scheduler(self):
        """Validates retrieving and scheduling Anganwadi Reminiscence Circle sessions."""
        # 1. Retrieve initial schedules
        resp = client.get("/api/v1/asha/circles/schedules")
        self.assertEqual(resp.status_code, 200)
        initial_schedules = resp.json()
        self.assertTrue(len(initial_schedules) >= 2)

        # 2. Schedule a new session
        new_sched_payload = {
            "circle_name": "Garamur Namghar Reminiscence Circle",
            "village_venue": "Garamur Community Namghar, Majuli",
            "scheduled_date": "2026-09-28T10:30:00Z",
            "facilitator_asha": "Jonali Saikia",
            "registered_elders_count": 10,
            "cultural_theme": "Bihu Naas & Majuli Mask-Making Memories",
        }
        create_resp = client.post("/api/v1/asha/circles/schedule", json=new_sched_payload)
        self.assertEqual(create_resp.status_code, 200)
        created = create_resp.json()
        self.assertEqual(created["circle_name"], new_sched_payload["circle_name"])
        self.assertEqual(created["status"], "UPCOMING")

        # 3. Verify schedule count incremented
        resp2 = client.get("/api/v1/asha/circles/schedules")
        self.assertEqual(len(resp2.json()), len(initial_schedules) + 1)


if __name__ == "__main__":
    unittest.main()
