"""
Unit tests for Smriti-NER Caregiver Wellness & Peer Support Ecosystem
Sub-Phase 9.4: ZBI-4 Assessment, Peer Matching, Burnout Safeguards, and Milestone M9 Certification
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCaregiverWellness(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_zbi4_minimal_mild(self):
        """Test ZBI-4 check-in yielding MINIMAL_MILD burden (score <= 4)."""
        payload = {
            "caregiver_id": "cg_test_mild",
            "patient_id": "p_test_mild",
            "responses": [
                {"question_id": "ZBI_01", "score": 1},
                {"question_id": "ZBI_02", "score": 0},
                {"question_id": "ZBI_03", "score": 1},
                {"question_id": "ZBI_04", "score": 0},
            ],
        }
        res = client.post("/api/v1/caregiver/wellness/checkin", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_score"], 2)
        self.assertEqual(data["severity_tier"], "MINIMAL_MILD")
        self.assertFalse(data["burnout_flag"])
        self.assertTrue(any("14 days" in act for act in data["recommended_actions"]))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_zbi4_moderate(self):
        """Test ZBI-4 check-in yielding MODERATE burden (score 5-8)."""
        payload = {
            "caregiver_id": "cg_test_mod",
            "patient_id": "p_test_mod",
            "responses": [
                {"question_id": "ZBI_01", "score": 2},
                {"question_id": "ZBI_02", "score": 2},
                {"question_id": "ZBI_03", "score": 1},
                {"question_id": "ZBI_04", "score": 2},
            ],
        }
        res = client.post("/api/v1/caregiver/wellness/checkin", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_score"], 7)
        self.assertEqual(data["severity_tier"], "MODERATE")
        self.assertFalse(data["burnout_flag"])
        self.assertTrue(any("peer caregiver buddy" in act for act in data["recommended_actions"]))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_zbi4_severe_burnout_alert(self):
        """Test ZBI-4 check-in yielding SEVERE_BURNOUT (score >= 9) and Tele-MANAS alert."""
        payload = {
            "caregiver_id": "cg_test_severe",
            "patient_id": "p_test_severe",
            "responses": [
                {"question_id": "ZBI_01", "score": 4},
                {"question_id": "ZBI_02", "score": 3},
                {"question_id": "ZBI_03", "score": 3},
                {"question_id": "ZBI_04", "score": 4},
            ],
        }
        res = client.post("/api/v1/caregiver/wellness/checkin", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_score"], 14)
        self.assertEqual(data["severity_tier"], "SEVERE_BURNOUT")
        self.assertTrue(data["burnout_flag"])
        self.assertTrue(any("14416" in act for act in data["recommended_actions"]))
        self.assertTrue(any("30-min in-person respite" in act for act in data["recommended_actions"]))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_wellness_history_retrieval(self):
        """Test retrieving past check-in history for a caregiver."""
        res = client.get("/api/v1/caregiver/wellness/history/cg_kamrup_01")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[0]["caregiver_id"], "cg_kamrup_01")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_peer_support_matching(self):
        """Test matching caregiver with peers by district, language, and dementia stage."""
        payload = {
            "caregiver_id": "cg_new_seeker",
            "district": "Kamrup Metro",
            "languages": ["as", "en"],
            "dementia_stage": "MODERATE",
        }
        res = client.post("/api/v1/caregiver/wellness/peer-match", json=payload)
        self.assertEqual(res.status_code, 200)
        peers = res.json()
        self.assertGreaterEqual(len(peers), 1)
        # Top match should have the highest match score (Kamrup Metro + Assamese + Moderate stage)
        top_peer = peers[0]
        self.assertEqual(top_peer["district"], "Kamrup Metro")
        self.assertIn("as", top_peer["languages"])
        self.assertGreaterEqual(top_peer["match_score"], 0.8)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_resources_filtering(self):
        """Test retrieval of crisis helplines and localized grounding soundscapes."""
        res = client.get("/api/v1/caregiver/wellness/resources?severity=SEVERE_BURNOUT")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertGreaterEqual(len(items), 2)
        # First item should be crisis helpline
        self.assertEqual(items[0]["type"], "CRISIS_HELPLINE")
        self.assertIn("14416", items[0]["contact_or_url"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m9_verification(self):
        """Test formal Milestone M9 certification endpoint."""
        res = client.get("/api/v1/caregiver/wellness/milestone-m9/verify")
        self.assertEqual(res.status_code, 200)
        audit = res.json()
        self.assertEqual(audit["milestone"], "M9")
        self.assertEqual(audit["status"], "PASSED")
        components = audit["components_checked"]
        self.assertTrue(components["caregiver_dashboard"])
        self.assertTrue(components["mmse_synthetic_trajectory_valid"])
        self.assertTrue(components["asha_dashboard"])
        self.assertTrue(components["ble_sync_benchmark_passed"])
        self.assertLess(components["ble_sync_duration_seconds"], 30.0)
        self.assertTrue(components["clinician_dmo_dashboard"])
        self.assertTrue(components["caregiver_wellness_checkin_active"])


if __name__ == "__main__":
    unittest.main()
