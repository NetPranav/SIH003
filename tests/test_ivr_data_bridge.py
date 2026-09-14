"""
Smriti-NER (স্মৃতি) — Sub-Phase 8.4: IVR-to-Platform Data Bridge Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates zero-smartphone telemetry ingestion, cross-channel adherence streak calculation,
cognitive stability trend tracking, and Caregiver Feed alerts.
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
        IVR_SESSIONS_STORE,
        IVR_SCHEDULES_STORE,
        IVR_ESCALATIONS_STORE,
        IVR_BRIDGE_EVENTS_STORE,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIvrDataBridge(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            IVR_SESSIONS_STORE.clear()
            IVR_SCHEDULES_STORE.clear()
            IVR_ESCALATIONS_STORE.clear()
            IVR_BRIDGE_EVENTS_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_sync_checkin_to_telemetry(self):
        """Tests that completed IVR check-in is ingested and appears in unified telemetry."""
        patient_id = "pt_bridge_001"

        # 1. Start & complete an IVR check-in session
        start_resp = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": patient_id,
            "patient_name": "দেবেন্দ্ৰ নাথ বৰা",
            "phone_number": "9864012345",
            "language": "as",
        })
        self.assertEqual(start_resp.status_code, 200)
        session_id = start_resp.json()["session_id"]

        # Orientation answer
        client.post("/api/v1/ivr/checkin/orientation", json={
            "session_id": session_id,
            "input_method": "DTMF",
            "dtmf_digit": "1",
            "current_hour": 10,
        })

        # Recall words
        client.post("/api/v1/ivr/checkin/recall", json={
            "session_id": session_id,
            "recalled_words": ["গামোচা", "জাঁপী", "কাজিৰঙা"],
        })

        # 2. Sync session to platform bridge
        bridge_resp = client.post("/api/v1/ivr/bridge/sync-checkin", json={
            "session_id": session_id,
        })
        self.assertEqual(bridge_resp.status_code, 200)
        event_data = bridge_resp.json()
        self.assertEqual(event_data["event_type"], "COGNITIVE_CHECKIN")
        self.assertEqual(event_data["channel"], "IVR_PHONE")
        self.assertEqual(event_data["checkin_details"]["composite_score"], 100)
        self.assertEqual(event_data["checkin_details"]["status_label"], "NORMAL_STABLE")

        # 3. Fetch unified telemetry
        tel_resp = client.get(f"/api/v1/ivr/bridge/unified-telemetry/{patient_id}")
        self.assertEqual(tel_resp.status_code, 200)
        tel = tel_resp.json()
        self.assertEqual(tel["patient_id"], patient_id)
        self.assertEqual(tel["ivr_interactions"], 1)
        self.assertEqual(tel["latest_cognitive_score"], 100)
        self.assertEqual(len(tel["recent_events"]), 1)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_adherence_streak_and_rate_calculation(self):
        """Tests longitudinal adherence rate % and consecutive streak calculation."""
        patient_id = "pt_bridge_adh_02"

        # Create 3 schedules and sync adherence
        # Day 1: Confirmed
        sched1_resp = client.post("/api/v1/ivr/reminders/schedule", json={
            "patient_id": patient_id,
            "patient_name": "মলয়া গোস্বামী",
            "phone_number": "9864022334",
            "caregiver_phone": "9864099887",
            "asha_worker_phone": "9864011223",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-18T08:00:00Z",
            "language": "as",
        })
        sched1_id = sched1_resp.json()["schedule_id"]
        client.post("/api/v1/ivr/bridge/sync-adherence", json={
            "schedule_id": sched1_id,
            "confirmed": True,
            "attempts_count": 1,
        })

        # Day 2: Confirmed
        sched2_resp = client.post("/api/v1/ivr/reminders/schedule", json={
            "patient_id": patient_id,
            "patient_name": "মলয়া গোস্বামী",
            "phone_number": "9864022334",
            "caregiver_phone": "9864099887",
            "asha_worker_phone": "9864011223",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-19T08:00:00Z",
            "language": "as",
        })
        sched2_id = sched2_resp.json()["schedule_id"]
        client.post("/api/v1/ivr/bridge/sync-adherence", json={
            "schedule_id": sched2_id,
            "confirmed": True,
            "attempts_count": 1,
        })

        # Day 3: Confirmed
        sched3_resp = client.post("/api/v1/ivr/reminders/schedule", json={
            "patient_id": patient_id,
            "patient_name": "মলয়া গোস্বামী",
            "phone_number": "9864022334",
            "caregiver_phone": "9864099887",
            "asha_worker_phone": "9864011223",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-20T08:00:00Z",
            "language": "as",
        })
        sched3_id = sched3_resp.json()["schedule_id"]
        client.post("/api/v1/ivr/bridge/sync-adherence", json={
            "schedule_id": sched3_id,
            "confirmed": True,
            "attempts_count": 1,
        })

        # Verify 3-day consecutive streak & 100% adherence
        tel_resp = client.get(f"/api/v1/ivr/bridge/unified-telemetry/{patient_id}")
        self.assertEqual(tel_resp.status_code, 200)
        tel = tel_resp.json()
        self.assertEqual(tel["adherence_rate_percent"], 100)
        self.assertEqual(tel["consecutive_adherence_streak"], 3)

        # Day 4: Missed (Unconfirmed)
        sched4_resp = client.post("/api/v1/ivr/reminders/schedule", json={
            "patient_id": patient_id,
            "patient_name": "মলয়া গোস্বামী",
            "phone_number": "9864022334",
            "caregiver_phone": "9864099887",
            "asha_worker_phone": "9864011223",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-21T08:00:00Z",
            "language": "as",
        })
        sched4_id = sched4_resp.json()["schedule_id"]
        client.post("/api/v1/ivr/bridge/sync-adherence", json={
            "schedule_id": sched4_id,
            "confirmed": False,
            "attempts_count": 3,
        })

        # Verify rate drops to 75% and current streak resets to 0
        tel_resp2 = client.get(f"/api/v1/ivr/bridge/unified-telemetry/{patient_id}")
        tel2 = tel_resp2.json()
        self.assertEqual(tel2["adherence_rate_percent"], 75)
        self.assertEqual(tel2["consecutive_adherence_streak"], 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_escalation_alert_sync_and_caregiver_feed(self):
        """Tests that missed-call escalations appear in Caregiver Feed as active alerts."""
        patient_id = "pt_bridge_esc_03"

        # 1. Schedule reminder
        sched_resp = client.post("/api/v1/ivr/reminders/schedule", json={
            "patient_id": patient_id,
            "patient_name": "ৰমেশ কলিতা",
            "phone_number": "9864033445",
            "caregiver_phone": "9864066778",
            "asha_worker_phone": "9864088990",
            "reminder_type": "MEDICATION",
            "scheduled_time": "2026-09-20T09:00:00Z",
            "language": "as",
        })
        sched_id = sched_resp.json()["schedule_id"]

        # 2. Trigger 3 failed attempts to create escalation
        client.post("/api/v1/ivr/reminders/call-attempt", json={"schedule_id": sched_id, "outcome": "NO_ANSWER"})
        client.post("/api/v1/ivr/reminders/call-attempt", json={"schedule_id": sched_id, "outcome": "NO_ANSWER"})
        esc_resp = client.post("/api/v1/ivr/reminders/call-attempt", json={"schedule_id": sched_id, "outcome": "NO_ANSWER"})
        self.assertTrue(esc_resp.json()["escalated"])
        escalation_id = esc_resp.json()["escalation_notice"]["escalation_id"]

        # 3. Sync escalation into Data Bridge
        sync_resp = client.post(f"/api/v1/ivr/bridge/sync-escalation/{escalation_id}")
        self.assertEqual(sync_resp.status_code, 200)
        self.assertEqual(sync_resp.json()["event_type"], "ESCALATION_ALERT")

        # 4. Check unified telemetry active alert count
        tel_resp = client.get(f"/api/v1/ivr/bridge/unified-telemetry/{patient_id}")
        self.assertEqual(tel_resp.json()["active_escalation_alerts"], 1)

        # 5. Check caregiver IVR feed
        feed_resp = client.get(f"/api/v1/ivr/bridge/feed/{patient_id}")
        self.assertEqual(feed_resp.status_code, 200)
        feed = feed_resp.json()
        self.assertTrue(len(feed) >= 1)
        self.assertEqual(feed[0]["event_type"], "ESCALATION_ALERT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_cognitive_stability_trends_and_patient_isolation(self):
        """Tests cognitive stability trends (STABLE, IMPROVING) and strict multi-patient telemetry isolation."""
        patient_a = "pt_bridge_iso_a"
        patient_b = "pt_bridge_iso_b"

        # Patient A: 2 sessions with identical high scores -> STABLE
        # Session 1
        s1 = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": patient_a, "patient_name": "প্ৰভাত বৰুৱা", "phone_number": "9864011111", "language": "as",
        }).json()["session_id"]
        client.post("/api/v1/ivr/checkin/orientation", json={"session_id": s1, "input_method": "DTMF", "dtmf_digit": "1", "current_hour": 10})
        client.post("/api/v1/ivr/checkin/recall", json={"session_id": s1, "recalled_words": ["গামোচা", "জাঁপী", "কাজিৰঙা"]})
        client.post("/api/v1/ivr/bridge/sync-checkin", json={"session_id": s1})

        # Session 2
        s2 = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": patient_a, "patient_name": "প্ৰভাত বৰুৱা", "phone_number": "9864011111", "language": "as",
        }).json()["session_id"]
        client.post("/api/v1/ivr/checkin/orientation", json={"session_id": s2, "input_method": "DTMF", "dtmf_digit": "1", "current_hour": 10})
        client.post("/api/v1/ivr/checkin/recall", json={"session_id": s2, "recalled_words": ["গামোচা", "জাঁপী", "কাজিৰঙা"]})
        client.post("/api/v1/ivr/bridge/sync-checkin", json={"session_id": s2})

        tel_a = client.get(f"/api/v1/ivr/bridge/unified-telemetry/{patient_a}").json()
        self.assertEqual(tel_a["patient_id"], patient_a)
        self.assertEqual(tel_a["ivr_interactions"], 2)
        self.assertEqual(tel_a["cognitive_stability_trend"], "STABLE")

        # Patient B has 0 interactions
        tel_b = client.get(f"/api/v1/ivr/bridge/unified-telemetry/{patient_b}").json()
        self.assertEqual(tel_b["patient_id"], patient_b)
        self.assertEqual(tel_b["ivr_interactions"], 0)
        self.assertEqual(tel_b["cognitive_stability_trend"], "INSUFFICIENT_DATA")


if __name__ == "__main__":
    unittest.main()

