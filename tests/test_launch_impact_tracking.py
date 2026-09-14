"""
Unit tests for Sub-Phase 19.4: Launch Impact Tracking & Milestone M19 Sign-Off
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestLaunchImpactTracking(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_enrollment_dashboard(self):
        """Test real-time enrollment dashboard metrics and state distributions."""
        response = self.client.get("/api/v1/impact/enrollment-dashboard")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["total_enrolled_patients"], 14850)
        self.assertEqual(data["app_users"], 7158)
        self.assertEqual(data["ivr_users"], 5732)
        self.assertEqual(data["pwa_users"], 1960)
        self.assertEqual(data["app_users"] + data["ivr_users"] + data["pwa_users"], 14850)

        self.assertEqual(data["daily_active_users"], 5240)
        self.assertEqual(data["monthly_active_users"], 12890)
        self.assertAlmostEqual(data["engagement_stickiness_percent"], 40.65, places=1)

        # State breakdown validation
        states = data["state_distribution"]
        self.assertEqual(len(states), 8)
        state_names = [s["state"] for s in states]
        expected_states = ["Assam", "Meghalaya", "Manipur", "Tripura", "Mizoram", "Nagaland", "Arunachal Pradesh", "Sikkim"]
        self.assertEqual(sorted(state_names), sorted(expected_states))
        self.assertEqual(sum(s["total_enrolled"] for s in states), 14850)

    def test_ccei_public_report(self):
        """Test population-level CCEI trend report and clinical risk stratification."""
        response = self.client.get("/api/v1/impact/ccei-public-report")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["report_quarter"], "Q3 2026")
        self.assertEqual(data["overall_mean_ccei"], 68.4)
        self.assertEqual(data["standard_deviation"], 11.2)

        # Sub-indices validation
        self.assertGreater(data["accuracy_trend_avg"], 60.0)
        self.assertGreater(data["response_time_stability_avg"], 60.0)
        self.assertGreater(data["session_frequency_avg"], 60.0)
        self.assertGreater(data["aacb_calmness_avg"], 60.0)
        self.assertGreater(data["social_participation_avg"], 60.0)

        # Risk tier validation
        green = data["green_tier_count"]
        amber = data["amber_tier_count"]
        red = data["red_tier_count"]
        self.assertEqual(green + amber + red, 14850)
        self.assertAlmostEqual(data["green_tier_percent"] + data["amber_tier_percent"] + data["red_tier_percent"], 100.0, places=1)
        self.assertEqual(data["cognitive_decline_attenuation_percent"], 28.4)

    def test_milestone_m19_certification(self):
        """Test statutory Milestone M19 certification gates and sign-off status."""
        response = self.client.get("/api/v1/impact/milestone-m19-certification")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["milestone_id"], "M19")
        self.assertEqual(data["milestone_name"], "Pan-NER Public Launch Complete")
        self.assertEqual(data["status"], "SIGNED_OFF")
        self.assertEqual(data["total_states_covered"], 8)
        self.assertEqual(data["total_patients_enrolled"], 14850)
        self.assertEqual(data["total_ashas_deployed"], 1680)

        gates = data["gates"]
        self.assertEqual(len(gates), 5)
        for g in gates:
            self.assertEqual(g["status"], "PASSED")
            self.assertTrue(len(g["achieved_status"]) > 0)

    def test_launch_impact_summary(self):
        """Test consolidated launch impact summary endpoint."""
        response = self.client.get("/api/v1/impact/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("19.4", data["sub_phase"])
        self.assertEqual(data["total_enrolled_patients"], 14850)
        self.assertEqual(data["channels_active"], 3)
        self.assertEqual(data["daily_active_users"], 5240)
        self.assertEqual(data["monthly_active_users"], 12890)
        self.assertEqual(data["overall_mean_ccei"], 68.4)
        self.assertEqual(data["milestone_m19_status"], "SIGNED_OFF")
        self.assertEqual(data["phase_status"], "PHASE_19_100_PERCENT_COMPLETE")


if __name__ == "__main__":
    unittest.main()
