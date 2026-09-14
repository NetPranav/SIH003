"""
Unit tests for Smriti-NER Accessibility Audit (WCAG 2.2 AAA Target)
Sub-Phase 13.2: Automated Scan (Lighthouse 100), Contrast Verification (≥7:1), Screen Reader Audit, and Elderly UAT
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAccessibilityAudit(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_color_contrast_audit_aaa(self):
        """Tests that all core theme palette pairs exceed the strict 7:1 WCAG AAA threshold."""
        res = client.get("/api/v1/a11y/contrast-audit")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(len(data), 5)
        for pair in data:
            self.assertTrue(pair["wcag_aaa_pass"], f"Contrast failure for {pair['element_name']}")
            self.assertGreaterEqual(pair["contrast_ratio"], 7.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_screen_reader_aria_audit(self):
        """Tests screen reader semantic landmarks, zero missing alt texts, and aria live regions."""
        res = client.get("/api/v1/a11y/screen-reader-audit")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "PASS")
        self.assertEqual(data["missing_alt_count"], 0)
        self.assertGreaterEqual(data["live_regions_count"], 3)
        self.assertIn("main", data["landmarks_declared"])
        self.assertIn("nav", data["landmarks_declared"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_elderly_uat_cohort_metrics(self):
        """Tests empirical results of 10 elderly participants (65+) exceeding benchmark targets."""
        res = client.get("/api/v1/a11y/elderly-uat")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["participants"]), 10)
        # Verify >= 85% task completion rate
        self.assertGreaterEqual(data["overall_completion_pct"], data["target_completion_min_pct"])
        # Verify SUS score > 80
        self.assertGreater(data["average_sus_score"], 80.0)
        self.assertEqual(data["status"], "EXCEEDS_BENCHMARK")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_wcag_aaa_summary_certification(self):
        """Tests overall Level AAA certification with Lighthouse 100 and zero axe-core violations."""
        res = client.get("/api/v1/a11y/wcag-aaa-summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["lighthouse_accessibility_score"], 100)
        self.assertEqual(data["axe_core_violations_count"], 0)
        self.assertEqual(data["contrast_aaa_pass_rate_pct"], 100.0)
        self.assertEqual(data["screen_reader_readiness_pct"], 100.0)
        self.assertEqual(data["status"], "AAA_CERTIFIED")


if __name__ == "__main__":
    unittest.main()
