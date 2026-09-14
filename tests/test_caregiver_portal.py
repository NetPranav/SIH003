"""
Smriti-NER (স্মৃতি) — Sub-Phase 9.1: Caregiver Portal (Family View) Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates dual-tier authentication (Local PIN + Cloud SMS OTP), 30-day MMSE trajectory tracking,
multi-sensory adherence rings, circadian sundowning alerts, and reminiscence story album.
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
        CAREGIVER_CLOUD_OTPS_STORE,
        CAREGIVER_SUNDOWNING_ALERTS_STORE,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCaregiverPortal(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            CAREGIVER_CLOUD_OTPS_STORE.clear()
            CAREGIVER_SUNDOWNING_ALERTS_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_local_pin_authentication(self):
        """Validates local in-home 4-digit PIN authentication (1234)."""
        # Valid PIN
        resp = client.post("/api/v1/caregiver/auth/verify-pin", json={"pin": "1234"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["authenticated"])
        self.assertEqual(data["auth_tier"], "LOCAL_PIN")
        self.assertTrue(data["token"].startswith("tok_pin_"))

        # Invalid PIN
        err_resp = client.post("/api/v1/caregiver/auth/verify-pin", json={"pin": "9999"})
        self.assertEqual(err_resp.status_code, 401)
        self.assertIn("Incorrect PIN", err_resp.json()["detail"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_cloud_otp_workflow(self):
        """Validates remote cloud SMS OTP request, token dispatch, and verification."""
        phone = "9864099881"

        # 1. Request OTP
        req_resp = client.post("/api/v1/caregiver/auth/request-otp", json={"phone_number": phone})
        self.assertEqual(req_resp.status_code, 200)
        req_data = req_resp.json()
        otp_id = req_data["otp_id"]
        self.assertIn("986****881", req_data["phone_masked"])
        self.assertTrue("expires_at" in req_data)

        # 2. Verify with valid test OTP
        verify_resp = client.post("/api/v1/caregiver/auth/verify-otp", json={
            "otp_id": otp_id,
            "otp_code": "260030",
        })
        self.assertEqual(verify_resp.status_code, 200)
        v_data = verify_resp.json()
        self.assertTrue(v_data["authenticated"])
        self.assertEqual(v_data["auth_tier"], "CLOUD_OTP")
        self.assertTrue(v_data["token"].startswith("tok_otp_"))

        # 3. Verify expired / consumed OTP errors
        replay_resp = client.post("/api/v1/caregiver/auth/verify-otp", json={
            "otp_id": otp_id,
            "otp_code": "260030",
        })
        self.assertEqual(replay_resp.status_code, 404)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_30_day_mmse_trajectory(self):
        """Validates 30-day longitudinal MMSE trajectory generation and anomaly flags."""
        patient_id = "pt_cg_test_01"
        resp = client.get(f"/api/v1/caregiver/trajectory/{patient_id}")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["patient_id"], patient_id)

        pts = data["trajectory_points"]
        self.assertEqual(len(pts), 30)

        # Check structure of points
        for i, pt in enumerate(pts, start=1):
            self.assertEqual(pt["day"], i)
            self.assertTrue(10.0 <= pt["score"] <= 30.0)
            self.assertIn(pt["classification"], ["NORMAL", "MCI", "SEVERE"])
            self.assertIn(pt["channel"], ["APP", "IVR", "BLENDED"])

        # Check anomaly dip on day 14
        day14_pt = next(p for p in pts if p["day"] == 14)
        self.assertTrue(day14_pt["anomaly"])
        self.assertIsNotNone(day14_pt["notes"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_adherence_rings(self):
        """Validates concentric adherence rings for medication, hydration, and cognitive games."""
        patient_id = "pt_cg_test_02"
        resp = client.get(f"/api/v1/caregiver/adherence-rings/{patient_id}")
        self.assertEqual(resp.status_code, 200)
        rings = resp.json()["rings"]
        self.assertEqual(len(rings), 3)

        categories = [r["category"] for r in rings]
        self.assertIn("MEDICATION", categories)
        self.assertIn("HYDRATION", categories)
        self.assertIn("COGNITIVE_GAMES", categories)

        med_ring = next(r for r in rings if r["category"] == "MEDICATION")
        self.assertEqual(med_ring["percentage"], 100)
        self.assertEqual(med_ring["completed_count"], 3)
        self.assertEqual(med_ring["target_count"], 3)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_sundowning_alerts_and_resolution(self):
        """Validates circadian sundowning alerts retrieval and caregiver resolution workflow."""
        patient_id = "pt_cg_test_03"

        # 1. Fetch alerts
        resp = client.get(f"/api/v1/caregiver/sundowning-alerts/{patient_id}")
        self.assertEqual(resp.status_code, 200)
        alerts = resp.json()
        self.assertTrue(len(alerts) >= 2)

        # 2. Check critical twilight alert
        crit_alert = next(a for a in alerts if a["severity"] == "CRITICAL")
        self.assertFalse(crit_alert["resolved"])
        self.assertIn("Borgeet", crit_alert["deescalation_protocol"])
        alert_id = crit_alert["alert_id"]

        # 3. Resolve the alert
        res_resp = client.post(f"/api/v1/caregiver/sundowning-alerts/resolve/{alert_id}")
        self.assertEqual(res_resp.status_code, 200)
        resolved_data = res_resp.json()
        self.assertTrue(resolved_data["resolved"])
        self.assertIsNotNone(resolved_data["resolved_at"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_reminiscence_album(self):
        """Validates photo and audio reminiscence album items."""
        resp = client.get("/api/v1/caregiver/reminiscence-album/pt_cg_test_04")
        self.assertEqual(resp.status_code, 200)
        album = resp.json()
        self.assertTrue(len(album) >= 3)

        media_types = [item["media_type"] for item in album]
        self.assertIn("PHOTO", media_types)
        self.assertIn("AUDIO_NARRATIVE", media_types)
        self.assertIn("VOICE_ANNOTATION", media_types)


if __name__ == "__main__":
    unittest.main()
