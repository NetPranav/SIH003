"""
Smriti-NER (স্মৃতি) — Sub-Phase 8.2: IVR Reminder & Adherence Delivery Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates outbound scheduled IVR reminders, keypress adherence confirmation,
and the 3-attempt missed-call escalation safeguard.
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from fastapi.testclient import TestClient
    from server.main import (
        app,
        IVR_SCHEDULES_STORE,
        IVR_ESCALATIONS_STORE,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIvrReminderAdherence(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            IVR_SCHEDULES_STORE.clear()
            IVR_ESCALATIONS_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_schedule_and_confirm_adherence(self):
        """Tests scheduling an adherence call and confirming via DTMF Key 1."""
        # 1. Schedule outbound reminder
        sched_payload = {
            "patient_id": "pt_elder_adh_01",
            "patient_name": "ৰত্নেশ্বৰ শইকীয়া",
            "phone_number": "9864011223",
            "caregiver_phone": "9864044556",
            "asha_worker_phone": "9864077889",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-20T08:30:00Z",
            "language": "as",
        }
        resp = client.post("/api/v1/ivr/reminders/schedule", json=sched_payload)
        self.assertEqual(resp.status_code, 200)
        sched_data = resp.json()
        schedule_id = sched_data["schedule_id"]
        self.assertEqual(sched_data["status"], "PENDING")
        self.assertEqual(sched_data["current_attempt"], 0)

        # 2. Answer and confirm
        call_resp = client.post("/api/v1/ivr/reminders/call-attempt", json={
            "schedule_id": schedule_id,
            "outcome": "ANSWERED_CONFIRMED",
        })
        self.assertEqual(call_resp.status_code, 200)
        result = call_resp.json()
        self.assertFalse(result["escalated"])
        self.assertEqual(result["schedule"]["status"], "COMPLETED")
        self.assertTrue(result["schedule"]["confirmed_adherence"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_3_attempt_missed_call_escalation(self):
        """Validates that 3 unanswered calls trigger emergency ASHA & Caregiver escalation."""
        # 1. Schedule
        sched_resp = client.post("/api/v1/ivr/reminders/schedule", json={
            "patient_id": "pt_elder_esc_01",
            "patient_name": "Tombi Devi",
            "phone_number": "9864099111",
            "caregiver_phone": "9864099222",
            "asha_worker_phone": "9864099333",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-20T08:30:00Z",
            "language": "mni",
            "max_attempts": 3,
        })
        schedule_id = sched_resp.json()["schedule_id"]

        # Attempt 1: No answer
        att1 = client.post("/api/v1/ivr/reminders/call-attempt", json={
            "schedule_id": schedule_id,
            "outcome": "NO_ANSWER",
        })
        self.assertEqual(att1.status_code, 200)
        self.assertFalse(att1.json()["escalated"])
        self.assertEqual(att1.json()["schedule"]["current_attempt"], 1)
        self.assertEqual(att1.json()["schedule"]["status"], "IN_PROGRESS")

        # Attempt 2: Busy
        att2 = client.post("/api/v1/ivr/reminders/call-attempt", json={
            "schedule_id": schedule_id,
            "outcome": "BUSY",
        })
        self.assertEqual(att2.status_code, 200)
        self.assertFalse(att2.json()["escalated"])
        self.assertEqual(att2.json()["schedule"]["current_attempt"], 2)

        # Attempt 3: No answer -> MUST TRIGGER ESCALATION
        att3 = client.post("/api/v1/ivr/reminders/call-attempt", json={
            "schedule_id": schedule_id,
            "outcome": "NO_ANSWER",
        })
        self.assertEqual(att3.status_code, 200)
        res3 = att3.json()
        self.assertTrue(res3["escalated"])
        self.assertEqual(res3["schedule"]["status"], "ESCALATED")
        self.assertIsNotNone(res3["escalation_notice"])
        self.assertIn("CRITICAL ALERT", res3["escalation_notice"]["alert_message"])
        self.assertEqual(res3["escalation_notice"]["caregiver_phone"], "9864099222")
        self.assertEqual(res3["escalation_notice"]["asha_worker_phone"], "9864099333")

        # 2. Verify escalation query
        esc_list = client.get("/api/v1/ivr/reminders/escalations")
        self.assertEqual(esc_list.status_code, 200)
        self.assertEqual(len(esc_list.json()), 1)
        esc_id = esc_list.json()[0]["escalation_id"]

        # 3. Acknowledge escalation
        ack_resp = client.post(f"/api/v1/ivr/reminders/escalations/acknowledge/{esc_id}", params={
            "acknowledged_by": "Ibemhal Devi (ASHA)",
        })
        self.assertEqual(ack_resp.status_code, 200)
        self.assertTrue(ack_resp.json()["acknowledged"])

        # 4. Verified cleared from unacknowledged list
        empty_list = client.get("/api/v1/ivr/reminders/escalations")
        self.assertEqual(len(empty_list.json()), 0)


if __name__ == "__main__":
    unittest.main()
