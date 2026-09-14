"""
Smriti-NER (স্মৃতি) — Sub-Phase 8.3: Multilingual IVR Content Library Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates 8-language IVR script bundles, 1-press DTMF dial code mapping,
persistent caller dialect memory, and regional telecom circle fallbacks.
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
        IVR_CALLER_PROFILES_STORE,
        IVR_MENU_OPTIONS,
        IVR_SCRIPT_BUNDLES,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestIvrMultilingualContent(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            IVR_CALLER_PROFILES_STORE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_get_ivr_language_menu(self):
        """Validates all 8 regional language menu options with DTMF dial codes 1-8."""
        resp = client.get("/api/v1/ivr/content/languages")
        self.assertEqual(resp.status_code, 200)
        options = resp.json()
        self.assertEqual(len(options), 8)

        # Verify digit ordering and language codes
        expected_digits = ["1", "2", "3", "4", "5", "6", "7", "8"]
        expected_codes = ["as", "bn", "mni", "brx", "kha", "lus", "hi", "en"]
        self.assertEqual([opt["digit"] for opt in options], expected_digits)
        self.assertEqual([opt["code"] for opt in options], expected_codes)

        # Check Assamese option
        as_opt = next(opt for opt in options if opt["code"] == "as")
        self.assertEqual(as_opt["native_name"], "অসমীয়া")
        self.assertEqual(as_opt["telecom_circle"], "Assam")

        # Check Meitei option
        mni_opt = next(opt for opt in options if opt["code"] == "mni")
        self.assertEqual(mni_opt["native_name"], "ꯃꯤꯇꯩꯂꯣꯟ")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_get_all_script_bundles(self):
        """Validates that all 8 languages provide complete 7-prompt script bundles."""
        for code in ["as", "bn", "mni", "brx", "kha", "lus", "hi", "en"]:
            resp = client.get(f"/api/v1/ivr/content/scripts/{code}")
            self.assertEqual(resp.status_code, 200, f"Failed for language code {code}")
            bundle = resp.json()
            self.assertEqual(bundle["language"], code)
            self.assertTrue(len(bundle["welcome"]) > 0)
            self.assertTrue(len(bundle["circadian_reassurance"]) > 0)
            self.assertTrue(len(bundle["orientation_question"]) > 0)
            self.assertTrue(len(bundle["recall_presentation"]) > 0)
            self.assertTrue(len(bundle["recall_retrieval"]) > 0)
            self.assertTrue(len(bundle["adherence_check"]) > 0)
            self.assertTrue(len(bundle["goodbye_closure"]) > 0)

        # Invalid language 404 test
        resp_invalid = client.get("/api/v1/ivr/content/scripts/invalid_lang")
        self.assertEqual(resp_invalid.status_code, 404)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_dtmf_digit_selection_and_persistence(self):
        """Tests selecting a dialect via DTMF digit and persistent caller profile reuse."""
        phone = "9864099881"

        # 1. Caller presses digit 3 for Meitei
        select_resp = client.post("/api/v1/ivr/content/select-language", json={
            "phone_number": phone,
            "digit": "3",
        })
        self.assertEqual(select_resp.status_code, 200)
        data = select_resp.json()
        self.assertEqual(data["language"], "mni")
        self.assertEqual(data["resolution_source"], "DTMF_DIGIT")
        self.assertEqual(data["script_bundle"]["language"], "mni")
        self.assertIn("ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯆꯔꯤ", data["script_bundle"]["welcome"])

        # 2. Subsequent call without digit automatically uses saved profile
        subsequent_resp = client.post("/api/v1/ivr/content/select-language", json={
            "phone_number": phone,
        })
        self.assertEqual(subsequent_resp.status_code, 200)
        sub_data = subsequent_resp.json()
        self.assertEqual(sub_data["language"], "mni")
        self.assertEqual(sub_data["resolution_source"], "SAVED_PROFILE")

        # 3. Direct profile lookup endpoint
        profile_resp = client.get(f"/api/v1/ivr/content/caller-profile/{phone}")
        self.assertEqual(profile_resp.status_code, 200)
        self.assertEqual(profile_resp.json()["language"], "mni")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_telecom_circle_fallbacks(self):
        """Tests fallback resolution when first-time caller dials with circle metadata."""
        # Meghalaya -> Khasi
        khasi_resp = client.post("/api/v1/ivr/content/select-language", json={
            "phone_number": "9862012345",
            "telecom_circle": "Meghalaya (NE-I)",
        })
        self.assertEqual(khasi_resp.json()["language"], "kha")
        self.assertEqual(khasi_resp.json()["resolution_source"], "TELECOM_CIRCLE")

        # Tripura -> Bengali
        tripura_resp = client.post("/api/v1/ivr/content/select-language", json={
            "phone_number": "9863012345",
            "telecom_circle": "Tripura Circle",
        })
        self.assertEqual(tripura_resp.json()["language"], "bn")

        # Mizoram -> Mizo
        mizo_resp = client.post("/api/v1/ivr/content/select-language", json={
            "phone_number": "9861012345",
            "telecom_circle": "Mizoram",
        })
        self.assertEqual(mizo_resp.json()["language"], "lus")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_default_fallback_assamese(self):
        """Tests unprofiled caller with no digit and unknown circle defaults to Assamese."""
        resp = client.post("/api/v1/ivr/content/select-language", json={
            "phone_number": "9999900000",
        })
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["language"], "as")
        self.assertEqual(resp.json()["resolution_source"], "DEFAULT")


if __name__ == "__main__":
    unittest.main()
