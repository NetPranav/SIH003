"""
Unit tests for Gemini AI Voice & Text-to-Text Companion Endpoint
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestAICompanion(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_ai_companion_location_query(self):
        """Test elder asking where they are in Hindi and receiving calming reassurance."""
        payload = {"prompt": "मैं अभी कहाँ हूँ?", "language": "hi"}
        response = self.client.post("/api/v1/ai/companion", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("घर", data["reply_text"])
        self.assertIn("safe", data["english_translation"].lower())
        self.assertEqual(data["language"], "hi")
        self.assertEqual(data["emotion_tone"], "CALMING")
        self.assertEqual(data["suggested_screen"], "home")

    def test_ai_companion_medicine_query(self):
        """Test elder asking about medicine in Bengali."""
        payload = {"prompt": "আমার পরের ওষুধ কখন?", "language": "bn"}
        response = self.client.post("/api/v1/ai/companion", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("ওষুধ", data["reply_text"])
        self.assertEqual(data["language"], "bn")
        self.assertEqual(data["suggested_screen"], "reminders")

    def test_ai_companion_story_query(self):
        """Test elder asking for a story in Assamese."""
        payload = {"prompt": "মোক এটি ধুনীয়া সাধু কওক", "language": "as"}
        response = self.client.post("/api/v1/ai/companion", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("বিহু", data["reply_text"])
        self.assertEqual(data["language"], "as")
        self.assertEqual(data["suggested_screen"], "album")

    def test_ai_companion_sample_prompts(self):
        """Test fetching sample prompts for multiple languages."""
        for lang in ["hi", "bn", "as", "en"]:
            response = self.client.get(f"/api/v1/ai/companion/sample-prompts?language={lang}")
            self.assertEqual(response.status_code, 200)
            prompts = response.json()
            self.assertEqual(len(prompts), 4)
            categories = [p["category"] for p in prompts]
            self.assertIn("Location", categories)
            self.assertIn("Medicine", categories)
            self.assertIn("Story", categories)
            self.assertIn("Comfort", categories)


if __name__ == "__main__":
    unittest.main()
