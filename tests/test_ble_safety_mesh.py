"""
Unit tests for Smriti-NER BLE Beacon Wandering/Safety Mesh & Milestone M11
Sub-Phase 11.4: RSSI Proximity Zones, Zone-Exit Alerts (<60s Latency), and Milestone M11 Sign-Off
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestBleSafetyMesh(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_beacon_scan_proximity_zones(self):
        """Tests RSSI smoothing and distance mapping across zone tiers."""
        # Test Home Interior (strong signal)
        payload_interior = {
            "patient_id": "p_anand_01",
            "beacon_id": "bcn_home_bed_01",
            "raw_rssi": -58,
            "tx_power_1m": -59
        }
        res_interior = client.post("/api/v1/beacon/scan-reading", json=payload_interior)
        self.assertEqual(res_interior.status_code, 200)
        data_int = res_interior.json()
        self.assertEqual(data_int["zone"], "HOME_INTERIOR")
        self.assertLessEqual(data_int["estimated_distance_m"], 2.0)

        # Test Home Perimeter (medium signal)
        payload_peri = {
            "patient_id": "p_anand_01",
            "beacon_id": "bcn_home_gate_02",
            "raw_rssi": -72,
            "tx_power_1m": -59
        }
        res_peri = client.post("/api/v1/beacon/scan-reading", json=payload_peri)
        self.assertEqual(res_peri.status_code, 200)
        data_peri = res_peri.json()
        self.assertEqual(data_peri["zone"], "HOME_PERIMETER")

        # Test Community Sanctuary (temple / tea stall)
        payload_sanctuary = {
            "patient_id": "p_anand_01",
            "beacon_id": "bcn_naamghar_03",
            "raw_rssi": -84,
            "tx_power_1m": -59
        }
        res_sanctuary = client.post("/api/v1/beacon/scan-reading", json=payload_sanctuary)
        self.assertEqual(res_sanctuary.status_code, 200)
        data_sanc = res_sanctuary.json()
        self.assertEqual(data_sanc["zone"], "COMMUNITY_SANCTUARY")

        # Test Unknown / Lost Signal
        payload_lost = {
            "patient_id": "p_anand_01",
            "beacon_id": "bcn_lost",
            "raw_rssi": -95,
            "tx_power_1m": -59
        }
        res_lost = client.post("/api/v1/beacon/scan-reading", json=payload_lost)
        self.assertEqual(res_lost.status_code, 200)
        data_lost = res_lost.json()
        self.assertEqual(data_lost["zone"], "UNKNOWN_PERILOUS_ZONE")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_zone_exit_check_under_threshold(self):
        """Tests that absence for <60s does not trigger emergency wandering alert."""
        payload = {
            "patient_id": "p_anand_01",
            "seconds_out_of_safe_zone": 35,
            "last_known_beacon_id": "bcn_home_gate_02"
        }
        res = client.post("/api/v1/beacon/zone-exit-check", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["breached"])
        self.assertEqual(data["status"], "MONITORING")
        self.assertFalse(data["emergency_alert_dispatched"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_zone_exit_check_breach_over_60s(self):
        """Tests that absence for >=60s dispatches emergency Assamese prompt and Caregiver SMS."""
        payload = {
            "patient_id": "p_anand_01",
            "seconds_out_of_safe_zone": 75,
            "last_known_beacon_id": "bcn_home_gate_02"
        }
        res = client.post("/api/v1/beacon/zone-exit-check", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["breached"])
        self.assertEqual(data["current_zone"], "UNKNOWN_PERILOUS_ZONE")
        self.assertEqual(data["status"], "ACTIVE_EMERGENCY")
        self.assertTrue(data["emergency_alert_dispatched"])
        self.assertIn("আইতা / ককা", data["voice_prompt_assamese"])
        self.assertIn("[Smriti-NER SOS]", data["caregiver_sms_payload"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m11_audit_signoff(self):
        """Validates that Milestone M11 meets all 4 rigorous sign-off criteria."""
        res = client.get("/api/v1/beacon/milestone-m11-audit")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["milestone_id"], "M11")
        self.assertTrue(data["offline_persistence_active"])
        # Criterion 2: <50KB/week delta sync
        self.assertLess(data["delta_sync_weekly_kb"], data["delta_sync_target_kb"])
        # Criterion 3: Bluetooth mesh relay tested
        self.assertTrue(data["bluetooth_mesh_relay_verified"])
        # Criterion 4: Zone-exit alert <= 60 seconds
        self.assertLessEqual(data["zone_exit_latency_sec"], data["zone_exit_target_max_sec"])
        # Official sign-off
        self.assertTrue(data["signed_off"])


if __name__ == "__main__":
    unittest.main()
