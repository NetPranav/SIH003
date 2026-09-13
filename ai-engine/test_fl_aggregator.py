"""
Unit tests for Smriti-NER Federated Learning Aggregation Engine
Sub-Phase 3.5: Federated Learning Infrastructure Groundwork
"""

import unittest
import os
import sys
import math

# Ensure module import works
sys.path.insert(0, os.path.dirname(__file__))

from fl_aggregator import (
    FederatedModelWeights,
    ZeroRawDataValidator,
    DifferentialPrivacyEngine,
    ByzantineDefense,
    FederatedAggregationServer,
)


class TestFederatedLearning(unittest.TestCase):

    def setUp(self):
        self.server = FederatedAggregationServer(
            initial_weights=FederatedModelWeights(
                p_init=0.50, p_transit=0.15, p_slip=0.12, p_guess=0.20,
                w_rt=0.35, w_acc=0.45, w_tremor=0.20
            ),
            dp_clip_norm=1.0,
            dp_noise_sigma=0.05,
        )
        self.server.register_client("node_majuli", "Majuli", "Assam")
        self.server.register_client("node_mon", "Mon", "Nagaland")
        self.server.register_client("node_churachandpur", "Churachandpur", "Manipur")

    def test_zero_raw_data_enforcement(self):
        """Validates DISHA 2018 Section 34 gatekeeper blocks raw clinical telemetry."""
        valid_payload = {
            "client_id": "node_majuli",
            "round_id": 1,
            "sample_count": 50,
            "weight_deltas": {
                "p_init": 0.02,
                "p_transit": 0.01,
                "p_slip": -0.01,
                "p_guess": 0.00,
                "w_rt": 0.03,
                "w_acc": 0.02,
                "w_tremor": -0.01,
            }
        }
        # Should not raise
        ZeroRawDataValidator.validate_payload(valid_payload)

        # Prohibited raw telemetry leaks
        prohibited_cases = [
            {"reaction_time_ms": 1420.5},
            {"patient_name": "Bhaben Hazarika"},
            {"phone": "+919435012345"},
            {"touch_x": 420.5, "touch_y": 810.2},
            {"audio_wav": "BASE64_RAW_PCM_STREAM"},
            {"speech_tokens": ["বতাহ", "নদী"]},
        ]

        for leak in prohibited_cases:
            bad_payload = dict(valid_payload)
            bad_payload.update(leak)
            with self.assertRaises(ValueError, msg=f"Should reject leak: {leak}"):
                ZeroRawDataValidator.validate_payload(bad_payload)

    def test_fedavg_mathematical_aggregation(self):
        """Verifies weighted averaging calculation of FedAvg."""
        # Client 1: 100 samples, delta p_init = +0.10
        self.server.submit_gradient_update({
            "client_id": "node_majuli",
            "round_id": 1,
            "sample_count": 100,
            "weight_deltas": {k: 0.10 for k in FederatedModelWeights.PARAM_NAMES}
        })
        # Client 2: 300 samples, delta p_init = +0.02
        self.server.submit_gradient_update({
            "client_id": "node_mon",
            "round_id": 1,
            "sample_count": 300,
            "weight_deltas": {k: 0.02 for k in FederatedModelWeights.PARAM_NAMES}
        })

        # Expected weighted delta: (100*0.10 + 300*0.02) / 400 = (10 + 6) / 400 = 0.04
        summary = self.server.aggregate_round(strategy="fedavg")
        self.assertEqual(summary["round_id"], 1)
        self.assertEqual(summary["total_samples"], 400)
        self.assertEqual(summary["participating_clients"], 2)
        self.assertAlmostEqual(summary["average_deltas"]["p_init"], 0.04, places=4)
        self.assertAlmostEqual(self.server.global_weights.p_init, 0.50 + 0.04, places=4)

    def test_fedprox_proximal_regularization(self):
        """Verifies FedProx regularization scales gradients under non-IID data."""
        self.server.submit_gradient_update({
            "client_id": "node_majuli",
            "round_id": 1,
            "sample_count": 100,
            "weight_deltas": {"p_init": 0.10, "p_transit": 0.0, "p_slip": 0.0, "p_guess": 0.0, "w_rt": 0.0, "w_acc": 0.0, "w_tremor": 0.0}
        })
        mu = 0.25
        # Proximal factor: 1 / (1 + 0.25) = 0.80 -> 0.10 * 0.80 = 0.08
        summary = self.server.aggregate_round(strategy="fedprox", fedprox_mu=mu)
        self.assertAlmostEqual(summary["average_deltas"]["p_init"], 0.08, places=4)

    def test_differential_privacy_engine(self):
        """Verifies L2 clipping, Gaussian noise perturbation, and epsilon bound calculation."""
        dp = DifferentialPrivacyEngine(clip_norm=1.0, noise_sigma=0.05, delta=1e-5)
        # Vector with norm > 1.0 (e.g. 2.0)
        unclipped = {"p_init": 1.2, "w_rt": 1.6}  # L2 = sqrt(1.44 + 2.56) = 2.0
        clipped = dp.clip(unclipped)
        clipped_norm = math.sqrt(sum(v ** 2 for v in clipped.values()))
        self.assertAlmostEqual(clipped_norm, 1.0, places=4)

        # Noise addition
        noisy = dp.add_noise({"p_init": 0.50}, num_clients=10, seed=42)
        self.assertIn("p_init", noisy)
        self.assertNotEqual(noisy["p_init"], 0.50)  # Noise was injected
        self.assertTrue(abs(noisy["p_init"] - 0.50) < 0.15)  # Within reasonable bounds

        # Privacy epsilon computation
        eps = dp.calculate_epsilon(rounds=10, num_clients=25)
        self.assertGreater(eps, 0.0)
        self.assertLess(eps, 5.0)

    def test_byzantine_poisoning_defense(self):
        """Verifies malicious or corrupt high-magnitude updates are filtered out."""
        # 3 benign clients with subtle deltas
        updates = [
            {"client_id": "c1", "weight_deltas": {k: 0.02 for k in FederatedModelWeights.PARAM_NAMES}},
            {"client_id": "c2", "weight_deltas": {k: 0.03 for k in FederatedModelWeights.PARAM_NAMES}},
            {"client_id": "c3", "weight_deltas": {k: 0.01 for k in FederatedModelWeights.PARAM_NAMES}},
            # 1 malicious client poisoning with 100x norm
            {"client_id": "bad_actor", "weight_deltas": {k: 5.0 for k in FederatedModelWeights.PARAM_NAMES}},
        ]
        valid, rejected = ByzantineDefense.filter_poisoned_updates(updates, max_norm_multiplier=3.0)
        self.assertEqual(len(valid), 3)
        self.assertIn("bad_actor", rejected)

    def test_straggler_asynchronous_caching(self):
        """Verifies late updates from offline rural villages are cached and integrated."""
        # Advance server to round 2
        self.server.submit_gradient_update({
            "client_id": "node_majuli",
            "round_id": 1,
            "sample_count": 50,
            "weight_deltas": {k: 0.02 for k in FederatedModelWeights.PARAM_NAMES}
        })
        self.server.aggregate_round(strategy="fedavg")
        self.assertEqual(self.server.current_round, 2)

        # Late update arriving for round 1 from remote Mon village
        res = self.server.submit_gradient_update({
            "client_id": "node_mon",
            "round_id": 1,
            "sample_count": 100,
            "weight_deltas": {k: 0.05 for k in FederatedModelWeights.PARAM_NAMES}
        })
        self.assertEqual(res["status"], "cached_as_straggler")
        self.assertEqual(len(self.server.straggler_cache), 1)

        # Now run round 2 with a new active update
        self.server.submit_gradient_update({
            "client_id": "node_churachandpur",
            "round_id": 2,
            "sample_count": 80,
            "weight_deltas": {k: 0.01 for k in FederatedModelWeights.PARAM_NAMES}
        })
        round_2_summary = self.server.aggregate_round(strategy="fedavg")
        self.assertEqual(round_2_summary["stragglers_integrated"], 1)
        self.assertEqual(len(self.server.straggler_cache), 0)


if __name__ == "__main__":
    unittest.main()
