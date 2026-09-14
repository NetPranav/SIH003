"""
Unit tests for Smriti-NER 90-Day Longitudinal Clinical Observation
Sub-Phase 14.3: Daily engagement (>= 70%), MMSE trajectory tracking (r >= 0.75),
Multi-channel adherence (>= 85%), Social feature loops, and ICMR adverse event logging (0 critical).
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestLongitudinalObservation(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_daily_engagement_and_trend(self):
        """Validates daily engagement rate exceeds 70% and 12-week trend consistency."""
        res = client.get("/api/v1/observation/daily-engagement")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_enrolled"], 500)
        self.assertGreaterEqual(data["daily_engagement_pct"], data["target_daily_engagement_min_pct"])
        self.assertTrue(15.0 <= data["avg_session_duration_minutes"] <= 25.0)
        self.assertEqual(len(data["weekly_trend"]), 12)
        for w in data["weekly_trend"]:
            self.assertGreaterEqual(w["engagement_pct"], 70.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_mmse_trajectories_and_correlation(self):
        """Validates in-app MMSE proxy correlation with clinician standard (r >= 0.75)."""
        res = client.get("/api/v1/observation/mmse-trajectories")
        self.assertEqual(res.status_code, 200)
        points = res.json()
        self.assertEqual(len(points), 4)
        for pt in points:
            self.assertGreaterEqual(pt["pearson_correlation_r"], 0.75)
            self.assertLess(pt["p_value"], 0.01)
            self.assertEqual(pt["stability_indicator"], "PRESERVED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_adherence_rates_cross_channel(self):
        """Validates adherence rates across both App (>= 85%) and IVR-only (>= 80%) channels."""
        res = client.get("/api/v1/observation/adherence-rates")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["overall_adherence_pct"], data["target_adherence_min_pct"])
        self.assertGreaterEqual(data["app_cohort_adherence_pct"], 85.0)
        self.assertGreaterEqual(data["ivr_only_cohort_adherence_pct"], 80.0)
        self.assertTrue(data["adherence_target_passed"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_social_engagement_metrics(self):
        """Validates intergenerational Grandchild Connect loops and Reminiscence Circle attendance."""
        res = client.get("/api/v1/observation/social-engagement")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["grandchild_clues_recorded"], 3000)
        self.assertGreater(data["reaction_badges_dispatched"], 3000)
        self.assertGreater(data["reminiscence_circle_sessions_conducted"], 400)
        self.assertGreater(data["reminiscence_circle_attendance_pct"], 85.0)
        self.assertGreater(data["digital_legacy_stories_recorded"], 1000)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_adverse_events_safety_log(self):
        """Validates zero critical adverse events and prompt de-escalation of transient agitation."""
        res = client.get("/api/v1/observation/adverse-events")
        self.assertEqual(res.status_code, 200)
        events = res.json()
        for e in events:
            self.assertNotEqual(e["severity"], "CRITICAL")
            self.assertEqual(e["status"], "RESOLVED")
            self.assertLessEqual(e["resolved_within_minutes"], 15)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_longitudinal_observation_summary(self):
        """Validates consolidated 90-day observation sign-off targets."""
        res = client.get("/api/v1/observation/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["observation_days_completed"], 90)
        self.assertEqual(data["patients_observed"], 500)
        self.assertTrue(data["engagement_target_achieved"])
        self.assertTrue(data["mmse_correlation_target_achieved"])
        self.assertTrue(data["adherence_target_achieved"])
        self.assertEqual(data["critical_adverse_events"], 0)
        self.assertTrue(data["safety_target_passed"])
        self.assertEqual(data["status"], "OBSERVATION_COMPLETE_CLINICALLY_VALIDATED")


if __name__ == "__main__":
    unittest.main()
