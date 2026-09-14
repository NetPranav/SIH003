"""
Unit tests for Smriti-NER IVR Support Training & Milestone M17 (Sub-Phase 17.4)
Validates 5 IVR troubleshooting failure scenarios, 4-step No-Device onboarding SOP,
and Milestone M17 certification (1,500+ ASHA Workers Trained & Certified across 8 states).
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIvrSupportTraining(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ivr_troubleshooting_scenarios(self):
        """Validates all 5 standardized frontline IVR failure troubleshooting scenarios."""
        res = client.get("/api/v1/training/ivr-troubleshooting")
        self.assertEqual(res.status_code, 200)
        scenarios = res.json()
        self.assertEqual(len(scenarios), 5)

        scenario_ids = {s["scenario_id"] for s in scenarios}
        self.assertEqual(scenario_ids, {"IVR-ERR-01", "IVR-ERR-02", "IVR-ERR-03", "IVR-ERR-04", "IVR-ERR-05"})

        for s in scenarios:
            self.assertTrue(len(s["symptom"]) > 0)
            self.assertTrue(len(s["root_cause"]) > 0)
            self.assertGreaterEqual(len(s["diagnostic_steps"]), 2)
            self.assertGreaterEqual(len(s["frontline_resolution"]), 2)
            self.assertTrue(len(s["fallback_action"]) > 0)
            self.assertIn(s["severity"], {"LOW", "MEDIUM", "HIGH"})

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_no_device_onboarding_sop(self):
        """Validates the 4-step SOP for registering and coaching feature-phone-only elders."""
        res = client.get("/api/v1/training/no-device-onboarding")
        self.assertEqual(res.status_code, 200)
        steps = res.json()
        self.assertEqual(len(steps), 4)

        step_numbers = [s["step_number"] for s in steps]
        self.assertEqual(step_numbers, [1, 2, 3, 4])

        # Verify offline capabilities for survey, tablet registration, and card issuance
        self.assertTrue(steps[0]["offline_capability"])
        self.assertTrue(steps[1]["offline_capability"])
        self.assertFalse(steps[2]["offline_capability"])  # Live trial call requires network
        self.assertTrue(steps[3]["offline_capability"])

        for s in steps:
            self.assertTrue(len(s["step_name"]) > 0)
            self.assertTrue(len(s["lead_role"]) > 0)
            self.assertGreaterEqual(len(s["required_actions"]), 3)
            self.assertTrue(len(s["verification_output"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m17_certification(self):
        """Validates formal Milestone M17 certification and 5 passed quality gates."""
        res = client.get("/api/v1/training/milestone-m17-certification")
        self.assertEqual(res.status_code, 200)
        cert = res.json()

        self.assertEqual(cert["milestone_id"], "M17")
        self.assertEqual(cert["status"], "SIGNED_OFF")
        self.assertGreaterEqual(cert["total_ashas_trained"], 1500)
        self.assertGreaterEqual(cert["total_ashas_certified"], 1500)
        self.assertEqual(cert["total_ashas_certified"], 1510)
        self.assertGreaterEqual(cert["circle_facilitators_certified"], 600)
        self.assertEqual(cert["circle_facilitators_certified"], 640)
        self.assertGreaterEqual(cert["ivr_support_certified_ashas"], 1500)
        self.assertEqual(cert["states_covered"], 8)
        self.assertEqual(cert["phcs_covered"], 90)
        self.assertGreaterEqual(cert["mean_osce_score_pct"], 85.0)

        gates = cert["gates"]
        self.assertEqual(len(gates), 5)
        for g in gates:
            self.assertEqual(g["status"], "PASSED")
            self.assertTrue(len(g["required_threshold"]) > 0)
            self.assertTrue(len(g["achieved_value"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ivr_support_summary(self):
        """Validates consolidated summary metrics for Sub-Phase 17.4."""
        res = client.get("/api/v1/training/ivr-support-summary")
        self.assertEqual(res.status_code, 200)
        summary = res.json()

        self.assertEqual(summary["total_troubleshooting_scenarios"], 5)
        self.assertEqual(summary["onboarding_steps_count"], 4)
        self.assertEqual(summary["total_certified_ashas"], 1510)
        self.assertGreaterEqual(summary["no_device_elders_onboarded"], 5000)
        self.assertEqual(summary["no_device_elders_onboarded"], 5420)
        self.assertIn("1800-890-SMRITI", summary["toll_free_helpline"])
        self.assertGreaterEqual(summary["mean_ivr_call_success_rate_pct"], 95.0)
        self.assertEqual(summary["milestone_m17_status"], "SIGNED_OFF")
        self.assertEqual(summary["status"], "IVR_SUPPORT_TRAINING_ACTIVE")


if __name__ == "__main__":
    unittest.main()
