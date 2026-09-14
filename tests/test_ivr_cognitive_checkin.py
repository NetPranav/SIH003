"""
Smriti-NER (স্মৃতি) — Sub-Phase 8.1: IVR Cognitive Check-In Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates zero-smartphone 2G IVR check-in, 3-word delayed recall,
orientation assessment, and composite TICS scoring across 8 languages.
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
        IVR_CULTURAL_TRIPLETS,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIvrCognitiveCheckIn(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            IVR_SESSIONS_STORE.clear()

    def test_cultural_triplets_8_languages(self):
        """Validates all 8 official NER languages have 3 culturally resonant words."""
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]
        for lang in expected_languages:
            self.assertIn(lang, IVR_CULTURAL_TRIPLETS)
            data = IVR_CULTURAL_TRIPLETS[lang]
            self.assertEqual(len(data["words"]), 3, f"Expected 3 words for {lang}")
            self.assertEqual(len(data["phonetics"]), 3, f"Expected 3 phonetics for {lang}")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_ivr_checkin_full_flow_perfect_score(self):
        """Tests complete IVR flow with 100% correct orientation and 3/3 word recall."""
        # 1. Start session
        start_resp = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": "pt_elder_ivr_01",
            "patient_name": "ৰত্নেশ্বৰ শইকীয়া",
            "phone_number": "9864011223",
            "language": "as",
        })
        self.assertEqual(start_resp.status_code, 200)
        session = start_resp.json()
        session_id = session["session_id"]
        self.assertEqual(session["status"], "WORD_PRESENTATION")
        self.assertEqual(session["words_presented"], ["গামোচা", "জাঁপী", "কাজিৰঙা"])

        # 2. Submit morning orientation via DTMF Key 1 at 10 AM
        orient_resp = client.post("/api/v1/ivr/checkin/orientation", json={
            "session_id": session_id,
            "input_method": "DTMF",
            "dtmf_digit": "1",
            "current_hour": 10,
        })
        self.assertEqual(orient_resp.status_code, 200)
        orient_data = orient_resp.json()
        self.assertTrue(orient_data["orientation_correct"])
        self.assertEqual(orient_data["status"], "DELAYED_RECALL")

        # 3. Submit delayed recall with all 3 words
        recall_resp = client.post("/api/v1/ivr/checkin/recall", json={
            "session_id": session_id,
            "recalled_words": ["গামোচা", "জাঁপী", "কাজিৰঙা"],
        })
        self.assertEqual(recall_resp.status_code, 200)
        final_data = recall_resp.json()

        self.assertEqual(final_data["status"], "COMPLETED")
        self.assertEqual(final_data["recall_score"], 3)
        self.assertEqual(final_data["composite_score"], 100)
        self.assertEqual(final_data["status_label"], "NORMAL_STABLE")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_ivr_orientation_voice_recognition(self):
        """Tests spoken voice response recognition for orientation."""
        # 1. Start session
        start_resp = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": "pt_elder_ivr_02",
            "patient_name": "Aparna Debnath",
            "phone_number": "9864099887",
            "language": "bn",
        })
        session_id = start_resp.json()["session_id"]

        # 2. Spoken 'সকাল' in the morning (hour 9)
        orient_resp = client.post("/api/v1/ivr/checkin/orientation", json={
            "session_id": session_id,
            "input_method": "VOICE",
            "spoken_text": "এখন তো সকাল হয়েছে",
            "current_hour": 9,
        })
        self.assertEqual(orient_resp.status_code, 200)
        self.assertTrue(orient_resp.json()["orientation_correct"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_composite_scoring_thresholds(self):
        """Validates mathematical weighting: 0.4 * orient + 0.6 * (recall / 3)."""
        # Case A: Orientation incorrect (0), Recall 1/3 (0.333) -> (0 + 0.2) * 100 = 20 -> ATTENTION_SUGGESTED
        start_a = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": "pt_elder_low",
            "patient_name": "Elder Low",
            "phone_number": "9864000001",
            "language": "en",
        })
        sess_a = start_a.json()["session_id"]
        # Wrong orientation (claims evening at 10 AM)
        client.post("/api/v1/ivr/checkin/orientation", json={
            "session_id": sess_a,
            "input_method": "DTMF",
            "dtmf_digit": "2",
            "current_hour": 10,
        })
        rec_a = client.post("/api/v1/ivr/checkin/recall", json={
            "session_id": sess_a,
            "recalled_words": ["Shawl"],
        })
        data_a = rec_a.json()
        self.assertEqual(data_a["composite_score"], 20)
        self.assertEqual(data_a["status_label"], "ATTENTION_SUGGESTED")

        # Case B: Orientation correct (1.0), Recall 1/3 (0.333) -> (0.4 + 0.2) * 100 = 60 -> MILD_FLUCTUATION
        start_b = client.post("/api/v1/ivr/checkin/start", json={
            "patient_id": "pt_elder_mid",
            "patient_name": "Elder Mid",
            "phone_number": "9864000002",
            "language": "en",
        })
        sess_b = start_b.json()["session_id"]
        client.post("/api/v1/ivr/checkin/orientation", json={
            "session_id": sess_b,
            "input_method": "DTMF",
            "dtmf_digit": "1",
            "current_hour": 10,
        })
        rec_b = client.post("/api/v1/ivr/checkin/recall", json={
            "session_id": sess_b,
            "recalled_words": ["Mountain"],
        })
        data_b = rec_b.json()
        self.assertEqual(data_b["composite_score"], 60)
        self.assertEqual(data_b["status_label"], "MILD_FLUCTUATION")


if __name__ == "__main__":
    unittest.main()
