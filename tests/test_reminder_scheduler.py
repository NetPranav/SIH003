"""
Unit tests for Smriti-NER Multi-Sensory Reminder Scheduler & Escalation Daemon
Sub-Phase 10.1: Reminder Schema, ±30s Trigger Window Daemon, and 15-min 3-Step Snooze Escalation
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, REMINDERS_DATABASE
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestReminderScheduler(unittest.TestCase):
    def setUp(self):
        """Resets REMINDERS_DATABASE with fresh baseline fixtures before each test."""
        if not HAS_FASTAPI:
            return
        REMINDERS_DATABASE.clear()
        REMINDERS_DATABASE.extend([
            {
                "id": "rem_seed_medication",
                "patient_id": "p_anand_01",
                "type": "MEDICATION",
                "title": "পুৱাৰ ৰক্তচাপ আৰু স্মৃতিৰ ঔষধ (Morning BP & Donepezil)",
                "dosage": "1 Tablet (Donepezil 5mg) after breakfast",
                "meal_relation": "AFTER_MEAL",
                "scheduled_time": "08:30",
                "scheduled_days": [0, 1, 2, 3, 4, 5, 6],
                "recurrence": "DAILY",
                "voice_prompt_path": "/audio/reminders/priyanka_morning_pill.mp3",
                "voice_speaker_name": "Priyanka",
                "voice_speaker_relation": "নাতিনী (Granddaughter)",
                "cultural_icon": "traditional_mortar",
                "snooze_count": 0,
                "status": "ACTIVE",
                "next_trigger_time": "2026-09-14T08:30:00Z",
                "created_at": "2026-09-14T00:00:00Z",
                "updated_at": "2026-09-14T00:00:00Z",
            },
            {
                "id": "rem_seed_hydration",
                "patient_id": "p_anand_01",
                "type": "HYDRATION",
                "title": "দুপৰীয়াৰ এগিলাচ বিশুদ্ধ পানী (Midday Hydration)",
                "dosage": "1 Brass Lota Water (250ml)",
                "meal_relation": "INDEPENDENT",
                "scheduled_time": "12:30",
                "scheduled_days": [0, 1, 2, 3, 4, 5, 6],
                "recurrence": "DAILY",
                "voice_prompt_path": "/audio/reminders/priyanka_water_drink.mp3",
                "voice_speaker_name": "Priyanka",
                "voice_speaker_relation": "নাতিনী (Granddaughter)",
                "cultural_icon": "brass_lota",
                "snooze_count": 0,
                "status": "ACTIVE",
                "next_trigger_time": "2026-09-14T12:30:00Z",
                "created_at": "2026-09-14T00:00:00Z",
                "updated_at": "2026-09-14T00:00:00Z",
            },
        ])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_register_clinical_reminder(self):
        """Test registering a structured medication reminder with voice prompt attribution."""
        payload = {
            "patient_id": "p_anand_01",
            "type": "MEDICATION",
            "title": "নিশাৰ স্মৃতি দৰব (Night Memantine)",
            "dosage": "1 Tablet (Memantine 10mg)",
            "meal_relation": "AFTER_MEAL",
            "scheduled_time": "21:00",
            "scheduled_days": [0, 1, 2, 3, 4, 5, 6],
            "recurrence": "DAILY",
            "voice_prompt_path": "/audio/reminders/priyanka_night_pill.mp3",
            "voice_speaker_name": "Priyanka",
            "voice_speaker_relation": "নাতিনী (Granddaughter)",
            "cultural_icon": "traditional_mortar",
        }
        res = client.post("/api/v1/reminders/register", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["id"].startswith("rem_"))
        self.assertEqual(data["status"], "ACTIVE")
        self.assertEqual(data["snooze_count"], 0)
        self.assertEqual(data["dosage"], "1 Tablet (Memantine 10mg)")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_get_patient_reminders(self):
        """Test fetching all active reminders for a patient."""
        res = client.get("/api/v1/reminders/patient/p_anand_01")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertGreaterEqual(len(items), 2)
        types = [r["type"] for r in items]
        self.assertIn("MEDICATION", types)
        self.assertIn("HYDRATION", types)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_tick_evaluation_tolerance_window(self):
        """Test daemon tick evaluation within ±30s trigger window."""
        payload = {
            "patient_id": "p_anand_01",
            "simulated_time": "2026-09-14T08:30:15Z",  # 15s into 08:30 slot
        }
        res = client.post("/api/v1/reminders/tick-evaluate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("active_triggers", data)
        morning_trigger = next((t for t in data["active_triggers"] if t["scheduled_time"] == "08:30"), None)
        self.assertIsNotNone(morning_trigger)
        self.assertLessEqual(morning_trigger["drift_seconds"], 30)
        self.assertEqual(morning_trigger["type"], "MEDICATION")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_snooze_and_escalation_lifecycle(self):
        """Test 15-minute snoozing up to 3 times, then escalating on 4th snooze (45 mins)."""
        rem_id = "rem_seed_medication"

        # Snooze 1: Count becomes 1
        res1 = client.post(f"/api/v1/reminders/snooze/{rem_id}")
        self.assertEqual(res1.status_code, 200)
        d1 = res1.json()
        self.assertEqual(d1["status"], "SNOOZED")
        self.assertEqual(d1["snooze_count"], 1)

        # Snooze 2: Count becomes 2
        res2 = client.post(f"/api/v1/reminders/snooze/{rem_id}")
        self.assertEqual(res2.status_code, 200)
        d2 = res2.json()
        self.assertEqual(d2["snooze_count"], 2)

        # Snooze 3: Count becomes 3
        res3 = client.post(f"/api/v1/reminders/snooze/{rem_id}")
        self.assertEqual(res3.status_code, 200)
        d3 = res3.json()
        self.assertEqual(d3["snooze_count"], 3)

        # Snooze 4: Threshold exceeded (45 mins overdue) -> ESCALATION
        res4 = client.post(f"/api/v1/reminders/snooze/{rem_id}")
        self.assertEqual(res4.status_code, 200)
        d4 = res4.json()
        self.assertEqual(d4["status"], "ESCALATED")
        self.assertEqual(d4["reminder"]["status"], "MISSED_ESCALATED")
        alert = d4["escalation_alert"]
        self.assertIn("CRITICAL OVERDUE ALERT", alert["alert_message"])
        self.assertTrue(alert["ivr_fallback_queued"])
        self.assertEqual(alert["minutes_delayed"], 60)
        self.assertEqual(alert["caregiver_phone"], "+91-94350-12345")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_confirm_adherence(self):
        """Test single-tap confirmation resets snooze counter and marks COMPLETED."""
        rem_id = "rem_seed_hydration"
        res = client.post(f"/api/v1/reminders/confirm/{rem_id}")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "COMPLETED")
        self.assertEqual(data["snooze_count"], 0)


if __name__ == "__main__":
    unittest.main()
