"""
Unit tests for Sub-Phase 19.2: Community Awareness Campaign
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestCommunityAwarenessCampaign(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_campaign_schedule(self):
        """Test village-level awareness campaign schedule across 16 target districts."""
        # Full schedule
        response = self.client.get("/api/v1/campaign/schedule")
        self.assertEqual(response.status_code, 200)
        items = response.json()
        self.assertEqual(len(items), 16)

        total_panchayats = sum(i["target_panchayats"] for i in items)
        total_elders = sum(i["target_elders"] for i in items)
        total_ashas = sum(i["asha_pairs_deployed"] for i in items)

        self.assertGreaterEqual(total_panchayats, 300)
        self.assertGreaterEqual(total_elders, 22000)
        self.assertGreaterEqual(total_ashas, 600)

        # Filter by district
        resp_filtered = self.client.get("/api/v1/campaign/schedule?district_id=dist_kamrup")
        self.assertEqual(resp_filtered.status_code, 200)
        filtered = resp_filtered.json()
        self.assertEqual(len(filtered), 1)
        self.assertEqual(filtered[0]["district_name"], "Kamrup Metropolitan")
        self.assertEqual(filtered[0]["state"], "Assam")

    def test_radio_spot_scripts(self):
        """Test vernacular radio broadcast scripts in all 8 regional languages."""
        response = self.client.get("/api/v1/campaign/radio-scripts")
        self.assertEqual(response.status_code, 200)
        scripts = response.json()
        self.assertEqual(len(scripts), 8)

        expected_codes = ["as", "bn", "brx", "mni", "lus", "kha", "grt", "en"]
        codes = [s["language_code"] for s in scripts]
        self.assertEqual(sorted(codes), sorted(expected_codes))

        for s in scripts:
            self.assertGreaterEqual(s["duration_seconds"], 35)
            self.assertLessEqual(s["duration_seconds"], 60)
            self.assertGreaterEqual(len(s["stations"]), 2)
            self.assertGreaterEqual(len(s["broadcast_windows"]), 2)
            self.assertTrue(len(s["script_text_vernacular"]) > 20)
            self.assertTrue(len(s["call_to_action"]) > 0)

        # Filter by language
        resp_lang = self.client.get("/api/v1/campaign/radio-scripts?language_code=lus")
        self.assertEqual(resp_lang.status_code, 200)
        mizo_script = resp_lang.json()
        self.assertEqual(len(mizo_script), 1)
        self.assertEqual(mizo_script[0]["language_name"], "Mizo")
        self.assertIn("Hriatna Tichaktu", mizo_script[0]["spot_title"])

    def test_partnership_mous(self):
        """Test NGO & SHG institutional partnership MOUs."""
        response = self.client.get("/api/v1/campaign/partnerships")
        self.assertEqual(response.status_code, 200)
        mous = response.json()
        self.assertEqual(len(mous), 4)

        partners = [m["partner_name"] for m in mous]
        self.assertTrue(any("HelpAge India" in p for p in partners))
        self.assertTrue(any("ARDSI" in p for p in partners))
        self.assertTrue(any("NERLP" in p for p in partners))
        self.assertTrue(any("Sikkim Senior Citizens" in p for p in partners))

        for mou in mous:
            self.assertEqual(mou["status"], "ACTIVE")
            self.assertGreaterEqual(len(mou["core_deliverables"]), 3)
            self.assertGreaterEqual(mou["term_duration_years"], 2)
            self.assertTrue(len(mou["signatory_authority"]) > 0)

    def test_awareness_campaign_summary(self):
        """Test consolidated awareness campaign metrics summary."""
        response = self.client.get("/api/v1/campaign/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("19.2", data["sub_phase"])
        self.assertEqual(data["target_districts_count"], 16)
        self.assertGreaterEqual(data["total_target_panchayats"], 300)
        self.assertGreaterEqual(data["total_target_elders"], 22000)
        self.assertEqual(data["radio_languages_count"], 8)
        self.assertEqual(data["active_mous_count"], 4)
        self.assertEqual(data["campaign_status"], "CAMPAIGN_ROLLOUT_ACTIVE")


if __name__ == "__main__":
    unittest.main()
