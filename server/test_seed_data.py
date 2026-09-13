"""
Unit Tests for Synthetic Staging Data Generator
SIH 2026 Problem Statement ID: 26003 | MDoNER
"""

import unittest
from server.seed_staging_data import generate_staging_dataset, generate_pseudo_id, NER_STATES

class TestSyntheticDataGenerator(unittest.TestCase):
    def test_pseudo_id_format(self):
        """Verify pseudo identifiers are 64-char hexadecimal SHA-256 strings."""
        pseudo_id = generate_pseudo_id("Assam", 1)
        self.assertEqual(len(pseudo_id), 64)
        self.assertTrue(all(c in "0123456789abcdef" for c in pseudo_id))

    def test_all_ner_states_represented(self):
        """Verify all 8 NER states are represented in generated staging dataset."""
        dataset = generate_staging_dataset(patient_count=16, history_days=7)
        states_found = set(p["cluster_state"] for p in dataset["patients"])
        expected_states = set(s["state"] for s in NER_STATES)
        self.assertEqual(states_found, expected_states)

    def test_longitudinal_continuity(self):
        """Verify 7 days of telemetry generation produces valid MMSE checkpoints."""
        dataset = generate_staging_dataset(patient_count=8, history_days=7)
        self.assertGreater(len(dataset["telemetry_events"]), 0)
        self.assertGreater(len(dataset["mmse_scores"]), 0)
        self.assertEqual(len(dataset["bkt_masteries"]), 8 * 5) # 5 domains per patient

if __name__ == "__main__":
    unittest.main()
