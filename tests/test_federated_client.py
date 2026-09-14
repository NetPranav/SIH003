"""
Smriti-NER (স্মৃতি) — Sub-Phase 5.4: Federated Learning Layer & Privacy Audit Tests
Problem Statement 26003 | MDoNER & SIH 2026
Enforces DISHA 2018 Section 34 & DPDP Act 2023 zero-raw-data guarantees.
"""

import unittest
import sys
import os
import math
import json

# Insert repository paths
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AI_ENGINE_DIR = os.path.join(ROOT_DIR, "ai-engine")
sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, AI_ENGINE_DIR)

from fl_aggregator import (
    FederatedModelWeights,
    ZeroRawDataValidator,
    DifferentialPrivacyEngine,
    ByzantineDefense,
    FederatedAggregationServer,
)

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestFederatedLearningLayer(unittest.TestCase):

    def setUp(self):
        self.server = FederatedAggregationServer(
            initial_weights=FederatedModelWeights(
                p_init=0.50, p_transit=0.15, p_slip=0.12, p_guess=0.20,
                w_rt=0.35, w_acc=0.45, w_tremor=0.20
            ),
            dp_clip_norm=1.0,
            dp_noise_sigma=0.05,
        )
        self.server.register_client("node-majuli-asha-01", "Majuli", "Assam")
        self.server.register_client("node-mon-relay-02", "Mon", "Nagaland")
        self.server.register_client("node-chura-elder-03", "Churachandpur", "Manipur")

    def test_on_device_parameter_clipping_and_dp(self):
        """Validates that local parameter deltas are strictly clipped to L2 norm <= 1.0."""
        dp = DifferentialPrivacyEngine(clip_norm=1.0, noise_sigma=0.05)
        # Vector with excessive norm: (1.5)^2 + (2.0)^2 = 2.25 + 4.0 = 6.25 -> sqrt = 2.5
        oversized_deltas = {
            "p_init": 1.5,
            "p_transit": 0.0,
            "p_slip": 0.0,
            "p_guess": 0.0,
            "w_rt": 2.0,
            "w_acc": 0.0,
            "w_tremor": 0.0,
        }
        clipped = dp.clip(oversized_deltas)
        clipped_norm = math.sqrt(sum(v ** 2 for v in clipped.values()))
        self.assertAlmostEqual(clipped_norm, 1.0, places=4)
        self.assertAlmostEqual(clipped["p_init"], 1.5 / 2.5, places=4)
        self.assertAlmostEqual(clipped["w_rt"], 2.0 / 2.5, places=4)

        # Vector within norm: sqrt(0.04 + 0.09) = 0.36 <= 1.0
        small_deltas = {"p_init": 0.2, "w_acc": 0.3}
        clipped_small = dp.clip(small_deltas)
        self.assertEqual(clipped_small["p_init"], 0.2)
        self.assertEqual(clipped_small["w_acc"], 0.3)

    def test_disha_2018_statutory_privacy_audit_comprehensive(self):
        """
        Exhaustive penetration test verifying DISHA 2018 Section 34 gatekeeper
        blocks 30+ adversarial attempts to leak raw clinical telemetry or PII.
        """
        valid_payload = {
            "client_id": "node-majuli-asha-01",
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
            },
            "algorithm": "FedAvg",
            "client_metrics": {"loss": 0.14, "epochs": 3},
        }

        # 1. Verify clean payload is admitted
        ZeroRawDataValidator.validate_payload(valid_payload)

        # 2. Comprehensive adversarial leak library (30+ attack vectors)
        leak_vectors = [
            # Biometric & Touch Telemetry Leaks
            {"touch_x": 340.5},
            {"touch_y": 720.1},
            {"tap_coordinates": [[100, 200], [105, 202]]},
            {"reaction_time_ms": 1280.0},
            {"reaction_times": [450, 620, 890]},
            {"tremor_hz": 6.8},
            {"raw_scores": [1, 0, 1, 1]},
            {"timestamps": ["2026-09-14T10:00:00Z"]},
            # Audio & Speech Leaks
            {"audio_wav": "UklGRiQAAABXQVZFZm10IBAAAA..."},
            {"audio_bytes": "0x4A6B7C"},
            {"speech_tokens": ["কাছাৰ", "নমস্কাৰ"]},
            {"transcription": "I am feeling confused today"},
            # Patient PII & Demographics Leaks
            {"name": "Bhaben Baruah"},
            {"patient_name": "Dipali Gogoi"},
            {"phone": "+91-9435012345"},
            {"mobile": "9862000000"},
            {"aadhaar": "1234-5678-9012"},
            {"abha": "14-digit-abha-id"},
            {"address": "Majuli Satra, Kamalabari"},
            {"dob": "1948-04-12"},
            {"birth_year": 1948},
            {"gender": "FEMALE"},
            {"pin": "785104"},
            # Device Hardware & Geo Leaks
            {"device_imei": "860123456789012"},
            {"gps_latitude": 26.9535},
            {"gps_longitude": 94.2144},
            # Nested Object Injection Leaks
            {"nested_clinical": {"reaction_time_ms": 500}},
            {"diagnostics": {"patient_name": "Adversary"}},
            {"deep": {"deeper": {"phone": "9999999999"}}},
            # List Item Leaks
            {"telemetry_list": [{"touch_x": 100}]},
            # Case-variation bypass attempts
            {"PATIENT_NAME": "Upper Case Attack"},
            {"Reaction_Time_Ms": 400.0},
            {"Gps_Latitude": 26.0},
        ]

        blocked_count = 0
        for leak in leak_vectors:
            poisoned = json.loads(json.dumps(valid_payload))
            poisoned.update(leak)
            with self.assertRaises(ValueError, msg=f"Gatekeeper failed to block leak: {leak}"):
                ZeroRawDataValidator.validate_payload(poisoned)
            blocked_count += 1

        self.assertEqual(blocked_count, len(leak_vectors))

    def test_byzantine_defense_outlier_rejection(self):
        """Verifies that Byzantine poisoning updates (>3.5x median norm) are rejected."""
        normal_updates = [
            {
                "client_id": f"node-{i}",
                "weight_deltas": {k: 0.05 for k in FederatedModelWeights.PARAM_NAMES},
            }
            for i in range(5)
        ]
        # Poisoned update with huge norm
        poisoned_update = {
            "client_id": "malicious-node-666",
            "weight_deltas": {k: 5.0 for k in FederatedModelWeights.PARAM_NAMES},
        }

        updates = normal_updates + [poisoned_update]
        valid, rejected = ByzantineDefense.filter_poisoned_updates(updates, max_norm_multiplier=3.5)

        self.assertEqual(len(valid), 5)
        self.assertIn("malicious-node-666", rejected)

    def test_end_to_end_fedavg_aggregation_flow(self):
        """Verifies multi-client federated training round, weighted aggregation, and global update."""
        # Majuli node: 120 samples, delta +0.08
        self.server.submit_gradient_update({
            "client_id": "node-majuli-asha-01",
            "round_id": 1,
            "sample_count": 120,
            "weight_deltas": {k: 0.08 for k in FederatedModelWeights.PARAM_NAMES},
        })
        # Mon node: 80 samples, delta -0.02
        self.server.submit_gradient_update({
            "client_id": "node-mon-relay-02",
            "round_id": 1,
            "sample_count": 80,
            "weight_deltas": {k: -0.02 for k in FederatedModelWeights.PARAM_NAMES},
        })

        # Expected weighted delta = (120*0.08 + 80*-0.02) / 200 = (9.6 - 1.6) / 200 = 8.0 / 200 = 0.04
        summary = self.server.aggregate_round(strategy="fedavg")
        self.assertEqual(summary["round_id"], 1)
        self.assertEqual(summary["total_samples"], 200)
        self.assertEqual(summary["participating_clients"], 2)
        self.assertAlmostEqual(summary["average_deltas"]["p_init"], 0.04, places=3)
        self.assertAlmostEqual(self.server.global_weights.p_init, 0.50 + 0.04, places=3)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_fastapi_federated_endpoints(self):
        """Verifies GET /api/v1/federated/round, POST /api/v1/federated/submit, and GET /api/v1/federated/weights."""
        # 1. Check round status
        resp = client.get("/api/v1/federated/round")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("current_round", data)
        self.assertIn("global_weights", data)
        self.assertTrue(data["disha_compliant"])

        # 2. Submit valid client update
        payload = {
            "client_id": "node-test-client-99",
            "round_id": data["current_round"],
            "sample_count": 45,
            "weight_deltas": {
                "p_init": 0.01,
                "p_transit": 0.01,
                "p_slip": -0.01,
                "p_guess": 0.00,
                "w_rt": 0.02,
                "w_acc": 0.01,
                "w_tremor": -0.01,
            },
            "algorithm": "FedAvg",
        }
        submit_resp = client.post("/api/v1/federated/submit", json=payload)
        self.assertEqual(submit_resp.status_code, 200)
        submit_data = submit_resp.json()
        self.assertTrue(submit_data["accepted"])

        # 3. Submit adversarial payload with raw clinical leak -> must return HTTP 400
        bad_payload = dict(payload)
        bad_payload["reaction_time_ms"] = 1250.0  # Prohibited key
        bad_resp = client.post("/api/v1/federated/submit", json=bad_payload)
        self.assertEqual(bad_resp.status_code, 400)
        self.assertIn("DISHA 2018 Section 34 Violation", bad_resp.json()["detail"])

        # 4. Fetch global weights
        weights_resp = client.get("/api/v1/federated/weights")
        self.assertEqual(weights_resp.status_code, 200)
        weights_data = weights_resp.json()
        self.assertIn("p_init", weights_data)
        self.assertIn("w_rt", weights_data)


if __name__ == "__main__":
    unittest.main()
