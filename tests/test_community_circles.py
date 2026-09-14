"""
Smriti-NER (স্মৃতি) — Sub-Phase 7.2: Community Reminiscence Circles Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates non-competitive group reminiscence, ASHA facilitation guides across 8 languages,
village session scheduling, and collective engagement logging.
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
        COMMUNITY_CIRCLES_STORE,
        ASHA_FACILITATION_GUIDES,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCommunityCircles(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            COMMUNITY_CIRCLES_STORE.clear()

    def test_facilitation_guides_completeness_8_languages(self):
        """Verifies ASHA 4-stage facilitation guide covers all 8 NER languages."""
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]
        for lang in expected_languages:
            self.assertIn(lang, ASHA_FACILITATION_GUIDES)
            guide = ASHA_FACILITATION_GUIDES[lang]
            self.assertIn("title", guide)
            self.assertIn("stage1_intro", guide)
            self.assertIn("stage2_prompts", guide)
            self.assertIn("stage3_story", guide)
            self.assertIn("stage4_closure", guide)
            self.assertIn("checklist", guide)
            self.assertTrue(len(guide["stage2_prompts"]) > 0)
            self.assertTrue(len(guide["checklist"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_schedule_circle_session(self):
        """Tests scheduling a community circle session at a rural Anganwadi centre."""
        payload = {
            "village_id": "vil_majuli_kamalabari",
            "village_name": "Kamalabari, Majuli",
            "facility_type": "ANGANWADI_CENTRE",
            "facilitator_name": "Jonali Saikia (ASHA)",
            "scheduled_start_time": "2026-09-20T10:00:00Z",
            "scheduled_end_time": "2026-09-20T10:30:00Z",
            "language": "as",
            "topic": "পুৰণি বিহুগীত আৰু তাঁতশালৰ স্মৃতি",
            "initial_participants": [
                {"patient_id": "p1", "name": "মনোমতী বৰা", "kinship_title": "আইতা", "present": True, "engagement_level": "VERY_ACTIVE"},
                {"patient_id": "p2", "name": "ভবেন্দ্ৰ হাজৰিকা", "kinship_title": "ককা", "present": True, "engagement_level": "MODERATE"},
            ],
        }
        resp = client.post("/api/v1/social/circles/schedule", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["session_id"].startswith("circle_"))
        self.assertEqual(data["status"], "SCHEDULED")
        self.assertEqual(len(data["participants"]), 2)
        self.assertEqual(data["collective_stars_earned"], 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_upcoming_circles_village_filtering(self):
        """Tests retrieval of upcoming circles with village filtering."""
        # Majuli session
        client.post("/api/v1/social/circles/schedule", json={
            "village_id": "vil_majuli",
            "village_name": "Majuli",
            "facility_type": "ANGANWADI_CENTRE",
            "facilitator_name": "Jonali ASHA",
            "scheduled_start_time": "2026-09-21T10:00:00Z",
            "scheduled_end_time": "2026-09-21T10:30:00Z",
            "language": "as",
            "topic": "বিহু স্মৃতি",
        })

        # Imphal session
        client.post("/api/v1/social/circles/schedule", json={
            "village_id": "vil_imphal_west",
            "village_name": "Imphal West",
            "facility_type": "SUB_CENTRE",
            "facilitator_name": "Ibemhal ASHA",
            "scheduled_start_time": "2026-09-21T14:00:00Z",
            "scheduled_end_time": "2026-09-21T14:30:00Z",
            "language": "mni",
            "topic": "ꯂꯥꯏ ꯍꯔꯥꯎꯕꯒꯤ ꯋꯥꯔꯤ",
        })

        # Query all
        all_resp = client.get("/api/v1/social/circles/upcoming")
        self.assertEqual(all_resp.status_code, 200)
        self.assertEqual(len(all_resp.json()), 2)

        # Query Majuli only
        majuli_resp = client.get("/api/v1/social/circles/upcoming?village_id=vil_majuli")
        self.assertEqual(majuli_resp.status_code, 200)
        self.assertEqual(len(majuli_resp.json()), 1)
        self.assertEqual(majuli_resp.json()[0]["village_id"], "vil_majuli")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_log_circle_engagement_collective_scoring(self):
        """Tests logging non-competitive engagement and collective stars."""
        # 1. Schedule session
        sched_resp = client.post("/api/v1/social/circles/schedule", json={
            "village_id": "vil_majuli",
            "village_name": "Majuli",
            "facility_type": "ANGANWADI_CENTRE",
            "facilitator_name": "Jonali ASHA",
            "scheduled_start_time": "2026-09-21T10:00:00Z",
            "scheduled_end_time": "2026-09-21T10:30:00Z",
            "language": "as",
            "topic": "বিহু স্মৃতি",
        })
        session_id = sched_resp.json()["session_id"]

        # 2. Log engagement
        log_payload = {
            "session_id": session_id,
            "participants": [
                {"patient_id": "p1", "name": "মনোমতী বৰা", "kinship_title": "আইতা", "present": True, "engagement_level": "VERY_ACTIVE"},
                {"patient_id": "p2", "name": "ভবেন্দ্ৰ হাজৰিকা", "kinship_title": "ককা", "present": True, "engagement_level": "VERY_ACTIVE"},
                {"patient_id": "p3", "name": "প্ৰমিলা গগৈ", "kinship_title": "আইতা", "present": True, "engagement_level": "OBSERVER"},
            ],
            "collective_stars_earned": 500,
            "laughter_interaction_rating": 0.95,
            "verbal_participation_rating": 0.90,
            "field_notes": "All elders sang Tokari geet with immense warmth.",
        }
        log_resp = client.post("/api/v1/social/circles/log-engagement", json=log_payload)
        self.assertEqual(log_resp.status_code, 200)
        data = log_resp.json()

        self.assertEqual(data["status"], "COMPLETED")
        self.assertEqual(data["collective_stars_earned"], 500)
        self.assertEqual(data["laughter_interaction_rating"], 0.95)
        self.assertEqual(data["verbal_participation_rating"], 0.90)
        self.assertEqual(len(data["participants"]), 3)

        # 3. Test non-existent session error
        fake_payload = {**log_payload, "session_id": "circle_non_existent"}
        err_resp = client.post("/api/v1/social/circles/log-engagement", json=fake_payload)
        self.assertEqual(err_resp.status_code, 404)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_get_asha_facilitation_guide_endpoint(self):
        """Tests GET /api/v1/social/circles/facilitation-guide endpoint."""
        resp = client.get("/api/v1/social/circles/facilitation-guide?language=as")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["language"], "as")
        self.assertIn("লোকগীত", data["stage1_intro"])


if __name__ == "__main__":
    unittest.main()
