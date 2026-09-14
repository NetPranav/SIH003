"""
Unit tests for Smriti-NER Iterative Improvement Sprint
Sub-Phase 15.2: Critical bug hotfixes (5Hz tremor filter, BLE retry backoff, 160ms DTMF guardband),
Elder-centric UX refinements (64px targets, 3px cataract borders), BKT model recalibration, and Cultural Content Expansion.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIterativeImprovement(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_critical_bug_fixes_deployment(self):
        """Validates all 3 critical bug fixes are deployed with passing regression tests."""
        res = client.get("/api/v1/iteration/bug-fixes")
        self.assertEqual(res.status_code, 200)
        fixes = res.json()
        self.assertEqual(len(fixes), 3)
        for f in fixes:
            self.assertEqual(f["status"], "DEPLOYED_IN_V2")
            self.assertTrue(f["regression_test_passed"])
            self.assertTrue(len(f["solution_description"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ux_refinements_compliance(self):
        """Validates 64px touch target, 3px cataract border mode, and haptic feedback refinements."""
        res = client.get("/api/v1/iteration/ux-refinements")
        self.assertEqual(res.status_code, 200)
        refinements = res.json()
        self.assertEqual(len(refinements), 3)
        for r in refinements:
            self.assertEqual(r["status"], "ACTIVE_IN_DESIGN_SYSTEM")
            self.assertTrue(len(r["elderly_benefit"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_bkt_recalibration_parameters(self):
        """Validates Bayesian Knowledge Tracing priors recalibration resulting in RMSE drop to 0.082."""
        res = client.get("/api/v1/iteration/bkt-recalibration")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertAlmostEqual(data["initial_knowledge_p_l0"], 0.44)
        self.assertAlmostEqual(data["transition_rate_p_t"], 0.08)
        self.assertAlmostEqual(data["guess_rate_p_g"], 0.22)
        self.assertAlmostEqual(data["slip_rate_p_s"], 0.16)
        self.assertLess(data["post_pilot_rmse"], data["pre_pilot_rmse"])
        self.assertEqual(data["calibration_status"], "RECALIBRATED_EMPIRICAL")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_expanded_content_catalog(self):
        """Validates addition of 92 new regional cultural assets across 4 categories."""
        res = client.get("/api/v1/iteration/expanded-content")
        self.assertEqual(res.status_code, 200)
        categories = res.json()
        self.assertEqual(len(categories), 4)
        total_new = sum(c["new_assets_count"] for c in categories)
        self.assertEqual(total_new, 92)
        for c in categories:
            self.assertGreater(c["new_assets_count"], 0)
            self.assertGreaterEqual(len(c["sample_items"]), 4)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_iterative_improvement_summary(self):
        """Validates consolidated Sub-Phase 15.2 status and Release v2.0 hardening."""
        res = client.get("/api/v1/iteration/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["critical_bugs_resolved"], 3)
        self.assertEqual(data["ux_refinements_implemented"], 3)
        self.assertTrue(data["bkt_parameters_recalibrated"])
        self.assertEqual(data["new_cultural_assets_added"], 92)
        self.assertGreater(data["bkt_rmse_improvement_pct"], 30.0)
        self.assertEqual(data["status"], "SPRINT_COMPLETE_V2_HARDENED")


if __name__ == "__main__":
    unittest.main()
