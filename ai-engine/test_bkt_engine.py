"""
Unit tests for Bayesian Knowledge Tracing & DCDA Engine
Standard library unittest implementation for zero-dependency execution
"""

import unittest
from bkt_dcda_engine import BayesianKnowledgeTracing, DCDAEngine


class TestBKTAndDCDA(unittest.TestCase):
    def test_bkt_update_correct(self):
        bkt = BayesianKnowledgeTracing()
        prior = 0.5
        updated = bkt.update(prior, is_correct=True)
        self.assertGreater(updated, prior)

    def test_bkt_update_incorrect(self):
        bkt = BayesianKnowledgeTracing()
        prior = 0.5
        updated = bkt.update(prior, is_correct=False)
        self.assertLess(updated, prior)

    def test_dcda_level_progression(self):
        dcda = DCDAEngine()
        next_lvl, _ = dcda.calculate_next_level(
            current_level=2, p_mastery=0.92, reaction_time_ms=750.0
        )
        self.assertEqual(next_lvl, 3)

        lower_lvl, _ = dcda.calculate_next_level(
            current_level=3, p_mastery=0.25, reaction_time_ms=2500.0
        )
        self.assertEqual(lower_lvl, 2)

    def test_mmse_5_domain_proxy(self):
        dcda = DCDAEngine()
        result = dcda.mmse_5_domain_proxy(
            orientation_score=4.8,
            memory_score=5.5,
            attention_score=5.8,
            executive_score=4.5,
            language_score=3.8,
        )
        self.assertGreaterEqual(result["total_score"], 24.0)
        self.assertEqual(result["clinical_risk"], "Low")
        self.assertIn("orientation", result["domains"])


if __name__ == "__main__":
    unittest.main()
