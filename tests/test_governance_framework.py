"""
Unit tests for Sub-Phase 20.1: Governance Framework & Clinical Advisory Board
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestGovernanceFramework(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_data_governance_policy(self):
        """Test DPDP 2023 / DISHA data governance policy and right-to-forget SLA."""
        response = self.client.get("/api/v1/governance/data-policy")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["dpdp_compliance_status"], "FULLY_COMPLIANT")
        self.assertEqual(data["right_to_forget_sla_hours"], 72)
        self.assertIn("MDoNER", data["approving_authority"])

        tiers = data["retention_tiers"]
        self.assertEqual(len(tiers), 4)

        # Tier 1 Ephemeral Voice Audio
        tier1 = next(t for t in tiers if t["tier_id"] == "TIER-1-VOICE")
        self.assertTrue(tier1["auto_purge_enabled"])
        self.assertIn("<= 7 Days", tier1["retention_period"])

        # Tier 2 Longitudinal Biomarkers
        tier2 = next(t for t in tiers if t["tier_id"] == "TIER-2-BIOMARKERS")
        self.assertFalse(tier2["auto_purge_enabled"])
        self.assertIn("7 Years", tier2["retention_period"])
        self.assertIn("AES-256", tier2["encryption_standard"])

    def test_clinical_advisory_board(self):
        """Test Clinical Advisory Board roster, clinician specialties, and state representation."""
        response = self.client.get("/api/v1/governance/advisory-board")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["total_members"], 8)
        self.assertEqual(data["neurologists_count"], 5)
        self.assertEqual(data["geriatricians_count"], 3)
        self.assertEqual(data["meeting_cadence"], "Bi-Annual (April & October)")

        members = data["members"]
        self.assertEqual(len(members), 8)

        # Leadership verification
        chair = next(m for m in members if m["role"] == "CHAIR")
        self.assertEqual(chair["name"], "Dr. Hemanta Kumar Saikia")
        self.assertIn("GMCH", chair["institution"])

        vice_chair = next(m for m in members if m["role"] == "VICE_CHAIR")
        self.assertEqual(vice_chair["name"], "Dr. Nongthombam Joychandra Singh")
        self.assertIn("RIMS", vice_chair["institution"])

        # 8 States Representation
        states = [m["state"] for m in members]
        expected_states = ["Assam", "Manipur", "Sikkim", "Meghalaya", "Mizoram", "Arunachal Pradesh", "Tripura", "Nagaland"]
        self.assertEqual(sorted(states), sorted(expected_states))

    def test_ethics_review_sop(self):
        """Test Annual Institutional Ethics Review SOP and privacy budget caps."""
        response = self.client.get("/api/v1/governance/ethics-review")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["status"], "ACTIVE_SOP")
        self.assertEqual(data["differential_privacy_epsilon_cap"], 1.0)
        self.assertIn("ICMR", data["independent_ethics_committee"])

        pillars = data["pillars"]
        self.assertEqual(len(pillars), 4)
        for p in pillars:
            self.assertEqual(p["last_audit_status"], "PASSED")

        pillar_names = [p["pillar_name"] for p in pillars]
        self.assertTrue(any("Algorithmic Fairness" in n for n in pillar_names))
        self.assertTrue(any("Informed Consent" in n for n in pillar_names))
        self.assertTrue(any("Differential Privacy" in n for n in pillar_names))
        self.assertTrue(any("Cultural Sacredness" in n for n in pillar_names))

    def test_governance_summary(self):
        """Test consolidated governance status summary."""
        response = self.client.get("/api/v1/governance/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("20.1", data["sub_phase"])
        self.assertEqual(data["dpdp_compliance"], "FULLY_COMPLIANT")
        self.assertEqual(data["retention_tiers_count"], 4)
        self.assertEqual(data["right_to_forget_sla_hours"], 72)
        self.assertEqual(data["advisory_board_members_count"], 8)
        self.assertEqual(data["neurologists_represented"], 5)
        self.assertEqual(data["geriatricians_represented"], 3)
        self.assertEqual(data["ethics_review_pillars_count"], 4)
        self.assertEqual(data["governance_status"], "GOVERNANCE_ACTIVE_OPERATIONAL")


if __name__ == "__main__":
    unittest.main()
