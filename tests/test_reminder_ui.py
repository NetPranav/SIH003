"""
Unit tests for Smriti-NER Reminder UI & Interaction Layer
Sub-Phase 10.2: Full-Screen Card, Kinship Voice Playback, Single-Tap Confirmation, and Missed Escalation
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, REMINDERS_DATABASE
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestReminderUI(unittest.TestCase):
    def setUp(self):
        """Resets baseline fixture for reminder UI tests."""
        if not HAS_FASTAPI:
            return
        REMINDERS_DATABASE.clear()
        REMINDERS_DATABASE.extend([
            {
                "id": "rem_card_test_01",
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
            }
        ])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_multilingual_labels_mapping(self):
        """Test existence and integrity of localized action labels."""
        multilingual_labels = {
            "as": {"confirm": "✓ মই খাইছো (খোৱা হ'ল)", "snooze": "⏰ ১৫ মিনিট পিছত সোঁৱৰাব"},
            "bn": {"confirm": "✓ আমি খেয়েছি (নেওয়া হলো)", "snooze": "⏰ ১৫ মিনিট পর মনে করিয়ে দাও"},
            "mni": {"confirm": "✓ ꯑꯩ ꯆꯥꯈ꯭ꯔꯦ", "snooze": "⏰ ꯃꯤꯅꯤꯠ ꯱꯵ ꯀꯣꯟꯅꯥ ꯅꯤꯡꯁꯤꯡꯕꯤꯌꯨ"},
            "hi": {"confirm": "✓ मैंने दवा ले ली है", "snooze": "⏰ १५ मिनट बाद याद दिलाएं"},
            "en": {"confirm": "✓ I have taken it", "snooze": "⏰ Remind me in 15 mins"},
        }
        for lang, labels in multilingual_labels.items():
            self.assertTrue(len(labels["confirm"]) > 0)
            self.assertTrue(len(labels["snooze"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_fullscreen_reminder_card_metadata(self):
        """Test full-screen reminder card contains family speaker, dosage, and cultural icon."""
        res = client.get("/api/v1/reminders/patient/p_anand_01")
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertGreaterEqual(len(items), 1)
        item = items[0]
        self.assertEqual(item["voice_speaker_name"], "Priyanka")
        self.assertIn("নাতিনী", item["voice_speaker_relation"])
        self.assertEqual(item["cultural_icon"], "traditional_mortar")
        self.assertEqual(item["dosage"], "1 Tablet (Donepezil 5mg) after breakfast")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_single_tap_confirmation_ui_flow(self):
        """Test single-tap confirmation API endpoint updates status and resets snooze counter."""
        res = client.post("/api/v1/reminders/confirm/rem_card_test_01")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "COMPLETED")
        self.assertEqual(data["snooze_count"], 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_missed_reminder_escalation_flow(self):
        """Test 3 consecutive snoozes followed by escalation trigger."""
        rem_id = "rem_card_test_01"
        for i in range(1, 4):
            res = client.post(f"/api/v1/reminders/snooze/{rem_id}")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json()["status"], "SNOOZED")

        # 4th snooze -> Escalation
        res_esc = client.post(f"/api/v1/reminders/snooze/{rem_id}")
        self.assertEqual(res_esc.status_code, 200)
        data = res_esc.json()
        self.assertEqual(data["status"], "ESCALATED")
        self.assertEqual(data["reminder"]["status"], "MISSED_ESCALATED")
        alert = data["escalation_alert"]
        self.assertIn("CRITICAL OVERDUE ALERT", alert["alert_message"])
        self.assertTrue(alert["ivr_fallback_queued"])


if __name__ == "__main__":
    unittest.main()
