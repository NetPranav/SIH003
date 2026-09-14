"""
Unit tests for Smriti-NER Longitudinal Adherence Analytics & Trend Engine
Sub-Phase 10.3: Daily Adherence Logging, Multi-Window Compliance Calculator, and Dashboard Feeds
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, ADHERENCE_LOGS_STORE
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAdherenceAnalytics(unittest.TestCase):
    def setUp(self):
        """Resets baseline fixture for adherence analytics tests."""
        if not HAS_FASTAPI:
            return
        ADHERENCE_LOGS_STORE.clear()
        ADHERENCE_LOGS_STORE.extend([
            {
                "log_id": "adh_seed_01",
                "patient_id": "p_anand_01",
                "reminder_id": "rem_seed_medication",
                "type": "MEDICATION",
                "title": "পুৱাৰ ৰক্তচাপ আৰু স্মৃতিৰ ঔষধ",
                "dosage": "1 Tablet (Donepezil 5mg)",
                "scheduled_at": "2026-09-14T08:30:00Z",
                "confirmed_at": "2026-09-14T08:34:00Z",
                "delay_minutes": 4,
                "status": "ON_TIME",
                "channel": "PWA_CLIENT",
                "snooze_count": 0,
            },
            {
                "log_id": "adh_seed_02",
                "patient_id": "p_anand_01",
                "reminder_id": "rem_seed_hydration",
                "type": "HYDRATION",
                "title": "দুপৰীয়াৰ এগিলাচ বিশুদ্ধ পানী",
                "dosage": "1 Brass Lota Water (250ml)",
                "scheduled_at": "2026-09-14T12:30:00Z",
                "confirmed_at": "2026-09-14T12:42:00Z",
                "delay_minutes": 12,
                "status": "ON_TIME",
                "channel": "IVR_PHONE",
                "snooze_count": 0,
            },
        ])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_log_adherence_event(self):
        """Test logging an adherence confirmation event."""
        payload = {
            "patient_id": "p_anand_01",
            "reminder_id": "rem_test_03",
            "type": "COGNITIVE_SESSION",
            "title": "আবেলিৰ স্মৃতি খেল (Dhol-Pepa Co-Play)",
            "dosage": "10 Minutes Session",
            "scheduled_at": "2026-09-14T16:00:00Z",
            "confirmed_at": "2026-09-14T16:08:00Z",
            "delay_minutes": 8,
            "status": "ON_TIME",
            "channel": "PWA_CLIENT",
            "snooze_count": 0,
        }
        res = client.post("/api/v1/adherence/log", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["log_id"].startswith("adh_"))
        self.assertEqual(data["status"], "ON_TIME")
        self.assertEqual(data["channel"], "PWA_CLIENT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_get_patient_adherence_history(self):
        """Test retrieving chronological adherence records."""
        res = client.get("/api/v1/adherence/patient/p_anand_01/history")
        self.assertEqual(res.status_code, 200)
        logs = res.json()
        self.assertGreaterEqual(len(logs), 2)
        types = [l["type"] for l in logs]
        self.assertIn("MEDICATION", types)
        self.assertIn("HYDRATION", types)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_compliance_summary_calculation(self):
        """Test calculation of compliance rate, tier, and category breakdowns."""
        res = client.get("/api/v1/adherence/patient/p_anand_01/compliance")
        self.assertEqual(res.status_code, 200)
        summary = res.json()
        self.assertEqual(summary["patient_id"], "p_anand_01")
        self.assertGreaterEqual(summary["daily_rate"], 85.0)
        self.assertEqual(summary["tier"], "OPTIMAL")
        self.assertIn("medication", summary["by_category"])
        self.assertIn("hydration", summary["by_category"])
        self.assertIn("pwa", summary["by_channel"])
        self.assertIn("ivr", summary["by_channel"])
        self.assertEqual(summary["streak_days"], 14)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_trend_feed_endpoint(self):
        """Test timeline points and ring chart percentage feeds for dashboards."""
        res = client.get("/api/v1/adherence/patient/p_anand_01/trend-feed")
        self.assertEqual(res.status_code, 200)
        feed = res.json()
        self.assertIn("timeline", feed)
        self.assertIn("rings", feed)
        self.assertGreaterEqual(len(feed["timeline"]), 3)
        self.assertGreaterEqual(feed["rings"]["medication"], 80.0)
        self.assertGreaterEqual(feed["rings"]["hydration"], 80.0)


if __name__ == "__main__":
    unittest.main()
