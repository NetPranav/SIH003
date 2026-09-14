"""
Smriti-NER (স্মৃতি) — Sub-Phase 6.4: Deterministic NLG Caregiver Summary Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates 8-language zero-hallucination weekly clinical progress summaries,
4 cognitive status trajectories, and contextual lifestyle correlation patterns.
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
        SUPPORTED_VOICE_LANGUAGES,
        NLG_HEADLINES,
        NLG_COGNITIVE_TEMPLATES,
        NLG_ADHERENCE_TEMPLATES,
        NLG_CORRELATION_HINTS,
        NLG_ACTION_ITEMS,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestCaregiverNlgEngine(unittest.TestCase):

    def test_nlg_catalogs_completeness(self):
        """Validates that all NLG template dictionaries have 100% key parity across 8 languages."""
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]
        statuses = ["POSITIVE", "STABLE", "MILD_VARIATION", "NEEDS_REVIEW"]
        patterns = ["TUESDAY_HAAT_DIP", "SUNDAY_PRAYER_BOOST", "WINTER_DUSK_AGITATION", "MISSED_DOSE_TREMOR", "NONE"]

        # Headlines
        for status in statuses:
            self.assertIn(status, NLG_HEADLINES)
            for lang in expected_languages:
                self.assertIn(lang, NLG_HEADLINES[status], f"Missing {lang} headline for {status}")

        # Cognitive templates
        for lang in expected_languages:
            self.assertIn(lang, NLG_COGNITIVE_TEMPLATES)

        # Adherence templates
        for lang in expected_languages:
            self.assertIn(lang, NLG_ADHERENCE_TEMPLATES)

        # Correlation hints
        for pattern in patterns:
            self.assertIn(pattern, NLG_CORRELATION_HINTS)
            for lang in expected_languages:
                self.assertIn(lang, NLG_CORRELATION_HINTS[pattern], f"Missing {lang} hint for {pattern}")

        # Action items
        for action_key in ["low_adherence", "normal_adherence"]:
            self.assertIn(action_key, NLG_ACTION_ITEMS)
            for lang in expected_languages:
                self.assertIn(lang, NLG_ACTION_ITEMS[action_key], f"Missing {lang} action for {action_key}")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_all_8_languages_endpoint_generation(self):
        """Tests that the caregiver weekly summary endpoint responds successfully for all 8 languages."""
        expected_languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]

        for lang in expected_languages:
            payload = {
                "patient_name": "আইতা",
                "kinship_title": "আইতা",
                "language": lang,
                "current_mmse_proxy": 25.4,
                "mmse_delta_7d": 0.6,
                "avg_reaction_time_ms": 1100.0,
                "adherence_rate_percent": 90.0,
                "sundowning_incidents_count": 0,
                "notable_day_pattern": "NONE",
            }
            resp = client.post("/api/v1/caregiver/weekly-summary", json=payload)
            self.assertEqual(resp.status_code, 200, f"Failed for language: {lang}")
            data = resp.json()

            self.assertEqual(data["language"], lang)
            self.assertEqual(data["status_category"], "STABLE")
            self.assertTrue(len(data["headline"]) > 0)
            self.assertTrue(len(data["cognitive_paragraph"]) > 0)
            self.assertTrue(len(data["adherence_paragraph"]) > 0)
            self.assertTrue(len(data["correlation_hint_paragraph"]) > 0)
            self.assertTrue(len(data["action_item"]) > 0)
            self.assertIn("📌", data["full_summary_text"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_4_cognitive_status_classifications(self):
        """Verifies mathematical threshold classification for delta MMSE."""
        cases = [
            (1.5, "POSITIVE"),
            (0.0, "STABLE"),
            (-0.8, "MILD_VARIATION"),
            (-2.2, "NEEDS_REVIEW"),
        ]

        for delta, expected_status in cases:
            payload = {
                "language": "en",
                "kinship_title": "Grandmother",
                "current_mmse_proxy": 24.0,
                "mmse_delta_7d": delta,
                "adherence_rate_percent": 85.0,
                "sundowning_incidents_count": 1,
            }
            resp = client.post("/api/v1/caregiver/weekly-summary", json=payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["status_category"], expected_status, f"Mismatch for delta={delta}")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_lifestyle_correlation_hints_injected(self):
        """Verifies lifestyle pattern contextualization into summaries."""
        patterns = [
            ("TUESDAY_HAAT_DIP", "market"),
            ("SUNDAY_PRAYER_BOOST", "prayer"),
            ("WINTER_DUSK_AGITATION", "twilight dusk"),
            ("MISSED_DOSE_TREMOR", "pill organizer"),
        ]

        for pattern, keyword in patterns:
            payload = {
                "language": "en",
                "kinship_title": "Grandmother",
                "current_mmse_proxy": 23.0,
                "mmse_delta_7d": 0.0,
                "adherence_rate_percent": 85.0,
                "sundowning_incidents_count": 1,
                "notable_day_pattern": pattern,
            }
            resp = client.post("/api/v1/caregiver/weekly-summary", json=payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertIn(keyword.lower(), data["correlation_hint_paragraph"].lower())

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_adherence_threshold_action_item(self):
        """Tests that adherence < 80% recommends voice reminders, while >= 80% recommends evening reminiscence."""
        # Low adherence (< 80%)
        low_resp = client.post("/api/v1/caregiver/weekly-summary", json={
            "language": "en",
            "kinship_title": "Grandmother",
            "current_mmse_proxy": 22.0,
            "mmse_delta_7d": 0.0,
            "adherence_rate_percent": 65.0,
            "sundowning_incidents_count": 2,
        })
        self.assertEqual(low_resp.status_code, 200)
        self.assertIn("voice prompts", low_resp.json()["action_item"].lower())

        # Optimal adherence (>= 80%)
        high_resp = client.post("/api/v1/caregiver/weekly-summary", json={
            "language": "en",
            "kinship_title": "Grandmother",
            "current_mmse_proxy": 24.0,
            "mmse_delta_7d": 0.0,
            "adherence_rate_percent": 95.0,
            "sundowning_incidents_count": 0,
        })
        self.assertEqual(high_resp.status_code, 200)
        self.assertIn("reminiscing", high_resp.json()["action_item"].lower())


if __name__ == "__main__":
    unittest.main()
