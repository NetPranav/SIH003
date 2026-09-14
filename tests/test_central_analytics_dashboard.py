"""
Unit tests for Smriti-NER Central Analytics Dashboard (Sub-Phase 18.1)
Validates Pan-NER GIS district telemetry (16 districts), 8-state comparative benchmark matrix,
and auto-generated monthly policy briefs for MDoNER officials.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCentralAnalyticsDashboard(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_district_geo_telemetry(self):
        """Validates geolocated GIS telemetry for 16 primary district clusters across all 8 NER states."""
        res = client.get("/api/v1/analytics/gis-districts")
        self.assertEqual(res.status_code, 200)
        districts = res.json()
        self.assertEqual(len(districts), 16)

        states = {d["state_code"] for d in districts}
        self.assertEqual(states, {"AS", "ML", "MN", "TR", "AR", "NL", "MZ", "SK"})

        total_patients = sum(d["enrolled_patients"] for d in districts)
        self.assertEqual(total_patients, 5300)

        for d in districts:
            self.assertTrue(d["district_id"].startswith("DIST-"))
            self.assertTrue(22.0 <= d["latitude"] <= 29.5)
            self.assertTrue(88.0 <= d["longitude"] <= 97.5)
            self.assertGreater(d["enrolled_patients"], 0)
            self.assertGreater(d["active_ashas"], 0)
            self.assertGreater(d["mean_ccei_score"], 70.0)
            self.assertIn(d["alert_level"], {"OPTIMAL", "ATTENTION_REQUIRED", "ELEVATED_RISK"})
            self.assertTrue(len(d["dominant_dialect"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_state_comparisons(self):
        """Validates 8-state comparative benchmark analytics matrix."""
        res = client.get("/api/v1/analytics/state-comparisons")
        self.assertEqual(res.status_code, 200)
        state_metrics = res.json()
        self.assertEqual(len(state_metrics), 8)

        total_phcs = sum(s["phcs_count"] for s in state_metrics)
        self.assertEqual(total_phcs, 90)

        total_patients = sum(s["enrolled_patients"] for s in state_metrics)
        self.assertEqual(total_patients, 5300)

        for s in state_metrics:
            self.assertIn(s["wave_assigned"], {1, 2, 3, 4})
            self.assertTrue(20.0 <= s["mean_mmse_proxy"] <= 26.0)
            self.assertGreaterEqual(s["session_adherence_pct"], 85.0)
            self.assertAlmostEqual(s["touch_interaction_pct"] + s["voice_ivr_interaction_pct"], 100.0, places=1)
            self.assertGreaterEqual(s["reminiscence_attendance_pct"], 85.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_policy_executive_brief(self):
        """Validates the auto-generated monthly policy brief for MDoNER leadership."""
        res = client.get("/api/v1/analytics/policy-report")
        self.assertEqual(res.status_code, 200)
        report = res.json()

        self.assertEqual(report["report_id"], "MDONER-TELEMETRY-BRIEF-2026-09")
        self.assertEqual(report["total_pan_ner_patients"], 5300)
        self.assertEqual(report["total_active_ashas"], 1510)
        self.assertGreaterEqual(report["pan_ner_mean_ccei"], 80.0)
        self.assertGreaterEqual(report["pan_ner_mean_adherence_pct"], 90.0)
        self.assertGreaterEqual(len(report["key_insights"]), 3)
        self.assertGreaterEqual(len(report["resource_recommendations"]), 3)

        scorecard = report["policy_kpi_scorecard"]
        self.assertEqual(len(scorecard), 5)
        for k in scorecard:
            self.assertIn(k["status"], {"ON_TRACK", "MONITOR", "ACTION_REQUIRED"})
            self.assertTrue(len(k["kpi_name"]) > 0)
            self.assertTrue(len(k["current"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_central_analytics_summary(self):
        """Validates consolidated summary metrics for Sub-Phase 18.1."""
        res = client.get("/api/v1/analytics/summary")
        self.assertEqual(res.status_code, 200)
        summary = res.json()

        self.assertEqual(summary["total_districts_mapped"], 16)
        self.assertEqual(summary["total_states_analyzed"], 8)
        self.assertEqual(summary["total_enrolled_patients"], 5300)
        self.assertGreaterEqual(summary["pan_ner_mean_ccei"], 80.0)
        self.assertGreaterEqual(summary["mean_adherence_pct"], 90.0)
        self.assertTrue(summary["policy_brief_active"])
        self.assertEqual(summary["status"], "CENTRAL_DASHBOARD_OPERATIONAL")


if __name__ == "__main__":
    unittest.main()
