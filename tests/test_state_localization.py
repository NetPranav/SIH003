"""
Unit tests for Smriti-NER State-Specific Localization (Sub-Phase 16.2)
Validates deep cultural and linguistic assets across all 8 NER states:
Assam, Meghalaya (Khasi), Manipur (Meitei), Tripura, Arunachal Pradesh,
Nagaland, Mizoram (Mizo), and Sikkim.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestStateLocalization(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_all_eight_state_locale_packs(self):
        """Validates all 8 state locale packs are active, complete, and meet compression/comprehension standards."""
        res = client.get("/api/v1/localization/states")
        self.assertEqual(res.status_code, 200)
        packs = res.json()
        self.assertEqual(len(packs), 8)

        state_codes = {p["state_code"] for p in packs}
        self.assertEqual(state_codes, {"AS", "ML", "MN", "TR", "AR", "NL", "MZ", "SK"})

        for p in packs:
            self.assertGreater(len(p["key_festivals"]), 0)
            self.assertGreater(len(p["heritage_fauna"]), 0)
            self.assertGreater(len(p["musical_instruments"]), 0)
            self.assertGreater(len(p["textile_patterns"]), 0)
            self.assertGreater(len(p["folklore_proverbs"]), 0)
            self.assertGreaterEqual(p["elder_comprehension_rate_pct"], 96.0)
            self.assertLessEqual(p["bundle_size_mb"], 25.0)  # Must fit in 25MB offline pack
            self.assertEqual(p["status"], "LOCALIZED_AND_VALIDATED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_deep_localization_khasi(self):
        """Validates Khasi deep localization pack (0.82x cadence, Duitara, Jainsem, high score)."""
        res = client.get("/api/v1/localization/deep-pack/KHASI_DEEP")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["target_domain"], "KHASI_DEEP")
        self.assertEqual(data["language_code"], "kha")
        self.assertIn("0.82x", data["phoneme_adjustment_rule"])
        assets = data["specialized_assets"]
        self.assertTrue(any("Duitara" in inst for inst in assets["instruments"]))
        self.assertTrue(any("Jainsem" in tex for tex in assets["textiles"]))
        self.assertGreaterEqual(data["elder_testing_panel_score_pct"], 97.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_deep_localization_mizo(self):
        """Validates Mizo deep localization pack (circumflex vowels, Chapchar Kut, Cheraw, Puanchei)."""
        res = client.get("/api/v1/localization/deep-pack/MIZO_DEEP")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["target_domain"], "MIZO_DEEP")
        self.assertEqual(data["language_code"], "lus")
        self.assertIn("circumflex", data["phoneme_adjustment_rule"].lower())
        assets = data["specialized_assets"]
        self.assertTrue(any("Chapchar Kut" in f for f in assets["festivals"]))
        self.assertTrue(any("Khuang" in inst for inst in assets["instruments"]))
        self.assertTrue(any("Puanchei" in tex for tex in assets["textiles"]))
        self.assertGreaterEqual(data["elder_testing_panel_score_pct"], 97.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_deep_localization_bodo(self):
        """Validates Bodo optimization pack (Bwisagu, Serja fiddle, Dokhona)."""
        res = client.get("/api/v1/localization/deep-pack/BODO_OPTIMIZATION")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["target_domain"], "BODO_OPTIMIZATION")
        self.assertEqual(data["language_code"], "brx")
        assets = data["specialized_assets"]
        self.assertTrue(any("Bwisagu" in f for f in assets["festivals"]))
        self.assertTrue(any("Serja" in inst for inst in assets["instruments"]))
        self.assertTrue(any("Dokhona" in tex for tex in assets["textiles"]))
        self.assertGreaterEqual(data["elder_testing_panel_score_pct"], 97.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_localization_summary(self):
        """Validates consolidated 8-state localization summary metrics."""
        res = client.get("/api/v1/localization/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["states_localized_count"], 8)
        self.assertEqual(data["deep_localization_packs_count"], 3)
        self.assertGreaterEqual(data["total_festivals_cataloged"], 25)
        self.assertGreaterEqual(data["total_instruments_cataloged"], 25)
        self.assertGreaterEqual(data["total_textiles_cataloged"], 20)
        self.assertGreaterEqual(data["mean_comprehension_score_pct"], 97.0)
        self.assertTrue(data["all_packs_validated"])
        self.assertEqual(data["status"], "LOCALIZATION_COMPLETE_V2")


if __name__ == "__main__":
    unittest.main()
