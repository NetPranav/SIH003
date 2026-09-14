"""
Unit tests for Smriti-NER Bluetooth & Wi-Fi Direct Mesh Relay
Sub-Phase 11.3: Mutual Handshake Authentication, Chunked Transfer, and Multi-Hop Spool Upload
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, ASHA_RELAY_LEDGER
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestMeshRelay(unittest.TestCase):
    def setUp(self):
        """Resets in-memory ASHA relay ledger between tests."""
        if HAS_FASTAPI:
            ASHA_RELAY_LEDGER.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_mesh_handshake_success(self):
        """Tests valid ASHA mutual authentication handshake."""
        payload = {
            "asha_id": "asha_tawang_01",
            "asha_name": "Lhamo Tsering",
            "device_id": "ble_tab_098",
            "phc_center": "Tawang District Hospital PHC",
            "nonce_a": "1234567890abcdef",
            "auth_token": "valid_signed_asha_cert_token_2026"
        }
        res = client.post("/api/v1/mesh/handshake", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["authenticated"])
        self.assertEqual(data["authorized_asha_id"], "asha_tawang_01")
        self.assertEqual(data["status"], "MUTUAL_AUTH_VERIFIED")
        self.assertTrue(data["session_ticket"].startswith("stk_asha_tawang_01_"))
        # Check 256-bit session key is 64 hex chars
        self.assertEqual(len(data["session_key_hex"]), 64)
        self.assertGreater(data["session_expires_epoch"], 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_mesh_handshake_unauthorized(self):
        """Tests invalid ASHA credentials rejected with 401."""
        payload = {
            "asha_id": "bogus_user_99",
            "asha_name": "Unknown",
            "device_id": "ble_tab_unknown",
            "phc_center": "Unknown",
            "nonce_a": "1234",
            "auth_token": "short"
        }
        res = client.post("/api/v1/mesh/handshake", json=payload)
        self.assertEqual(res.status_code, 401)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_relay_spool_upload_and_status(self):
        """Tests ASHA tablet spool upload upon returning to PHC cellular gateway."""
        spool_payload = {
            "asha_id": "asha_tawang_01",
            "phc_center": "Tawang District Hospital PHC",
            "spool_items": [
                {
                    "spool_id": "spool_01",
                    "patient_id": "p_anand_01",
                    "asha_id": "asha_tawang_01",
                    "packet_id": "delta_pkg_01",
                    "payload_checksum_sha256": "abcdef1234567890",
                    "compressed_bytes": 3840,
                    "hop_count": 2,
                    "route": ["ELDER_TABLET", "ASHA_TABLET"],
                    "spooled_at": "2026-09-14T13:40:00Z"
                },
                {
                    "spool_id": "spool_02",
                    "patient_id": "p_karbi_elder_03",
                    "asha_id": "asha_tawang_01",
                    "packet_id": "delta_pkg_02",
                    "payload_checksum_sha256": "123456abcdef7890",
                    "compressed_bytes": 2910,
                    "hop_count": 2,
                    "route": ["ELDER_TABLET", "ASHA_TABLET"],
                    "spooled_at": "2026-09-14T13:42:00Z"
                }
            ]
        }
        res = client.post("/api/v1/mesh/relay-spool-upload", json=spool_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["items_received_count"], 2)
        self.assertEqual(data["items_relayed_successfully"], 2)
        self.assertEqual(data["status"], "SUCCESS")
        self.assertTrue(data["audit_receipt_id"].startswith("msh_rec_"))

        # Verify ASHA spool status endpoint reflects relayed records
        status_res = client.get("/api/v1/mesh/asha-spool-status/asha_tawang_01")
        self.assertEqual(status_res.status_code, 200)
        status_data = status_res.json()
        self.assertEqual(status_data["asha_id"], "asha_tawang_01")
        self.assertEqual(status_data["total_bundles_relayed"], 2)
        self.assertNotEqual(status_data["last_relayed_at"], "NONE")


if __name__ == "__main__":
    unittest.main()
