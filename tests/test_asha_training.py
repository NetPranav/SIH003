"""
Unit tests for Smriti-NER ASHA Worker Training Program
Sub-Phase 14.2: 40-hour 4-module curriculum, 20 Lead Master ASHA certifications (OSCE >= 85%),
Group reminiscence circle facilitation guides, and 3-tiered rural field help desk with SLA tracking.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAshaTraining(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_curriculum_modules_coverage(self):
        """Validates that 4 core training modules are present totaling 40 hours of accredited coursework."""
        res = client.get("/api/v1/training/curriculum-modules")
        self.assertEqual(res.status_code, 200)
        modules = res.json()
        self.assertEqual(len(modules), 4)
        total_hours = sum(m["duration_hours"] for m in modules)
        self.assertEqual(total_hours, 40)
        module_codes = {m["module_code"] for m in modules}
        self.assertIn("DEM-LIT-01", module_codes)
        self.assertIn("DEV-OPS-02", module_codes)
        self.assertIn("AACB-EMP-03", module_codes)
        self.assertIn("CONS-DISHA-04", module_codes)
        for m in modules:
            self.assertGreaterEqual(len(m["competency_objectives"]), 3)
            self.assertIn("as", m["languages_available"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_certified_master_ashas_roster(self):
        """Validates that exactly 20 Lead Master ASHA workers (2 per PHC) are certified with OSCE >= 85%."""
        res = client.get("/api/v1/training/certified-trainers")
        self.assertEqual(res.status_code, 200)
        trainers = res.json()
        self.assertEqual(len(trainers), 20)
        for t in trainers:
            self.assertGreaterEqual(t["osce_score_pct"], 85.0, f"OSCE below passing standard: {t['name']}")
            self.assertTrue(t["certification_hash"].startswith("sha256_"))
            self.assertTrue(len(t["primary_language"]) >= 2)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_community_circle_facilitation_guide(self):
        """Validates community circle session plans, cultural prompts, and explicit consent checklists."""
        res = client.get("/api/v1/training/circle-facilitation-guide")
        self.assertEqual(res.status_code, 200)
        plans = res.json()
        self.assertGreaterEqual(len(plans), 2)
        for p in plans:
            self.assertTrue(4 <= p["target_participants"] <= 8)
            self.assertGreaterEqual(len(p["cultural_prompts"]), 2)
            self.assertGreaterEqual(len(p["consent_checklist"]), 2)
            self.assertTrue(len(p["calming_melody_preset"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_field_helpdesk_tiers_and_sla(self):
        """Validates 3-tiered field help desk operational state, resolution SLAs, and ticket counts."""
        res = client.get("/api/v1/training/helpdesk-status")
        self.assertEqual(res.status_code, 200)
        tiers = res.json()
        self.assertEqual(len(tiers), 3)
        tier_names = [t["tier"] for t in tiers]
        self.assertEqual(tier_names, ["TIER_1_ASHA_LEAD", "TIER_2_FIELD_ENGINEER", "TIER_3_MEDICAL_OFFICER"])
        # Tier 1 SLA must be <= 30 mins (0.5 hr)
        self.assertLessEqual(tiers[0]["sla_max_hours"], 0.5)
        # Tier 2 SLA must be <= 2.0 hrs
        self.assertLessEqual(tiers[1]["sla_max_hours"], 2.0)
        # Total resolved tickets should show active field usage
        total_resolved = sum(t["resolved_tickets_count"] for t in tiers)
        self.assertGreater(total_resolved, 50)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_asha_training_summary(self):
        """Validates consolidated training summary metrics and cascade readiness."""
        res = client.get("/api/v1/training/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["modules_created"], 4)
        self.assertEqual(data["total_training_hours"], 40)
        self.assertEqual(data["master_ashas_certified"], 20)
        self.assertGreater(data["average_osce_score_pct"], 90.0)
        self.assertTrue(data["circle_facilitation_ready"])
        self.assertTrue(data["helpdesk_operational"])
        self.assertEqual(data["status"], "TRAINING_COMPLETE_CASCADE_READY")


if __name__ == "__main__":
    unittest.main()
