"""
Unit tests for Smriti-NER FastAPI Server
Compatible with both pytest (CI/CD) and unittest (zero-dependency local test runner)
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestFastAPIServer(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_health_check(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "smriti-ner-server")
        self.assertTrue(data["disha_compliant"])
        self.assertEqual(response.headers.get("X-DISHA-Compliant"), "true")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_telemetry_sync_valid(self):
        payload = {
            "pseudo_patient_id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "recorded_at": "2026-09-14T01:00:00Z",
            "events": [
                {
                    "game_id": "dhol_pepa",
                    "timestamp": "2026-09-14T01:00:15Z",
                    "reaction_time_ms": 420.5,
                    "accuracy_score": 0.95,
                    "tremor_jitters_suppressed": 4,
                    "aacb_difficulty_level": 2,
                }
            ],
            "medication_taken": True,
            "sundowning_agitation_flag": False,
            "source_channel": "PWA_CLIENT",
        }
        response = client.post("/api/v1/telemetry/sync", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["sync_status"], "PROCESSED_AND_STORED")
        self.assertEqual(data["records_ingested"], 1)
        self.assertGreaterEqual(data["mmse_proxy_score"], 20.0)
        self.assertEqual(data["adherence_rate"], 92.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_telemetry_sync_invalid_pseudo_id(self):
        payload = {
            "pseudo_patient_id": "short_id",  # Invalid short ID
            "recorded_at": "2026-09-14T01:00:00Z",
            "events": [],
            "medication_taken": False,
            "sundowning_agitation_flag": False,
            "source_channel": "PWA_CLIENT",
        }
        response = client.post("/api/v1/telemetry/sync", json=payload)
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
