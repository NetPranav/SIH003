"""
Unit tests for Smriti-NER Community Facilitation Training (Sub-Phase 17.3)
Validates Reminiscence Circle Facilitation Certification (600+ ASHAs),
5-station OSCE clinical rubric (>=85% pass mark), and Oral Storytelling Capture
training with 3-tier informed cultural consent across 8 NER states.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCommunityFacilitationTraining(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_facilitation_certification_curriculum(self):
        """Validates the 4-module curriculum and 5-station OSCE evaluation rubric."""
        res = client.get("/api/v1/training/facilitation-certification")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Curriculum modules validation
        modules = data["curriculum_modules"]
        self.assertEqual(len(modules), 4)
        module_ids = {m["module_id"] for m in modules}
        self.assertEqual(module_ids, {"MOD-CF-01", "MOD-CF-02", "MOD-CF-03", "MOD-CF-04"})

        for m in modules:
            self.assertGreater(m["duration_hours"], 0)
            self.assertGreaterEqual(len(m["learning_objectives"]), 3)
            self.assertGreaterEqual(len(m["practical_exercises"]), 2)
            self.assertGreaterEqual(len(m["required_materials"]), 3)

        # OSCE stations validation
        stations = data["osce_stations"]
        self.assertEqual(len(stations), 5)
        station_ids = {s["station_id"] for s in stations}
        self.assertEqual(station_ids, {"OSCE-01", "OSCE-02", "OSCE-03", "OSCE-04", "OSCE-05"})

        for s in stations:
            self.assertEqual(s["max_points"], 20)
            self.assertGreaterEqual(s["passing_score"], 17)
            self.assertGreaterEqual(len(s["clinical_checklist"]), 4)

        self.assertEqual(data["overall_pass_mark_pct"], 85.0)
        self.assertGreaterEqual(data["total_training_hours"], 16)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_storytelling_capture_protocol(self):
        """Validates 3-tier informed consent, hardware-grade encryption, and 8 regional folklore prompts."""
        res = client.get("/api/v1/training/storytelling-capture")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # 3-tier consent validation
        tiers = data["consent_tiers"]
        self.assertEqual(len(tiers), 3)
        tier_levels = {t["tier_level"] for t in tiers}
        self.assertEqual(tier_levels, {1, 2, 3})

        for t in tiers:
            self.assertTrue(len(t["tier_name"]) > 0)
            self.assertTrue(len(t["verification_mechanism"]) > 0)
            self.assertTrue(len(t["data_retention_rule"]) > 0)

        # Regional prompts validation across 8 states
        prompts = data["regional_folklore_prompts"]
        self.assertEqual(len(prompts), 8)

        for p in prompts:
            self.assertTrue(p["prompt_id"].startswith("PROMPT-"))
            self.assertTrue(len(p["theme"]) > 0)
            self.assertTrue(len(p["opening_question_vernacular"]) > 0)
            self.assertTrue(len(p["opening_question_english"]) > 0)
            self.assertTrue(len(p["tactile_stimulus"]) > 0)
            self.assertLessEqual(p["suggested_duration_minutes"], 7)

        # Hardware and acoustic limits
        self.assertIn("AES-256", data["on_device_encryption"])
        self.assertEqual(data["microphone_distance_cm"], 30)
        self.assertLessEqual(data["max_story_duration_minutes"], 7)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_facilitation_summary(self):
        """Validates consolidated summary metrics for Community Facilitation Training."""
        res = client.get("/api/v1/training/facilitation-summary")
        self.assertEqual(res.status_code, 200)
        summary = res.json()

        self.assertGreaterEqual(summary["total_certified_facilitators"], 600)
        self.assertEqual(summary["total_certified_facilitators"], 640)
        self.assertEqual(summary["target_facilitators"], 600)
        self.assertGreaterEqual(summary["total_storytelling_trained_ashas"], 1500)
        self.assertEqual(summary["phcs_covered"], 90)
        self.assertEqual(summary["states_covered"], 8)
        self.assertGreaterEqual(summary["mean_osce_score_pct"], 90.0)
        self.assertEqual(summary["osce_pass_mark_pct"], 85.0)
        self.assertEqual(summary["consent_audit_compliance_pct"], 100.0)
        self.assertEqual(summary["status"], "COMMUNITY_FACILITATION_ACTIVE")


if __name__ == "__main__":
    unittest.main()
