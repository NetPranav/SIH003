"""
Unit tests for Smriti-NER Post-Pilot Feedback Synthesis & Prioritization
Sub-Phase 15.1: Multi-stakeholder feedback categorization (312 submissions), Root Cause Analysis (RCA) on key friction points,
Cultural sensitivity review, and MoSCoW prioritization for Release v2.0.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestFeedbackSynthesis(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_feedback_backlog_retrieval_and_filtering(self):
        """Validates prioritized feedback items and category filtering across Bugs, UX, Features, and Cultural."""
        res = client.get("/api/v1/feedback/backlog")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertGreaterEqual(len(items), 4)
        for item in items:
            self.assertIn(item["category"], ["BUG_REPORT", "UX_ERGONOMICS", "FEATURE_REQUEST", "CULTURAL_LINGUISTIC"])
            self.assertIn(item["moscow_category"], ["MUST_HAVE", "SHOULD_HAVE", "COULD_HAVE"])
            self.assertTrue(len(item["proposed_fix"]) > 0)

        # Test category filter
        ux_res = client.get("/api/v1/feedback/backlog?category=UX_ERGONOMICS")
        self.assertEqual(ux_res.status_code, 200)
        ux_items = ux_res.json()
        for item in ux_items:
            self.assertEqual(item["category"], "UX_ERGONOMICS")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_rca_investigations_and_remediations(self):
        """Validates Root Cause Analysis on tremor vs tapping, monsoonal circadian shift, and 2G DTMF truncation."""
        res = client.get("/api/v1/feedback/rca-reports")
        self.assertEqual(res.status_code, 200)
        reports = res.json()
        self.assertEqual(len(reports), 3)
        rca_ids = {r["rca_id"] for r in reports}
        self.assertEqual(rca_ids, {"RCA-001", "RCA-002", "RCA-003"})
        for r in reports:
            self.assertEqual(r["status"], "REMEDIATED_IN_V2")
            self.assertGreaterEqual(len(r["affected_components"]), 1)
            self.assertTrue(len(r["technical_remediation"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_cultural_adjustments_log(self):
        """Validates linguistic honorifics, folklore botany, and dialect cadence adjustments."""
        res = client.get("/api/v1/feedback/cultural-adjustments")
        self.assertEqual(res.status_code, 200)
        adjustments = res.json()
        self.assertGreaterEqual(len(adjustments), 3)
        langs = {a["language"] for a in adjustments}
        self.assertIn("as", langs)
        self.assertIn("mni", langs)
        self.assertIn("kha", langs)
        for a in adjustments:
            self.assertTrue(len(a["refined_item"]) > 0)
            self.assertTrue(len(a["approved_by"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_feedback_synthesis_summary_metrics(self):
        """Validates consolidated feedback summary counts and Release v2.0 backlog triage."""
        res = client.get("/api/v1/feedback/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_feedback_submissions"], 312)
        self.assertEqual(data["bugs_count"], 48)
        self.assertEqual(data["ux_ergonomics_count"], 112)
        self.assertEqual(data["feature_requests_count"], 84)
        self.assertEqual(data["cultural_adjustments_count"], 68)
        self.assertEqual(data["rca_investigations_completed"], 3)
        self.assertEqual(data["must_haves_count"], 8)
        self.assertEqual(data["status"], "SYNTHESIS_COMPLETE_BACKLOG_PRIORITIZED")


if __name__ == "__main__":
    unittest.main()
