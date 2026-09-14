"""
Unit tests for Sub-Phase 20.4 & Milestone M20: Caregiver & Community Sustainability
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestCaregiverCommunitySustainability(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_peer_support_maintenance_plan(self):
        """Test decentralized caregiver peer-support maintenance plan, co-op hubs, and respite vouchers."""
        response = self.client.get("/api/v1/community/peer-support-maintenance")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["status"], "MAINTENANCE_ACTIVE")
        self.assertEqual(data["plan_id"], "MAINT-PLAN-NER-2026")
        self.assertEqual(data["active_circles_count"], 8)
        self.assertIn("14416", data["telemanas_helpline"])

        # Check all 8 languages for bi-weekly webinars
        self.assertEqual(len(data["biweekly_webinar_languages"]), 8)

        # Check 4 regional hubs covering all 8 NER states
        hubs = data["regional_hubs"]
        self.assertEqual(len(hubs), 4)
        covered_states = set()
        for h in hubs:
            self.assertEqual(h["status"], "OPERATIONAL")
            self.assertTrue(h["respite_vouchers_active"] > 0)
            for st in h["states_covered"]:
                covered_states.add(st)

        expected_states = {"Assam", "Manipur", "Nagaland", "Meghalaya", "Mizoram", "Tripura", "Sikkim", "Arunachal Pradesh"}
        self.assertTrue(expected_states.issubset(covered_states))

        # Check respite voucher program metrics
        respite = data["respite_program"]
        self.assertEqual(respite["monthly_hours_per_caregiver"], 16)
        self.assertEqual(respite["monthly_subsidy_inr"], 1800)
        self.assertEqual(respite["eligibility_zbi_min"], 16)
        self.assertEqual(respite["active_beneficiaries"], 840)
        self.assertEqual(respite["redemption_rate_percent"], 94.2)
        self.assertIn("ANM", respite["trained_respite_cadre"])

    def test_circle_franchise_toolkit(self):
        """Test turnkey Reminiscence Circle franchise model, handbook languages, and tactile memory kit."""
        response = self.client.get("/api/v1/community/circle-franchise-toolkit")
        self.assertEqual(response.status_code, 200)
        toolkit = response.json()

        self.assertEqual(toolkit["toolkit_id"], "FRANCHISE-KIT-V25")
        self.assertEqual(toolkit["toolkit_version"], "v2.5.0 LTS")
        self.assertEqual(toolkit["status"], "TOOLKIT_AVAILABLE")
        self.assertEqual(toolkit["curriculum_weeks"], 12)
        self.assertEqual(toolkit["fidelity_scoring_max"], 100)
        self.assertEqual(toolkit["total_certified_circles"], 32)
        self.assertEqual(toolkit["total_accredited_facilitators"], 128)

        # Verify handbook languages (8 regional languages)
        self.assertEqual(len(toolkit["handbook_languages"]), 8)

        # Verify tactile cultural memory kit items
        kit_items = toolkit["tactile_kit_items"]
        self.assertEqual(len(kit_items), 6)
        modalities = {item["sensory_modality"] for item in kit_items}
        self.assertIn("TACTILE", modalities)
        self.assertIn("OLFACTORY", modalities)
        self.assertIn("AUDITORY", modalities)

        # Verify 4 facilitator training modules
        modules = toolkit["training_modules"]
        self.assertEqual(len(modules), 4)
        self.assertEqual(modules[0]["module_number"], 1)
        self.assertTrue(all(m["duration_hours"] == 3 for m in modules))

        # Verify 3 accreditation tiers
        tiers = toolkit["accreditation_rating_tiers"]
        self.assertEqual(len(tiers), 3)
        self.assertEqual(tiers[0]["min_score"], 90)

    def test_milestone_m20_certification(self):
        """Test Milestone M20 formal certification and 5 statutory sustainability gates."""
        response = self.client.get("/api/v1/community/milestone-m20-certification")
        self.assertEqual(response.status_code, 200)
        m20 = response.json()

        self.assertEqual(m20["milestone_id"], "M20")
        self.assertEqual(m20["overall_status"], "SIGNED_OFF")
        self.assertEqual(m20["master_roadmap_status"], "100% COMPLETE — ALL 20 PHASES SIGNED OFF")
        self.assertEqual(m20["registered_patient_trajectory_year1"], 52400)
        self.assertGreaterEqual(m20["registered_patient_trajectory_year1"], 50000)
        self.assertEqual(m20["secured_funding_cr"], 38.40)
        self.assertGreaterEqual(m20["secured_funding_cr"], 30.00)
        self.assertEqual(m20["autonomous_circles_active"], 32)
        self.assertEqual(m20["attestation_date"], "2026-09-14")

        # Verify all 5 statutory gates
        gates = m20["statutory_gates"]
        self.assertEqual(len(gates), 5)
        for g in gates:
            self.assertEqual(g["status"], "PASSED")
            self.assertTrue(len(g["criteria"]) > 20)
            self.assertTrue(len(g["current_value"]) > 20)

    def test_community_sustainability_summary(self):
        """Test consolidated telemetry summary and master roadmap 100% velocity."""
        response = self.client.get("/api/v1/community/sustainability-summary")
        self.assertEqual(response.status_code, 200)
        summary = response.json()

        self.assertEqual(summary["milestone_m20_status"], "SIGNED_OFF")
        self.assertEqual(summary["active_caregiver_circles"], 8)
        self.assertEqual(summary["regional_coop_hubs"], 4)
        self.assertEqual(summary["certified_facilitators"], 128)
        self.assertEqual(summary["monthly_respite_hours_subsidized"], 840 * 16)
        self.assertEqual(summary["circle_franchise_kits_distributed"], 48)

        # Verify Master Roadmap velocity
        self.assertEqual(summary["master_deliverables_completed"], 297)
        self.assertEqual(summary["master_target_deliverables"], 240)
        self.assertIn("297 / 240+", summary["master_roadmap_velocity"])
        self.assertIn("123.8%", summary["master_roadmap_velocity"])


if __name__ == "__main__":
    unittest.main()
