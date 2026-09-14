"""
Smriti-NER (স্মৃতি) — Sub-Phase 6.1: Bhashini Voice Integration & Keyword Spotting Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates 8-Language Indic-TTS, Geriatric Keyword Spotting (<500ms), and Resilient Fallback.
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT_DIR)

try:
    from fastapi.testclient import TestClient
    from server.main import app, SUPPORTED_VOICE_LANGUAGES, KEYWORD_LEXICON
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestBhashiniVoiceIntegration(unittest.TestCase):

    def test_8_language_voice_profiles(self):
        """Validates all 8 NER official languages have Bhashini model mappings and scripts."""
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]
        self.assertEqual(len(SUPPORTED_VOICE_LANGUAGES), 8)

        for lang in expected_languages:
            self.assertIn(lang, SUPPORTED_VOICE_LANGUAGES)
            profile = SUPPORTED_VOICE_LANGUAGES[lang]
            self.assertIn("name", profile)
            self.assertIn("native", profile)
            self.assertIn("model_tts", profile)
            self.assertIn("model_asr", profile)
            self.assertIn("script", profile)
            self.assertTrue(profile["model_tts"].startswith("ai4bharat/indic-tts-"))
            self.assertTrue(profile["model_asr"].startswith("ai4bharat/conformer-"))

    def test_keyword_lexicon_completeness(self):
        """Verifies 6 core geriatric intents are populated across all 8 languages."""
        expected_intents = ["HELP", "REPEAT", "LISTEN", "YES", "BACK", "NEXT"]
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]

        for intent in expected_intents:
            self.assertIn(intent, KEYWORD_LEXICON)
            lang_dict = KEYWORD_LEXICON[intent]
            for lang in expected_languages:
                self.assertIn(lang, lang_dict, f"Intent {intent} missing keywords for {lang}")
                keywords = lang_dict[lang]
                self.assertGreater(len(keywords), 0, f"Empty keywords for {intent} in {lang}")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_get_supported_languages_endpoint(self):
        """Tests GET /api/v1/voice/languages returns 8 languages."""
        resp = client.get("/api/v1/voice/languages")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 8)
        self.assertIn("as", data)
        self.assertIn("mni", data)
        self.assertEqual(data["as"]["native"], "অসমীয়া")
        self.assertEqual(data["mni"]["native"], "ꯃꯤꯇꯩꯂꯣꯟ")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_bhashini_tts_synthesis_endpoint(self):
        """Tests POST /api/v1/voice/bhashini/tts with Assamese and Meitei text."""
        # 1. Assamese prompt
        as_payload = {
            "language": "as",
            "text": "নমস্কাৰ আইতা, আজি আপোনাৰ গাটো কেনে আছে?",
            "gender": "female",
        }
        resp = client.post("/api/v1/voice/bhashini/tts", json=as_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertEqual(data["language"], "as")
        self.assertGreater(len(data["audio_content_base64"]), 20)
        self.assertLess(data["latency_ms"], 50.0)

        # 2. Meitei prompt
        mni_payload = {
            "language": "mni",
            "text": "ꯈꯨꯔꯨꯝꯖꯔꯤ ꯏꯃꯥ, ꯉꯁꯤ ꯅꯨꯡꯉꯥꯏꯕ꯭ꯔꯥ?",
            "gender": "female",
        }
        resp_mni = client.post("/api/v1/voice/bhashini/tts", json=mni_payload)
        self.assertEqual(resp_mni.status_code, 200)
        self.assertEqual(resp_mni.json()["language"], "mni")

        # 3. Invalid language code rejected
        bad_payload = {"language": "fr", "text": "Bonjour"}
        resp_bad = client.post("/api/v1/voice/bhashini/tts", json=bad_payload)
        self.assertEqual(resp_bad.status_code, 400)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_bhashini_asr_keyword_spotting(self):
        """Tests low-latency keyword spotting for HELP, REPEAT, YES, NEXT across regional scripts."""
        test_cases = [
            # Assamese HELP
            {"transcript": "অনুগ্ৰহ কৰি মোক সহায় কৰক", "pref": "as", "expected_intent": "HELP"},
            # Meitei HELP (Meitei Mayek)
            {"transcript": "ꯑꯩꯉꯣꯟꯗ ꯃꯇꯦꯡ ꯄꯥꯡꯕꯤꯌꯨ", "pref": "mni", "expected_intent": "HELP"},
            # Bengali REPEAT
            {"transcript": "দয়া করে আবার বলুন", "pref": "bn", "expected_intent": "REPEAT"},
            # Khasi HELP
            {"transcript": "sngewbha iar ia nga", "pref": "kha", "expected_intent": "HELP"},
            # Mizo YES
            {"transcript": "aw ni e ka hria e", "pref": "lus", "expected_intent": "YES"},
            # Hindi HELP
            {"transcript": "कृपया मेरी मदद कीजिए", "pref": "hi", "expected_intent": "HELP"},
            # English NEXT
            {"transcript": "okay proceed to next round", "pref": "en", "expected_intent": "NEXT"},
        ]

        for case in test_cases:
            payload = {
                "transcript": case["transcript"],
                "preferred_language": case["pref"],
            }
            resp = client.post("/api/v1/voice/bhashini/asr/spot", json=payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertTrue(data["matched"], f"Failed to match keyword in: {case['transcript']}")
            self.assertEqual(data["intent"], case["expected_intent"])
            # Validate low-latency benchmark: <500 ms (actually <15 ms in memory)
            self.assertLess(data["latency_ms"], 500.0)

        # Non-matching conversational statement
        unrelated = {"transcript": "কাইলৈ পুৱা মই বজাৰলৈ যাম", "preferred_language": "as"}
        resp_unrelated = client.post("/api/v1/voice/bhashini/asr/spot", json=unrelated)
        self.assertEqual(resp_unrelated.status_code, 200)
        self.assertFalse(resp_unrelated.json()["matched"])


if __name__ == "__main__":
    unittest.main()
