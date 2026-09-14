"""
Unit tests for Smriti-NER Local-First Encrypted Persistence Layer
Sub-Phase 11.1: DISHA 2018 AES-256-GCM Encryption, Schema Migrations, and 180-Day Quota Audit
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestLocalPersistence(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_encrypt_payload_roundtrip(self):
        """Validates simulated DISHA 2018 AES-256-GCM authenticated payload generation."""
        payload = {
            "patient_id": "p_anand_01",
            "plaintext": "Sensitive cognitive telemetry: MMSE 23.4, reaction_time 412ms"
        }
        res = client.post("/api/v1/storage/encrypt-payload", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Check IV is 12 bytes = 24 hex chars
        self.assertEqual(len(data["iv_hex"]), 24)
        # Check tag is 16 bytes = 32 hex chars
        self.assertEqual(len(data["tag_hex"]), 32)
        # Check ciphertext exists and can be decoded back to plaintext
        ct_bytes = bytes.fromhex(data["ciphertext_hex"])
        self.assertEqual(ct_bytes.decode("utf-8"), payload["plaintext"])
        self.assertEqual(data["version"], 1)
        self.assertIn("encrypted_at", data)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_schema_migrations_v3(self):
        """Verifies local SQLite/IndexedDB versioned migrations from v1 through v3."""
        res = client.get("/api/v1/storage/schema-migrations")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["current_version"], 3)
        migrations = data["migrations_applied"]
        self.assertEqual(len(migrations), 3)

        # Check v1
        self.assertEqual(migrations[0]["version"], 1)
        self.assertEqual(migrations[0]["name"], "v1_core_foundation")
        self.assertIn("patients", migrations[0]["tables_added"])

        # Check v2
        self.assertEqual(migrations[1]["version"], 2)
        self.assertEqual(migrations[1]["name"], "v2_cognitive_ai_aacb")
        self.assertIn("aacb_events", migrations[1]["tables_added"])

        # Check v3
        self.assertEqual(migrations[2]["version"], 3)
        self.assertEqual(migrations[2]["name"], "v3_unified_reminders_peer_wellness")
        self.assertIn("reminders", migrations[2]["tables_added"])
        self.assertIn("adherence_ledger", migrations[2]["tables_added"])
        self.assertIn("peer_wellness_records", migrations[2]["tables_added"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_quota_audit_and_180_day_prune(self):
        """Tests device quota audit under healthy threshold and 180-day telemetry compaction."""
        payload = {
            "patient_id": "p_anand_01",
            "total_quota_mb": 50.0,
            "simulated_records_count": 300,
            "records_older_than_180_days": 80
        }
        res = client.post("/api/v1/storage/quota-audit", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["patient_id"], "p_anand_01")
        self.assertEqual(data["quota_bytes"], 50 * 1024 * 1024)
        self.assertEqual(data["pruned_records_count"], 80)
        self.assertEqual(data["status"], "HEALTHY")
        self.assertLess(data["usage_percent"], 60.0)

        # Verify archived monthly summary preserves longitudinal clinical metrics
        summary = data["archived_summary"]
        self.assertEqual(summary["patient_id"], "p_anand_01")
        self.assertEqual(summary["archived_records_count"], 80)
        self.assertIn("avg_reaction_time_ms", summary)
        self.assertIn("avg_accuracy_score", summary)
        self.assertIn("mmse_proxy_preserved", summary)


if __name__ == "__main__":
    unittest.main()
