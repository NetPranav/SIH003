"""
Unit tests for Smriti-NER IVR & Social Feature Scale-Out (Sub-Phase 16.4 & Milestone M16)
Validates 4-circle telecom scaling (1800-890-SMRITI across 8 states),
5-stage Community Reminiscence Circle rollout playbook, and Milestone M16 certification.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIvrSocialScaleout(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_telecom_circles_configuration(self):
        """Validates all 4 telecom circles cover all 8 states with 340 concurrent channels."""
        res = client.get("/api/v1/scaleout/telecom-circles")
        self.assertEqual(res.status_code, 200)
        circles = res.json()
        self.assertEqual(len(circles), 4)

        all_states = set()
        total_channels = 0
        for c in circles:
            all_states.update(c["covered_states"])
            total_channels += c["concurrent_channels"]
            self.assertEqual(c["status"], "ACTIVE_ROUTING")
            self.assertIn("1800-890", c["toll_free_helpline"])
            self.assertGreaterEqual(c["mean_opinion_score"], 3.6)

        expected_states = {
            "Assam", "Meghalaya", "Mizoram", "Tripura",
            "Arunachal Pradesh", "Manipur", "Nagaland", "Sikkim"
        }
        self.assertEqual(all_states, expected_states)
        self.assertEqual(total_channels, 340)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_community_circle_playbook_stages(self):
        """Validates the 5-stage sequential Community Reminiscence Circle playbook."""
        res = client.get("/api/v1/scaleout/community-playbook")
        self.assertEqual(res.status_code, 200)
        stages = res.json()
        self.assertEqual(len(stages), 5)

        for i, s in enumerate(stages, 1):
            self.assertEqual(s["stage_number"], i)
            self.assertGreater(len(s["lead_stakeholders"]), 0)
            self.assertGreater(len(s["key_activities"]), 0)
            self.assertTrue(len(s["deliverable"]) > 0)
            self.assertTrue(len(s["verification_gate"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m16_certification(self):
        """Validates official sign-off certification for Milestone M16: Multi-State Readiness Certified."""
        res = client.get("/api/v1/scaleout/milestone-m16-certification")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["milestone_id"], "M16")
        self.assertEqual(data["status"], "SIGNED_OFF")
        self.assertEqual(data["total_phcs_onboarded"], 90)
        self.assertEqual(data["total_states_covered"], 8)
        self.assertEqual(data["total_toll_free_channels"], 340)
        self.assertEqual(data["community_playbook_adopted_phcs"], 90)

        self.assertEqual(len(data["gates"]), 5)
        for g in data["gates"]:
            self.assertEqual(g["status"], "PASSED")


if __name__ == "__main__":
    unittest.main()
