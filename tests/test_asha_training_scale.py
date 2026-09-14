"""
Unit tests for Smriti-NER Scalable ASHA Worker Training Program (Sub-Phase 17.1)
Validates 8 localized training videos, 15 regional simulation workshops,
in-app digital OSCE module (>=85% pass mark), and 1,500+ certified ASHAs.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAshaTrainingScale(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_training_videos(self):
        """Validates that 8 localized 10-minute training videos cover regional languages and elder empathy."""
        res = client.get("/api/v1/training/videos")
        self.assertEqual(res.status_code, 200)
        videos = res.json()
        self.assertEqual(len(videos), 8)

        langs = {v["language"] for v in videos}
        self.assertEqual(langs, {"as", "brx", "kha", "grx", "mni", "lus", "bn", "ne"})

        for v in videos:
            self.assertEqual(v["duration_minutes"], 10)
            self.assertGreater(len(v["topics_covered"]), 0)
            self.assertTrue(v["video_url"].endswith(".mp4"))
            self.assertIn("en", v["subtitles_available"])
            self.assertTrue(len(v["elder_empathy_focus"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_regional_workshops(self):
        """Validates all 15 regional workshops across district HQs meet >= 90% attendance."""
        res = client.get("/api/v1/training/workshops")
        self.assertEqual(res.status_code, 200)
        workshops = res.json()
        self.assertEqual(len(workshops), 15)

        total_ashas = sum(w["target_ashas_count"] for w in workshops)
        self.assertGreaterEqual(total_ashas, 1500)

        for w in workshops:
            self.assertEqual(w["days_duration"], 2)
            self.assertGreaterEqual(w["attendance_rate_pct"], 90.0)
            self.assertEqual(w["status"], "COMPLETED_CERTIFIED")
            self.assertTrue(len(w["venue"]) > 0)
            self.assertTrue(len(w["lead_trainer"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_digital_training_module(self):
        """Validates in-app OSCE digital training configuration and passing score threshold."""
        res = client.get("/api/v1/training/digital-module")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["module_id"], "MOD-OSCE-ASHA-V2")
        self.assertEqual(data["passing_score_pct"], 85.0)
        self.assertTrue(data["offline_capable"])
        self.assertGreaterEqual(len(data["sample_questions"]), 2)

        for q in data["sample_questions"]:
            self.assertGreaterEqual(len(q["options"]), 3)
            self.assertTrue(0 <= q["correct_option_index"] < len(q["options"]))
            self.assertTrue(len(q["clinical_rationale"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_scalable_training_summary(self):
        """Validates overall training program summary metrics."""
        res = client.get("/api/v1/training/scale-summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_videos_produced"], 8)
        self.assertEqual(data["total_workshops_conducted"], 15)
        self.assertGreaterEqual(data["total_ashas_enrolled"], 1500)
        self.assertGreaterEqual(data["total_ashas_certified"], 1500)
        self.assertGreaterEqual(data["certification_rate_pct"], 95.0)
        self.assertGreaterEqual(data["mean_osce_score_pct"], 90.0)
        self.assertTrue(data["monthly_webinars_active"])
        self.assertEqual(data["status"], "SCALE_TRAINING_ACTIVE")


if __name__ == "__main__":
    unittest.main()
