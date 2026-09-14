"""
Unit tests for Smriti-NER Cross-Channel Reminder Unification & Milestone M10 Engine
Sub-Phase 10.4: Dynamic Channel Routing, Unified Adherence Ledger, and Milestone M10 Certification
"""

import unittest
from datetime import datetime, timezone, timedelta

try:
    from fastapi.testclient import TestClient
    from server.main import app, UNIFIED_ADHERENCE_LEDGER
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCrossChannelReminders(unittest.TestCase):
    def setUp(self):
        """Resets baseline fixture for unified ledger tests."""
        if not HAS_FASTAPI:
            return
        UNIFIED_ADHERENCE_LEDGER.clear()
        UNIFIED_ADHERENCE_LEDGER.update({
            "p_anand_01_rem_seed_medication_2026-09-14_08:30": {
                "entry_id": "uni_seed_01",
                "patient_id": "p_anand_01",
                "slot_key": "p_anand_01_rem_seed_medication_2026-09-14_08:30",
                "reminder_id": "rem_seed_medication",
                "type": "MEDICATION",
                "title": "পুৱাৰ ৰক্তচাপ আৰু স্মৃতিৰ ঔষধ",
                "scheduled_time": "08:30",
                "confirmed_time": "2026-09-14T08:33:15Z",
                "channel": "PWA_CLIENT",
                "latency_minutes": 3,
                "status": "COMPLETED",
            },
            "p_anand_01_rem_seed_hydration_2026-09-14_12:30": {
                "entry_id": "uni_seed_02",
                "patient_id": "p_anand_01",
                "slot_key": "p_anand_01_rem_seed_hydration_2026-09-14_12:30",
                "reminder_id": "rem_seed_hydration",
                "type": "HYDRATION",
                "title": "দুপৰীয়াৰ এগিলাচ বিশুদ্ধ পানী",
                "scheduled_time": "12:30",
                "confirmed_time": "2026-09-14T12:38:00Z",
                "channel": "IVR_PHONE",
                "latency_minutes": 8,
                "status": "COMPLETED",
            },
        })

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_routing_feature_phone(self):
        """Test basic feature phone profile routes strictly to IVR."""
        payload = {
            "patient_id": "p_rural_01",
            "preference": "IVR_FEATURE_PHONE",
            "phone_number": "+91-94350-11111",
            "prefers_voice_over_text": True,
        }
        res = client.post("/api/v1/reminders/routing-decision", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["selected_channel"], "IVR_PHONE")
        self.assertIn("BSNL Toll-Free IVR", data["reason"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_routing_hybrid_smart_recent(self):
        """Test hybrid profile with recent PWA activity routes to PWA client."""
        recent_time = (datetime.now(timezone.utc) - timedelta(minutes=3)).isoformat()
        payload = {
            "patient_id": "p_anand_01",
            "preference": "HYBRID_SMART_FAILOVER",
            "phone_number": "+91-94350-22222",
            "pwa_last_active": recent_time,
            "prefers_voice_over_text": False,
        }
        res = client.post("/api/v1/reminders/routing-decision", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["selected_channel"], "PWA_CLIENT")
        self.assertEqual(data["failover_after_minutes"], 15)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_routing_hybrid_smart_inactive(self):
        """Test hybrid profile with inactive PWA (>15m) falls back to IVR voice call."""
        inactive_time = (datetime.now(timezone.utc) - timedelta(minutes=45)).isoformat()
        payload = {
            "patient_id": "p_anand_01",
            "preference": "HYBRID_SMART_FAILOVER",
            "phone_number": "+91-94350-22222",
            "pwa_last_active": inactive_time,
            "prefers_voice_over_text": False,
        }
        res = client.post("/api/v1/reminders/routing-decision", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["selected_channel"], "IVR_PHONE")
        self.assertIn("inactive for >15 mins", data["reason"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_unified_confirmation_and_deduplication(self):
        """Test recording an adherence confirmation and preventing double-counting."""
        slot_key = "p_anand_01_rem_seed_evening_2026-09-14_16:00"

        # 1. First confirmation via PWA tap
        req1 = {
            "patient_id": "p_anand_01",
            "slot_key": slot_key,
            "reminder_id": "rem_seed_evening",
            "type": "COGNITIVE_SESSION",
            "title": "আবেলিৰ স্মৃতি খেল (Dhol-Pepa Co-Play)",
            "scheduled_time": "16:00",
            "channel": "PWA_CLIENT",
            "latency_minutes": 5,
        }
        res1 = client.post("/api/v1/reminders/unified-confirm", json=req1)
        self.assertEqual(res1.status_code, 200)
        d1 = res1.json()
        self.assertFalse(d1["is_duplicate"])
        self.assertEqual(d1["status"], "COMPLETED")
        self.assertEqual(d1["channel"], "PWA_CLIENT")

        # 2. Subsequent confirmation attempt via IVR keypress for the same slot
        req2 = {
            "patient_id": "p_anand_01",
            "slot_key": slot_key,
            "reminder_id": "rem_seed_evening",
            "type": "COGNITIVE_SESSION",
            "title": "আবেলিৰ স্মৃতি খেল (Dhol-Pepa Co-Play)",
            "scheduled_time": "16:00",
            "channel": "IVR_PHONE",
            "latency_minutes": 18,
        }
        res2 = client.post("/api/v1/reminders/unified-confirm", json=req2)
        self.assertEqual(res2.status_code, 200)
        d2 = res2.json()
        self.assertTrue(d2["is_duplicate"])
        self.assertEqual(d2["channel"], "PWA_CLIENT")  # Preserves original channel
        self.assertIn("already confirmed", d2["message"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_get_patient_unified_ledger(self):
        """Test retrieving all unified adherence slots for patient."""
        res = client.get("/api/v1/reminders/patient/p_anand_01/unified-ledger")
        self.assertEqual(res.status_code, 200)
        slots = res.json()
        self.assertGreaterEqual(len(slots), 2)
        channels = [s["channel"] for s in slots]
        self.assertIn("PWA_CLIENT", channels)
        self.assertIn("IVR_PHONE", channels)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m10_verification_endpoint(self):
        """Test formal verification of Milestone M10."""
        res = client.get("/api/v1/reminders/milestone-m10/verify")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["milestone"], "M10")
        self.assertEqual(data["status"], "PASSED")
        comp = data["components_checked"]
        self.assertTrue(comp["firing_within_tolerance_window"])
        self.assertTrue(comp["voice_autoplay_operational"])
        self.assertTrue(comp["pwa_confirmation_active"])
        self.assertTrue(comp["ivr_confirmation_active"])
        self.assertTrue(comp["cross_channel_deduplication_passed"])
        self.assertTrue(comp["offline_persistence_verified"])


if __name__ == "__main__":
    unittest.main()
