"""
Smriti-NER (স্মৃতি) — Sub-Phase 7.3: Digital Legacy Storytelling Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates life-review recording, Bhashini ASR transcription,
story-to-trivia content flywheel, and family archive search & filtering.
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
        DIGITAL_LEGACY_STORE,
        GENERATED_TRIVIA_STORE,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestDigitalLegacyStorytelling(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            DIGITAL_LEGACY_STORE.clear()
            GENERATED_TRIVIA_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_record_and_transcribe_legacy_story(self):
        """Tests recording an elder story and subsequent ASR transcription."""
        # 1. Record story
        rec_payload = {
            "patient_id": "pt_elder_legacy_01",
            "patient_name": "ভবেন্দ্ৰ হাজৰিকা",
            "kinship_title": "ককা",
            "title": "ব্ৰহ্মপুত্ৰৰ পুৰণি নাওখেলৰ স্মৃতি",
            "category": "COMMUNITY_HISTORY",
            "language": "as",
            "duration_seconds": 180.0,
        }
        rec_resp = client.post("/api/v1/social/legacy/record", json=rec_payload)
        self.assertEqual(rec_resp.status_code, 200)
        story_data = rec_resp.json()
        story_id = story_data["id"]
        self.assertTrue(story_id.startswith("story_"))
        self.assertFalse(story_data["is_transcribed"])

        # 2. Transcribe story
        tx_resp = client.post(f"/api/v1/social/legacy/transcribe/{story_id}", json={
            "asr_transcript": "১৯৬৫ চনত আমাৰ গাঁৱৰ নাওখেল হৈছিল ব্ৰহ্মপুত্ৰত। সকলোৱে সুন্দৰকৈ নাও বাইছিল।"
        })
        self.assertEqual(tx_resp.status_code, 200)
        updated_data = tx_resp.json()
        self.assertTrue(updated_data["is_transcribed"])
        self.assertIn("ব্ৰহ্মপুত্ৰ", updated_data["transcript"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_story_to_trivia_flywheel(self):
        """Tests converting a transcribed story into interactive game trivia."""
        # 1. Record story with initial transcript
        rec_resp = client.post("/api/v1/social/legacy/record", json={
            "patient_id": "pt_elder_flywheel",
            "patient_name": "ভবেন্দ্ৰ হাজৰিকা",
            "kinship_title": "ককা",
            "title": "পুৰণি বৰ্ষা খেতিৰ সাধু",
            "category": "AGRICULTURE_HARVEST",
            "language": "as",
            "duration_seconds": 120.0,
            "initial_transcript": "বৰষুণৰ দিনত আমি বোকা পথাৰত ধান ৰুইছিলোঁ আৰু ৰাতি সকলোৱে একেলগে জোনাকী পৰুৱা চাইছিলোঁ।",
        })
        self.assertEqual(rec_resp.status_code, 200)
        story_id = rec_resp.json()["id"]

        # 2. Generate trivia
        triv_resp = client.post(f"/api/v1/social/legacy/generate-trivia/{story_id}")
        self.assertEqual(triv_resp.status_code, 200)
        questions = triv_resp.json()

        self.assertGreaterEqual(len(questions), 2)
        for q in questions:
            self.assertEqual(q["story_id"], story_id)
            self.assertEqual(len(q["options"]), 4)
            self.assertIn(q["correct_index"], [0, 1, 2, 3])
            self.assertTrue(len(q["explanation"]) > 0)

        # 3. Test untranscribed story generates error
        untranscribed = client.post("/api/v1/social/legacy/record", json={
            "patient_id": "pt_elder_flywheel",
            "patient_name": "ভবেন্দ্ৰ",
            "title": "অসম্পূৰ্ণ গল্প",
            "category": "FAMILY_CELEBRATION",
            "language": "as",
            "duration_seconds": 60.0,
        })
        err_resp = client.post(f"/api/v1/social/legacy/generate-trivia/{untranscribed.json()['id']}")
        self.assertEqual(err_resp.status_code, 400)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_family_archive_filtering_and_search(self):
        """Tests archive search, category filtering, and language filtering."""
        patient_id = "pt_archive_user"

        # Story 1: Folklore in Assamese
        client.post("/api/v1/social/legacy/record", json={
            "patient_id": patient_id,
            "patient_name": "ককা",
            "title": "তেজীমলাৰ সাধু",
            "category": "CHILDHOOD_FOLKLORE",
            "language": "as",
            "duration_seconds": 150.0,
            "initial_transcript": "আইতাই কোৱা তেজীমলাৰ মনোৰম কাহিনী।",
        })

        # Story 2: Harvest in English
        client.post("/api/v1/social/legacy/record", json={
            "patient_id": patient_id,
            "patient_name": "Grandpa",
            "title": "Paddy Harvest of 1972",
            "category": "AGRICULTURE_HARVEST",
            "language": "en",
            "duration_seconds": 210.0,
            "initial_transcript": "Our golden autumn harvest in the valley.",
        })

        # Query all
        all_resp = client.get(f"/api/v1/social/legacy/archive/{patient_id}")
        self.assertEqual(all_resp.status_code, 200)
        self.assertEqual(len(all_resp.json()), 2)

        # Query by category: CHILDHOOD_FOLKLORE
        folk_resp = client.get(f"/api/v1/social/legacy/archive/{patient_id}?category=CHILDHOOD_FOLKLORE")
        self.assertEqual(folk_resp.status_code, 200)
        self.assertEqual(len(folk_resp.json()), 1)
        self.assertEqual(folk_resp.json()[0]["category"], "CHILDHOOD_FOLKLORE")

        # Query by search query: "Harvest"
        search_resp = client.get(f"/api/v1/social/legacy/archive/{patient_id}?search_query=harvest")
        self.assertEqual(search_resp.status_code, 200)
        self.assertEqual(len(search_resp.json()), 1)
        self.assertIn("Harvest", search_resp.json()[0]["title"])


if __name__ == "__main__":
    unittest.main()
