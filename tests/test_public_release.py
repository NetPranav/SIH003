"""
Unit tests for Sub-Phase 19.1: Pan-NER Public Release (Play Store, PWA, IVR)
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestPublicRelease(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_play_store_listings(self):
        """Test Google Play Store metadata and regional listings in all 8 NER languages."""
        response = self.client.get("/api/v1/release/play-store-listings")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Metadata validation
        self.assertEqual(data["package_name"], "org.smriti.ner.app")
        self.assertEqual(data["version_name"], "2.4.0")
        self.assertEqual(data["version_code"], 24000)
        self.assertEqual(data["min_sdk_version"], 21)
        self.assertEqual(data["target_sdk_version"], 34)
        self.assertEqual(data["download_size_mb"], 18.4)
        self.assertIn("PEGI 3", data["content_rating"])

        # Regional listings validation
        listings = data["listings"]
        self.assertEqual(len(listings), 8)
        lang_codes = [item["language_code"] for item in listings]
        expected_langs = ["as", "bn", "brx", "mni", "lus", "kha", "grt", "en"]
        self.assertEqual(sorted(lang_codes), sorted(expected_langs))

        for item in listings:
            self.assertTrue(len(item["title"]) > 0)
            self.assertTrue(len(item["short_description"]) <= 80, f"Short description too long for {item['language_code']}")
            self.assertTrue(len(item["long_description"]) > 50)
            self.assertTrue(len(item["keywords"]) >= 4)

    def test_pwa_config(self):
        """Test Progressive Web App (PWA) production manifest and security headers."""
        response = self.client.get("/api/v1/release/pwa-config")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["production_domain"], "https://smriti.ner.gov.in")
        self.assertEqual(data["display"], "standalone")
        self.assertEqual(data["theme_color"], "#0F172A")
        self.assertEqual(data["background_color"], "#FFFFFF")
        self.assertIn("CacheFirst", data["offline_caching_strategy"])
        self.assertIn("max-age=63072000", data["hsts_header"])
        self.assertIn("default-src 'self'", data["csp_header"])
        self.assertEqual(data["lighthouse_pwa_target"], 100)

    def test_ivr_public_gateway(self):
        """Test public toll-free IVR line configuration and dual-carrier redundancy."""
        response = self.client.get("/api/v1/release/ivr-public-gateway")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["toll_free_number"], "1800-890-SMRITI")
        self.assertEqual(data["dialable_number"], "1800890767484")
        self.assertEqual(data["total_channels"], 90)
        self.assertEqual(data["concurrency_limit"], 90)
        self.assertEqual(data["failover_latency_target_ms"], 120)

        # Carrier validation
        carriers = data["carriers"]
        self.assertEqual(len(carriers), 2)
        primary = next(c for c in carriers if c["role"] == "PRIMARY")
        secondary = next(c for c in carriers if c["role"] == "SECONDARY_DR")
        self.assertEqual(primary["carrier"], "BSNL Guwahati Circle")
        self.assertEqual(primary["channels"], 30)
        self.assertEqual(secondary["carrier"], "Jio Infocomm Northeast SIP")
        self.assertEqual(secondary["channels"], 60)

        # Language DTMF mapping
        supported = data["supported_languages"]
        self.assertEqual(len(supported), 8)
        dtmf_keys = [s["dtmf_key"] for s in supported]
        self.assertEqual(sorted(dtmf_keys), list(range(1, 9)))

    def test_public_release_summary(self):
        """Test public release status summary endpoint."""
        response = self.client.get("/api/v1/release/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("19.1", data["sub_phase"])
        self.assertEqual(data["play_store_status"], "READY_FOR_PUBLICATION")
        self.assertEqual(data["play_store_languages_count"], 8)
        self.assertEqual(data["pwa_status"], "LIVE_PRODUCTION")
        self.assertEqual(data["pwa_production_url"], "https://smriti.ner.gov.in")
        self.assertEqual(data["ivr_status"], "ACTIVE_TELEPHONY")
        self.assertEqual(data["ivr_toll_free_number"], "1800-890-SMRITI")
        self.assertEqual(data["ivr_total_channels"], 90)


if __name__ == "__main__":
    unittest.main()
