"""
Smriti-NER (স্মৃতি) — Sub-Phase 7.1: Grandchild Connect Engine Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates async co-play, 10s ceiling clue recording, clue-linked game round binding,
and elder-to-family response loops across 8 languages.
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
        GRANDCHILD_CLUES_STORE,
        CELEBRATION_MESSAGES,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestGrandchildConnect(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            GRANDCHILD_CLUES_STORE.clear()

    def test_celebration_messages_8_language_parity(self):
        """Verifies celebration loop messages are available in all 8 NER languages."""
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]
        for lang in expected_languages:
            self.assertIn(lang, CELEBRATION_MESSAGES)
            msg = CELEBRATION_MESSAGES[lang].format(kinship="ককা", grandchild="অনন্যা")
            self.assertTrue(len(msg) > 0)
            self.assertIn("🌟", msg)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_clue_duration_ceiling_enforcement(self):
        """Ensures clue duration strictly enforces <= 10.0 seconds limit."""
        # Valid clue (6.5s)
        valid_payload = {
            "patient_id": "pt_elder_test_01",
            "grandchild_name": "Ananya",
            "kinship_title": "Granddaughter",
            "media_type": "AUDIO",
            "duration_seconds": 6.5,
            "transcript": "Grandpa, pick the golden thread!",
            "language": "en",
            "target_game": "BIHU_LOOM",
            "round_id": "loom_round_01",
            "target_hint_answer": "Golden thread",
        }
        resp = client.post("/api/v1/social/clues/record", json=valid_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["id"].startswith("clue_gcc_"))
        self.assertFalse(data["is_played"])

        # Invalid clue (> 10.0s)
        invalid_payload = {
            **valid_payload,
            "duration_seconds": 12.5,
        }
        invalid_resp = client.post("/api/v1/social/clues/record", json=invalid_payload)
        self.assertEqual(invalid_resp.status_code, 400)
        self.assertIn("duration must be between 0.1s and 10.0s", invalid_resp.json()["detail"])

        # Invalid clue (<= 0s)
        zero_payload = {
            **valid_payload,
            "duration_seconds": 0.0,
        }
        zero_resp = client.post("/api/v1/social/clues/record", json=zero_payload)
        self.assertEqual(zero_resp.status_code, 400)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_pending_clues_game_filtering(self):
        """Tests retrieval of pending clues with game type filtering."""
        patient_id = "pt_elder_filtered"

        # Record 1 Loom clue
        client.post("/api/v1/social/clues/record", json={
            "patient_id": patient_id,
            "grandchild_name": "Ananya",
            "kinship_title": "নাতিনী",
            "media_type": "AUDIO",
            "duration_seconds": 5.0,
            "transcript": "সোণালী সূতা বাছক!",
            "language": "as",
            "target_game": "BIHU_LOOM",
            "round_id": "loom_01",
            "target_hint_answer": "সোণালী সূতা",
        })

        # Record 1 Fauna clue
        client.post("/api/v1/social/clues/record", json={
            "patient_id": patient_id,
            "grandchild_name": "অৰ্ণৱ",
            "kinship_title": "নাতি",
            "media_type": "VIDEO",
            "duration_seconds": 7.5,
            "transcript": "ধনেশ চৰাইটো চিনি পোৱা নেকি?",
            "language": "as",
            "target_game": "FAUNA_CALLS",
            "round_id": "fauna_01",
            "target_hint_answer": "ধনেশ",
        })

        # Fetch all pending
        all_resp = client.get(f"/api/v1/social/clues/pending/{patient_id}")
        self.assertEqual(all_resp.status_code, 200)
        self.assertEqual(len(all_resp.json()), 2)

        # Fetch only Loom
        loom_resp = client.get(f"/api/v1/social/clues/pending/{patient_id}?game_type=BIHU_LOOM")
        self.assertEqual(loom_resp.status_code, 200)
        self.assertEqual(len(loom_resp.json()), 1)
        self.assertEqual(loom_resp.json()[0]["target_game"], "BIHU_LOOM")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_complete_round_response_loop(self):
        """Tests that completing a clue-linked round marks the clue as played and returns elder celebration."""
        patient_id = "pt_elder_loop"

        # 1. Record clue
        rec_resp = client.post("/api/v1/social/clues/record", json={
            "patient_id": patient_id,
            "grandchild_name": "অনন্যা",
            "kinship_title": "নাতিনী",
            "media_type": "AUDIO",
            "duration_seconds": 6.0,
            "transcript": "ককা সোণালী সূতা বাছক!",
            "language": "as",
            "target_game": "BIHU_LOOM",
            "round_id": "loom_01",
            "target_hint_answer": "সোণালী সূতা",
        })
        clue_id = rec_resp.json()["id"]

        # 2. Complete round
        complete_resp = client.post("/api/v1/social/clues/complete-round", json={
            "clue_id": clue_id,
            "patient_id": patient_id,
            "grandchild_name": "অনন্যা",
            "game_round_id": "loom_01",
            "score": 100,
            "time_spent_ms": 7200.0,
            "language": "as",
            "kinship_title": "ককা",
        })
        self.assertEqual(complete_resp.status_code, 200)
        loop_data = complete_resp.json()

        self.assertEqual(loop_data["status"], "COMPLETED")
        self.assertEqual(loop_data["elder_reaction_badge"], "CELEBRATION_STAR")
        self.assertIn("ককায়ে তোমাৰ ক্লুৰে খেলি সম্পূৰ্ণ কৰিলে!", loop_data["celebration_message"])
        self.assertIn("অনন্যা", loop_data["celebration_message"])

        # 3. Verify clue is marked played
        pending_resp = client.get(f"/api/v1/social/clues/pending/{patient_id}")
        self.assertEqual(len(pending_resp.json()), 0)


if __name__ == "__main__":
    unittest.main()
