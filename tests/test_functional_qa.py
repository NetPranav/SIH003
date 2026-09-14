"""
Unit tests for Smriti-NER Functional Testing Suite
Sub-Phase 13.1: E2E Pipeline, 30-Day Offline Soak Test, Cross-Device Matrix, and ≥90% Coverage Target
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestFunctionalQa(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_e2e_clinical_pipeline_execution(self):
        """Tests end-to-end flow: Game -> Telemetry -> BKT -> MMSE Proxy -> Dashboard."""
        payload = {
            "patient_id": "p_anand_01",
            "game_id": "bihu_rhythm",
            "score": 94,
            "reaction_ms": 410
        }
        res = client.post("/api/v1/qa/e2e-clinical-pipeline", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertTrue(data["telemetry_valid"])
        self.assertGreaterEqual(data["bkt_posterior_p_know"], 0.70)
        self.assertIn(data["bkt_mastery_state"], ["ACQUIRED", "MASTERED"])
        self.assertGreater(data["mmse_proxy_projection"], 20.0)
        self.assertFalse(data["dashboard_alert_triggered"])
        self.assertLess(data["pipeline_latency_ms"], 100.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_offline_soak_run_30_days(self):
        """Tests 30-day continuous offline simulation without data drop."""
        res = client.post("/api/v1/qa/offline-soak-run")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["simulated_days"], 30)
        self.assertEqual(data["total_game_sessions"], 60)
        self.assertEqual(data["total_adherence_events"], 90)
        self.assertFalse(data["data_loss_detected"])
        self.assertTrue(data["reconnection_sync_success"])
        self.assertLess(data["storage_usage_percent"], 5.0)  # less than 5% of 50MB quota used
        self.assertEqual(data["status"], "RESILIENT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_cross_device_compatibility_matrix(self):
        """Tests that all 4 hardware tiers meet responsiveness and font rendering standards."""
        res = client.get("/api/v1/qa/device-matrix")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 4)
        for dev in data:
            self.assertEqual(dev["status"], "PASSED")
            self.assertTrue(dev["eastern_nagari_font_rendering"])
            self.assertGreaterEqual(dev["min_touch_target_dp"], 48)
            self.assertGreaterEqual(dev["performance_score_pct"], 90.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_functional_qa_summary(self):
        """Validates that unit test coverage exceeds 90% and cross-device pass rate is 100%."""
        res = client.get("/api/v1/qa/functional-summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["unit_test_coverage_pct"], data["unit_test_coverage_target_pct"])
        self.assertTrue(data["e2e_pipeline_passed"])
        self.assertEqual(data["cross_device_pass_rate_pct"], 100.0)
        self.assertTrue(data["offline_soak_passed"])


if __name__ == "__main__":
    unittest.main()
