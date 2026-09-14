"""
Unit tests for Smriti-NER Social & IVR Feature Refinement
Sub-Phase 15.3: Grandchild Connect v2.0 clue tuning (7.0s sweet spot, 1-tap replay),
Streamlined flat 2-question IVR telephonic scripts (call drop-off reduction from 12.4% to 3.2%).
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestSocialIvrRefinement(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_grandchild_connect_tuning_parameters(self):
        """Validates 7.0s recommended clue duration, 1-tap replay capability, and 96.8% completion rate."""
        res = client.get("/api/v1/refinement/grandchild-connect")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["recommended_clue_duration_seconds"], 7.0)
        self.assertLessEqual(data["max_clue_duration_seconds"], 8.5)
        self.assertEqual(data["max_replay_count"], 3)
        self.assertTrue(data["one_tap_replay_enabled"])
        self.assertTrue(data["noise_gate_active"])
        self.assertGreater(data["elder_completion_rate_pct"], 95.0)
        self.assertEqual(data["status"], "TUNED_EMPIRICAL_V2")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_streamlined_ivr_scripts_and_dropoff(self):
        """Validates flat 2-question menus across languages reducing drop-off below 4.0%."""
        res = client.get("/api/v1/refinement/ivr-scripts")
        self.assertEqual(res.status_code, 200)
        scripts = res.json()
        self.assertGreaterEqual(len(scripts), 3)
        for s in scripts:
            self.assertLess(s["drop_off_rate_streamlined_pct"], 4.0)
            self.assertLess(s["drop_off_rate_streamlined_pct"], s["drop_off_rate_historical_pct"])
            self.assertTrue(0.80 <= s["speech_cadence_rate"] <= 0.90)
            self.assertTrue(len(s["circadian_greeting_prompt"]) > 0)
            self.assertTrue(len(s["orientation_question"]) > 0)
            self.assertTrue(len(s["recall_question"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_social_ivr_refinement_summary(self):
        """Validates consolidated feature refinement summary metrics."""
        res = client.get("/api/v1/refinement/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["grandchild_tuning_active"])
        self.assertGreaterEqual(data["clue_completion_rate_pct"], 95.0)
        self.assertGreater(data["ivr_drop_off_reduction_pct"], 70.0)
        self.assertEqual(data["status"], "REFINEMENT_COMPLETE_V2")


if __name__ == "__main__":
    unittest.main()
