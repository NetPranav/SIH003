"""
Smriti-NER (স্মৃতি) — Sub-Phase 6.2: Localization Framework & Script Rendering Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates 8-Language Key Parity, Meitei Mayek/Eastern Nagari Unicode Orthography, and Kinship Matrix.
"""

import unittest
import json
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOCALES_DIR = os.path.join(ROOT_DIR, "smriti-ner", "src", "locales")


class TestLocalizationFramework(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.languages = ["as", "mni", "bn", "brx", "kha", "lus", "hi", "en"]
        cls.catalogs = {}
        for lang in cls.languages:
            filepath = os.path.join(LOCALES_DIR, f"{lang}.json")
            if not os.path.exists(filepath):
                raise FileNotFoundError(f"Missing required locale file: {filepath}")
            with open(filepath, "r", encoding="utf-8") as f:
                cls.catalogs[lang] = json.load(f)

    def test_all_8_locale_files_exist_and_parse(self):
        """Validates all 8 locale JSON files exist and contain valid JSON."""
        self.assertEqual(len(self.catalogs), 8)
        for lang in self.languages:
            self.assertIn(lang, self.catalogs)
            self.assertIsInstance(self.catalogs[lang], dict)

    def _extract_all_leaf_keys(self, d: dict, prefix: str = "") -> set:
        keys = set()
        for k, v in d.items():
            curr = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.update(self._extract_all_leaf_keys(v, curr))
            else:
                keys.add(curr)
        return keys

    def test_100_percent_key_parity_across_languages(self):
        """Verifies 100% key parity across all 8 language catalogs (0 missing keys)."""
        en_keys = self._extract_all_leaf_keys(self.catalogs["en"])
        self.assertGreater(len(en_keys), 20)

        for lang in self.languages:
            lang_keys = self._extract_all_leaf_keys(self.catalogs[lang])
            missing = en_keys - lang_keys
            self.assertEqual(
                len(missing),
                0,
                f"Language '{lang}' is missing {len(missing)} keys from baseline: {missing}",
            )
            extra = lang_keys - en_keys
            self.assertEqual(
                len(extra),
                0,
                f"Language '{lang}' has extra keys not in baseline: {extra}",
            )

    def test_meitei_mayek_unicode_script_rendering(self):
        """Validates Meitei (mni.json) contains valid Meitei Mayek Unicode characters (U+ABC0 - U+ABFF)."""
        mni = self.catalogs["mni"]
        meitei_text = mni["games"]["dhol_pepa"]["title"] + mni["common"]["help"] + mni["honorifics"]["grandmother"]
        has_meitei_mayek = any(0xABC0 <= ord(c) <= 0xABFF for c in meitei_text)
        self.assertTrue(has_meitei_mayek, "Meitei catalog does not contain Meitei Mayek Unicode characters.")
        self.assertIn("ꯃꯇꯦꯡ", mni["common"]["help"])
        self.assertIn("ꯏꯕꯦꯟ", mni["honorifics"]["grandmother"])

    def test_assamese_eastern_nagari_orthography(self):
        """Validates Assamese (as.json) uses authentic Assamese Ra (ৰ) and Va (ৱ)."""
        as_text = json.dumps(self.catalogs["as"], ensure_ascii=False)
        # Assamese specific characters: ৰ (U+09F0) or ৱ (U+09F1)
        has_assamese_ra_va = any(c in as_text for c in ["ৰ", "ৱ"])
        self.assertTrue(has_assamese_ra_va, "Assamese catalog missing authentic 'ৰ' / 'ৱ' orthography.")
        self.assertIn("আইতা", self.catalogs["as"]["honorifics"]["grandmother"])
        self.assertIn("ককা", self.catalogs["as"]["honorifics"]["grandfather"])

    def test_cultural_kinship_honorific_matrix_all_languages(self):
        """Verifies grandmother, grandfather, and elder honorifics across all 8 cultures."""
        expected_kinship = {
            "as": {"grandmother": "আইতা", "grandfather": "ককা"},
            "mni": {"grandmother": "ꯏꯕꯦꯟ", "grandfather": "ꯏꯄꯨ"},
            "bn": {"grandmother": "দিদিমা / ঠাকুমা", "grandfather": "দাদু"},
            "brx": {"grandmother": "आबौ", "grandfather": "आबौ"},
            "kha": {"grandmother": "Ka Iawbei / Ka Mei-rad", "grandfather": "U Thawlang / U Pa-rad"},
            "lus": {"grandmother": "Ka Pi", "grandfather": "Ka Pu"},
            "hi": {"grandmother": "दादीजी / नानीजी", "grandfather": "दादाजी / नानाजी"},
            "en": {"grandmother": "Grandmother", "grandfather": "Grandfather"},
        }

        for lang, expected in expected_kinship.items():
            cat = self.catalogs[lang]["honorifics"]
            self.assertEqual(cat["grandmother"], expected["grandmother"])
            self.assertEqual(cat["grandfather"], expected["grandfather"])

    def test_dynamic_interpolation_formatting(self):
        """Verifies template parameters {name} and {kinship} in greeting string."""
        for lang in self.languages:
            greeting_template = self.catalogs[lang]["home"]["greeting"]
            self.assertIn("{name}", greeting_template)
            self.assertIn("{kinship}", greeting_template)

            # Test simulated interpolation
            interpolated = greeting_template.replace("{name}", "Dipali").replace("{kinship}", "Aita")
            self.assertIn("Dipali", interpolated)
            self.assertIn("Aita", interpolated)
            self.assertNotIn("{name}", interpolated)
            self.assertNotIn("{kinship}", interpolated)


if __name__ == "__main__":
    unittest.main()
