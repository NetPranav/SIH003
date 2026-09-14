"""
Unit tests for Sub-Phase 20.3: Continuous Improvement Pipeline
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestContinuousImprovement(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_release_calendar(self):
        """Test 12-month release engineering calendar and semantic version progression."""
        response = self.client.get("/api/v1/improvement/release-calendar")
        self.assertEqual(response.status_code, 200)
        releases = response.json()

        self.assertEqual(len(releases), 12)
        self.assertEqual(releases[0]["version"], "v2.5.0")
        self.assertEqual(releases[-1]["version"], "v4.0.0")

        # Verify all releases have deployment dates and focus areas
        for r in releases:
            self.assertTrue(len(r["focus_area"]) > 0)
            self.assertTrue(len(r["deployment_date"]) == 10)
            self.assertIn(r["release_type"], ["FEATURE", "CONTENT", "MODEL_RETRAIN", "HOTFIX", "MAJOR"])

    def test_development_roadmap(self):
        """Test novel cognitive game and social feature development roadmap."""
        response = self.client.get("/api/v1/improvement/development-roadmap")
        self.assertEqual(response.status_code, 200)
        roadmap = response.json()

        self.assertEqual(len(roadmap), 3)
        titles = [f["title"] for f in roadmap]
        self.assertIn("Majuli River Crossing", titles)
        self.assertIn("Cheraw Bamboo Rhythm Tap", titles)
        self.assertIn("Family Tree Story Builder", titles)

        for f in roadmap:
            self.assertTrue(len(f["cultural_theme"]) > 0)
            self.assertTrue(len(f["cognitive_domain"]) > 0)
            self.assertTrue(len(f["mechanics_description"]) > 20)

    def test_model_retraining_sop(self):
        """Test quarterly model retraining SOP, drift threshold, and target parameters."""
        response = self.client.get("/api/v1/improvement/retraining-sop")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["status"], "ACTIVE_SOP")
        self.assertEqual(len(data["quarterly_schedule"]), 4)
        self.assertEqual(data["psi_drift_threshold"], 0.10)
        self.assertEqual(data["mmse_proxy_validation_r2_target"], 0.76)
        self.assertEqual(data["fedprox_mu"], 0.01)

        models = data["models_retrained"]
        self.assertEqual(len(models), 3)
        self.assertTrue(any("BKT" in m for m in models))
        self.assertTrue(any("MMSE Proxy" in m for m in models))
        self.assertTrue(any("FedProx" in m for m in models))

    def test_crowdsourcing_portal(self):
        """Test crowdsourcing cultural asset portal configuration and 3-tier moderation."""
        response = self.client.get("/api/v1/improvement/crowdsourcing-portal")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["status"], "PORTAL_ACTIVE")
        self.assertIn("crowd.smriti.ner.gov.in", data["portal_url"])
        self.assertEqual(len(data["supported_languages"]), 8)
        self.assertGreaterEqual(len(data["supported_media_formats"]), 4)
        self.assertGreaterEqual(data["total_submissions_approved"], 1000)

        tiers = data["moderation_tiers"]
        self.assertEqual(len(tiers), 3)
        tier_names = [t["name"] for t in tiers]
        self.assertTrue(any("AI Guardrail" in n for n in tier_names))
        self.assertTrue(any("Facilitator Circle" in n for n in tier_names))
        self.assertTrue(any("Clinical Advisory" in n for n in tier_names))

    def test_continuous_improvement_summary(self):
        """Test consolidated continuous improvement pipeline metrics summary."""
        response = self.client.get("/api/v1/improvement/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("20.3", data["sub_phase"])
        self.assertEqual(data["annual_releases_count"], 12)
        self.assertEqual(data["new_features_planned_count"], 3)
        self.assertEqual(data["model_retraining_quarterly_cadence"], 4)
        self.assertEqual(data["psi_drift_threshold"], 0.10)
        self.assertEqual(data["crowdsourced_assets_approved"], 1240)
        self.assertEqual(data["pipeline_status"], "CONTINUOUS_DELIVERY_ACTIVE")


if __name__ == "__main__":
    unittest.main()
