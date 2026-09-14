"""
Unit tests for Smriti-NER Delta Synchronization Engine
Sub-Phase 11.2: Micro-Payload Serialization (<50KB/week), Network Heartbeat, and Conflict Resolution
"""

import unittest
import time

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestDeltaSync(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_sync_heartbeat_ping(self):
        """Tests low-overhead heartbeat probe for network presence and clock alignment."""
        res = client.get("/api/v1/sync/ping")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "OK")
        self.assertIn("server_time", data)
        self.assertGreater(data["server_epoch"], 0)
        self.assertEqual(data["recommended_sync_interval_sec"], 900)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ingest_delta_sync_packet_clean(self):
        """Tests delta packet ingestion under <50KB envelope with 0 conflicts."""
        now_epoch = int(time.time() * 1000)
        payload = {
            "packet_id": "delta_pkg_test_01",
            "patient_id": "p_anand_01",
            "client_device_id": "tab_guwahati_01",
            "since_epoch": now_epoch - 86400000,
            "generated_at": "2026-09-14T13:35:00Z",
            "payload_checksum_sha256": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            "uncompressed_bytes": 12400,
            "compressed_bytes": 3968,  # Well under 50,000 bytes (<50KB/week target)
            "mutations_count": 3,
            "entities": {
                "reminders": [
                    {
                        "entity_id": "rem_med_01",
                        "entity_type": "reminders",
                        "action": "UPSERT",
                        "priority": "TIER_1_CRITICAL",
                        "timestamp": now_epoch - 3600000,
                        "data": {
                            "status": "COMPLETED",
                            "confirmed_time": "2026-09-14T08:33:00Z"
                        }
                    }
                ],
                "game_sessions": [
                    {
                        "entity_id": "gs_bihu_01",
                        "entity_type": "game_sessions",
                        "action": "INSERT",
                        "priority": "TIER_2_CLINICAL",
                        "timestamp": now_epoch - 1800000,
                        "data": {
                            "game_id": "bihu_rhythm",
                            "score": 96,
                            "reaction_ms": 380
                        }
                    }
                ]
            }
        }
        res = client.post("/api/v1/sync/delta-packet", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertEqual(data["synced_mutations_count"], 3)
        self.assertEqual(len(data["conflicts"]), 0)
        self.assertIn("0 conflicts", data["message"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ingest_delta_sync_packet_with_conflict(self):
        """Tests concurrent modification detection during offline reconciliation."""
        now_epoch = int(time.time() * 1000)
        payload = {
            "packet_id": "delta_pkg_conflict_01",
            "patient_id": "p_anand_01",
            "client_device_id": "tab_guwahati_01",
            "since_epoch": now_epoch - 86400000,
            "generated_at": "2026-09-14T13:35:00Z",
            "payload_checksum_sha256": "c0ffee1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            "uncompressed_bytes": 4500,
            "compressed_bytes": 1440,
            "mutations_count": 1,
            "entities": {
                "reminders": [
                    {
                        "entity_id": "rem_med_disputed",
                        "entity_type": "reminders",
                        "action": "UPSERT",
                        "priority": "TIER_1_CRITICAL",
                        "timestamp": now_epoch - 3600000,
                        "data": {
                            "status": "COMPLETED",
                            "server_conflict_simulated": True
                        }
                    }
                ]
            }
        }
        res = client.post("/api/v1/sync/delta-packet", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "CONFLICTS_DETECTED")
        self.assertEqual(len(data["conflicts"]), 1)
        self.assertEqual(data["conflicts"][0]["entity_id"], "rem_med_disputed")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_conflict_resolution_medication_merge(self):
        """Tests smart merge for retroactive offline adherence when server escalated to ASHA."""
        payload = {
            "patient_id": "p_anand_01",
            "entity_type": "reminders",
            "entity_id": "rem_blood_pressure",
            "client_value": {
                "status": "COMPLETED",
                "confirmed_at": "2026-09-14T08:33:00Z",
                "channel": "PWA_CLIENT"
            },
            "server_value": {
                "status": "ESCALATED_TO_ASHA",
                "asha_id": "asha_anita_01",
                "escalated_at": "2026-09-14T08:45:00Z"
            }
        }
        res = client.post("/api/v1/sync/resolve-conflict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["resolution_applied"], "SERVER_WINS_MERGE")
        self.assertTrue(data["audit_trail_preserved"])
        resolved = data["resolved_value"]
        self.assertEqual(resolved["status"], "COMPLETED")
        self.assertEqual(resolved["asha_alert_status"], "RESOLVED_RETROACTIVELY")
        self.assertTrue(resolved["retroactive_offline_sync"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_conflict_resolution_default_server_wins(self):
        """Tests default server-wins policy with audit trail preservation."""
        payload = {
            "patient_id": "p_anand_01",
            "entity_type": "game_sessions",
            "entity_id": "gs_99",
            "client_value": {"difficulty": "LEVEL_2"},
            "server_value": {"difficulty": "LEVEL_1", "override_by": "Dr. Phukan"}
        }
        res = client.post("/api/v1/sync/resolve-conflict", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["resolution_applied"], "SERVER_WINS")
        self.assertEqual(data["resolved_value"]["difficulty"], "LEVEL_1")
        self.assertTrue(data["audit_trail_preserved"])


if __name__ == "__main__":
    unittest.main()
