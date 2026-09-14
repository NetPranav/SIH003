"""
Unit tests for Smriti-NER Backend API Development
Sub-Phase 12.2: FastAPI Gateway, TimescaleDB Hypertables, Redis Caching, Celery Tasks, and RBAC
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, REDIS_CACHE_STORE, REDIS_STATS
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestBackendApi(unittest.TestCase):
    def setUp(self):
        """Clears test cache state."""
        if HAS_FASTAPI:
            REDIS_CACHE_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_auth_token_issue_and_rbac(self):
        """Tests JWT token generation and role verification."""
        # Valid clinician token
        payload = {
            "user_id": "dr_phukan_01",
            "role": "CLINICIAN",
            "name": "Dr. Hemanta Phukan",
            "secret_key": "smriti_auth_dev_secret"
        }
        res = client.post("/api/v1/auth/token", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "CLINICIAN")
        self.assertTrue(data["access_token"].startswith("smriti_jwt_clinician_"))

        # Invalid role raises 400
        bad_payload = {
            "user_id": "hacker",
            "role": "SUPERUSER_INVALID",
            "name": "Bad Actor",
            "secret_key": "smriti_auth_dev_secret"
        }
        res_bad = client.post("/api/v1/auth/token", json=bad_payload)
        self.assertEqual(res_bad.status_code, 400)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_trajectory_redis_caching_and_rbac(self):
        """Tests patient trajectory retrieval with Redis cache hit on repeated query and RBAC guard."""
        # Query 1: Cache Miss, populated in Redis
        res1 = client.get("/api/v1/patient/p_anand_01/trajectory?role=CLINICIAN")
        self.assertEqual(res1.status_code, 200)
        data1 = res1.json()
        self.assertEqual(data1["patient_id"], "p_anand_01")
        self.assertEqual(data1["cached"], False)
        self.assertIn("timeseries_points", data1)

        # Query 2: Cache Hit from Redis
        res2 = client.get("/api/v1/patient/p_anand_01/trajectory?role=CLINICIAN")
        self.assertEqual(res2.status_code, 200)
        data2 = res2.json()
        self.assertEqual(data2["cached"], True)

        # Unauthorized role raises 403
        res_unauth = client.get("/api/v1/patient/p_anand_01/trajectory?role=UNVERIFIED_GUEST")
        self.assertEqual(res_unauth.status_code, 403)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_voice_upload_and_bhashini_tts(self):
        """Tests kinship voice prompt upload and Bhashini multilingual streaming."""
        # Voice Upload
        upload_payload = {
            "patient_id": "p_anand_01",
            "kinship_relation": "GRANDDAUGHTER",
            "speaker_name": "Priyanka Baruah",
            "audio_base64": "UklGRi4AAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
            "duration_sec": 4.2
        }
        res_up = client.post("/api/v1/reminders/voice-upload", json=upload_payload)
        self.assertEqual(res_up.status_code, 200)
        up_data = res_up.json()
        self.assertEqual(up_data["status"], "AUDIO_STORED")
        self.assertIn("granddaughter.wav", up_data["url"])

        # Bhashini TTS
        tts_payload = {
            "text": "নমস্কাৰ আনন্দ বৰুৱা ডাঙৰীয়া, আপোনাৰ পুৱাৰ ঔষধ খোৱাৰ সময় হ'ল।",
            "language": "as",
            "voice_gender": "female"
        }
        res_tts = client.post("/api/v1/bhashini/tts-stream", json=tts_payload)
        self.assertEqual(res_tts.status_code, 200)
        tts_data = res_tts.json()
        self.assertEqual(tts_data["language"], "as")
        self.assertTrue(tts_data["mock_audio_url"].endswith(".wav"))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_mesh_harvest_and_cache_invalidation(self):
        """Tests mesh harvesting and automated eviction of patient trajectory cache."""
        # First ensure patient trajectory is cached
        client.get("/api/v1/patient/p_anand_01/trajectory?role=CLINICIAN")
        self.assertIn("traj:p_anand_01:mmse", REDIS_CACHE_STORE)

        # Execute harvest from ASHA tablet
        harvest_payload = {
            "asha_id": "asha_tawang_01",
            "district": "Tawang",
            "bundles_count": 4
        }
        res_harv = client.post("/api/v1/mesh/relay-harvest", json=harvest_payload)
        self.assertEqual(res_harv.status_code, 200)
        harv_data = res_harv.json()
        self.assertEqual(harv_data["bundles_processed"], 4)
        self.assertGreaterEqual(harv_data["cache_invalidations_count"], 1)

        # Verify key was evicted
        self.assertNotIn("traj:p_anand_01:mmse", REDIS_CACHE_STORE)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ivr_checkin_and_celery_dispatch(self):
        """Tests IVR check-in evaluation and Celery background task queuing."""
        # IVR Check-in
        ivr_payload = {
            "patient_id": "p_anand_01",
            "call_id": "call_bsnl_9812",
            "dtmf_digits": "12"
        }
        res_ivr = client.post("/api/v1/ivr/checkin", json=ivr_payload)
        self.assertEqual(res_ivr.status_code, 200)
        ivr_data = res_ivr.json()
        self.assertEqual(ivr_data["cognitive_orientation_score"], 3)
        self.assertEqual(ivr_data["status"], "CHECKIN_LOGGED")

        # Celery Dispatch
        celery_payload = {
            "task_name": "compute_mmse_proxy_batch",
            "patient_id": "p_anand_01",
            "args": {"window_days": 30}
        }
        res_celery = client.post("/api/v1/worker/celery-dispatch", json=celery_payload)
        self.assertEqual(res_celery.status_code, 200)
        celery_data = res_celery.json()
        self.assertEqual(celery_data["status"], "ENQUEUED")
        self.assertTrue(celery_data["task_id"].startswith("celery_compute_mmse_proxy_batch_"))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_infra_cache_status(self):
        """Tests TimescaleDB hypertables declaration and cache health metrics."""
        res = client.get("/api/v1/infra/cache-status")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("patient_cognitive_telemetry", data["timescaledb_hypertables"])
        self.assertIn("patient_adherence_events", data["timescaledb_hypertables"])
        self.assertGreater(data["hits"], 0)


if __name__ == "__main__":
    unittest.main()
