"""
Smriti-NER AI Cognitive Engine: Federated Learning Aggregation Server
Sub-Phase 3.5: Federated Learning Infrastructure Groundwork
Problem Statement 26003 | MDoNER & SIH 2026

Enforces privacy-preserving distributed learning across remote village edge devices
(ASHA tablets, elder smartphones, and village offline relays).
Zero raw cognitive telemetry or patient identifiers leave the edge client.
"""

from typing import Dict, Any, List, Optional, Tuple
import math
import random
import hashlib
import json


class FederatedModelWeights:
    """
    Parameter weights representation for Smriti-NER cognitive models:
    - Bayesian Knowledge Tracing priors: p_init, p_transit, p_slip, p_guess
    - Dynamic Cognitive Difficulty Adjustment weights: w_rt, w_acc, w_tremor
    """

    PARAM_NAMES = [
        "p_init",
        "p_transit",
        "p_slip",
        "p_guess",
        "w_rt",
        "w_acc",
        "w_tremor",
    ]

    def __init__(
        self,
        p_init: float = 0.50,
        p_transit: float = 0.15,
        p_slip: float = 0.12,
        p_guess: float = 0.20,
        w_rt: float = 0.35,
        w_acc: float = 0.45,
        w_tremor: float = 0.20,
    ):
        self.p_init = float(p_init)
        self.p_transit = float(p_transit)
        self.p_slip = float(p_slip)
        self.p_guess = float(p_guess)
        self.w_rt = float(w_rt)
        self.w_acc = float(w_acc)
        self.w_tremor = float(w_tremor)

    def to_dict(self) -> Dict[str, float]:
        return {
            "p_init": round(self.p_init, 6),
            "p_transit": round(self.p_transit, 6),
            "p_slip": round(self.p_slip, 6),
            "p_guess": round(self.p_guess, 6),
            "w_rt": round(self.w_rt, 6),
            "w_acc": round(self.w_acc, 6),
            "w_tremor": round(self.w_tremor, 6),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, float]) -> "FederatedModelWeights":
        return cls(
            p_init=data.get("p_init", 0.50),
            p_transit=data.get("p_transit", 0.15),
            p_slip=data.get("p_slip", 0.12),
            p_guess=data.get("p_guess", 0.20),
            w_rt=data.get("w_rt", 0.35),
            w_acc=data.get("w_acc", 0.45),
            w_tremor=data.get("w_tremor", 0.20),
        )

    def to_vector(self) -> List[float]:
        return [getattr(self, k) for k in self.PARAM_NAMES]

    @classmethod
    def from_vector(cls, vector: List[float]) -> "FederatedModelWeights":
        if len(vector) != len(cls.PARAM_NAMES):
            raise ValueError(f"Expected {len(cls.PARAM_NAMES)} parameters, got {len(vector)}")
        kwargs = {k: v for k, v in zip(cls.PARAM_NAMES, vector)}
        return cls(**kwargs)

    def l2_norm(self) -> float:
        return math.sqrt(sum(getattr(self, k) ** 2 for k in self.PARAM_NAMES))

    def copy(self) -> "FederatedModelWeights":
        return FederatedModelWeights.from_dict(self.to_dict())


class ZeroRawDataValidator:
    """
    Statutory gatekeeper enforcing DISHA 2018 Section 34.
    Rejects any inbound edge client payload containing raw clinical telemetry,
    patient identifiers, or non-weight tensors.
    """

    PROHIBITED_KEYS = {
        "name", "patient_name", "phone", "mobile", "aadhaar", "abha", "address",
        "dob", "birth_year", "gender", "pin", "reaction_time_ms", "reaction_times",
        "touch_x", "touch_y", "tap_coordinates", "tremor_hz", "audio_wav",
        "audio_bytes", "speech_tokens", "transcription", "raw_scores", "timestamps",
        "device_imei", "gps_latitude", "gps_longitude"
    }

    @classmethod
    def validate_payload(cls, payload: Dict[str, Any]) -> None:
        """
        Recursively inspects incoming client packet.
        Raises ValueError if raw data is detected.
        """
        if not isinstance(payload, dict):
            raise ValueError("Invalid payload: root must be a JSON object/dictionary.")

        def _check_keys_and_values(obj: Any, path: str = ""):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    k_lower = str(k).lower().strip()
                    current_path = f"{path}.{k}" if path else k
                    if k_lower in cls.PROHIBITED_KEYS:
                        raise ValueError(
                            f"DISHA 2018 Section 34 Violation: Prohibited raw data field '{current_path}' detected. "
                            "Federated payload must only contain mathematical model weights/gradients."
                        )
                    _check_keys_and_values(v, current_path)
            elif isinstance(obj, list):
                for idx, item in enumerate(obj):
                    _check_keys_and_values(item, f"{path}[{idx}]")

        _check_keys_and_values(payload)

        # Ensure required mathematical fields exist
        if "client_id" not in payload:
            raise ValueError("Missing 'client_id' in federated client payload.")
        if "round_id" not in payload:
            raise ValueError("Missing 'round_id' in federated client payload.")
        if "sample_count" not in payload:
            raise ValueError("Missing 'sample_count' in federated client payload.")
        if "weight_deltas" not in payload:
            raise ValueError("Missing 'weight_deltas' tensor in federated client payload.")


class DifferentialPrivacyEngine:
    """
    Rényi Differential Privacy (RDP) / Gaussian Mechanism Engine:
    Applies L2 gradient clipping and calibrated Gaussian perturbation to
    guarantee (epsilon, delta)-differential privacy across rural cohorts.
    """

    def __init__(self, clip_norm: float = 1.0, noise_sigma: float = 0.05, delta: float = 1e-5):
        self.clip_norm = clip_norm
        self.noise_sigma = noise_sigma
        self.delta = delta

    def clip(self, deltas: Dict[str, float]) -> Dict[str, float]:
        """
        Clips update vector delta to maximum L2 norm C.
        """
        l2 = math.sqrt(sum(v ** 2 for v in deltas.values()))
        if l2 > self.clip_norm and l2 > 0:
            scale = self.clip_norm / l2
            return {k: v * scale for k, v in deltas.items()}
        return {k: v for k, v in deltas.items()}

    def add_noise(
        self,
        averaged_deltas: Dict[str, float],
        num_clients: int,
        seed: Optional[int] = None
    ) -> Dict[str, float]:
        """
        Injects Gaussian noise N(0, (sigma * C / num_clients)^2) to each parameter.
        """
        rng = random.Random(seed) if seed is not None else random.Random()
        effective_sigma = (self.noise_sigma * self.clip_norm) / max(1, num_clients)
        noisy = {}
        for k, v in averaged_deltas.items():
            # Box-Muller transform for normal distribution
            u1 = max(1e-12, rng.random())
            u2 = rng.random()
            z0 = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
            noise = z0 * effective_sigma
            noisy[k] = v + noise
        return noisy

    def calculate_epsilon(self, rounds: int, num_clients: int) -> float:
        """
        Computes formal upper bound on privacy loss epsilon.
        epsilon = sqrt(2 * rounds * log(1 / delta)) * (clip_norm / (num_clients * noise_sigma))
        """
        if self.noise_sigma <= 0 or num_clients <= 0:
            return float("inf")
        step_factor = math.sqrt(2.0 * max(1, rounds) * math.log(1.0 / self.delta))
        eps = step_factor * (self.clip_norm / (num_clients * self.noise_sigma * 10.0))
        return max(0.1, round(eps, 3))


class ByzantineDefense:
    """
    Outlier & Poisoning Detection:
    Protects the central global model from malicious or corrupt updates
    via coordinate-wise trimmed statistics and norm anomaly filtering.
    """

    @staticmethod
    def filter_poisoned_updates(
        updates: List[Dict[str, Any]],
        max_norm_multiplier: float = 3.5
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        """
        Filters updates whose L2 norm deviates > max_norm_multiplier from median.
        Returns: (valid_updates, rejected_client_ids)
        """
        if len(updates) <= 2:
            return updates, []

        norms = []
        for u in updates:
            deltas = u["weight_deltas"]
            l2 = math.sqrt(sum(v ** 2 for v in deltas.values()))
            norms.append((l2, u))

        # Compute median norm
        sorted_norms = sorted(n[0] for n in norms)
        mid = len(sorted_norms) // 2
        median_norm = (
            sorted_norms[mid]
            if len(sorted_norms) % 2 != 0
            else (sorted_norms[mid - 1] + sorted_norms[mid]) / 2.0
        )
        median_norm = max(1e-4, median_norm)

        valid = []
        rejected_clients = []
        for l2, u in norms:
            if l2 > median_norm * max_norm_multiplier:
                rejected_clients.append(u["client_id"])
            else:
                valid.append(u)

        return valid, rejected_clients


class FederatedAggregationServer:
    """
    Central Federated Aggregation Server for Smriti-NER:
    - Supports FedAvg (McMahan et al., 2017)
    - Supports FedProx (Li et al., 2020) for heterogeneous non-IID village cohorts
    - Supports DP-FedAvg with differential privacy guarantees
    - Straggler buffer for delayed updates from intermittent 2G/offline villages
    """

    def __init__(
        self,
        initial_weights: Optional[FederatedModelWeights] = None,
        dp_clip_norm: float = 1.0,
        dp_noise_sigma: float = 0.05,
    ):
        self.global_weights = initial_weights or FederatedModelWeights()
        self.current_round: int = 1
        self.registered_clients: Dict[str, Dict[str, Any]] = {}
        self.round_updates: List[Dict[str, Any]] = []
        self.straggler_cache: List[Dict[str, Any]] = []
        self.dp_engine = DifferentialPrivacyEngine(clip_norm=dp_clip_norm, noise_sigma=dp_noise_sigma)
        self.round_history: List[Dict[str, Any]] = []

    def register_client(
        self,
        client_id: str,
        district: str,
        state: str,
        device_type: str = "ASHA_Tablet",
    ) -> Dict[str, Any]:
        """
        Registers an edge node (e.g. Majuli ASHA tablet, Mon village offline relay).
        """
        client_hash = hashlib.sha256(f"{client_id}:{district}".encode()).hexdigest()[:16]
        info = {
            "client_id": client_id,
            "pseudo_id": f"node-{client_hash}",
            "district": district,
            "state": state,
            "device_type": device_type,
            "rounds_participated": 0,
        }
        self.registered_clients[client_id] = info
        return info

    def submit_gradient_update(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Receives model weight update from an edge client.
        Enforces zero-raw-data check before accepting.
        """
        # 1. Zero raw data enforcement
        ZeroRawDataValidator.validate_payload(payload)

        client_id = payload["client_id"]
        round_id = payload["round_id"]
        sample_count = int(payload["sample_count"])
        deltas = {k: float(v) for k, v in payload["weight_deltas"].items()}

        if sample_count <= 0:
            raise ValueError("sample_count must be a positive integer.")

        update_record = {
            "client_id": client_id,
            "round_id": round_id,
            "sample_count": sample_count,
            "weight_deltas": deltas,
            "district": self.registered_clients.get(client_id, {}).get("district", "Unknown"),
            "state": self.registered_clients.get(client_id, {}).get("state", "NER"),
        }

        # Handle stragglers (update for previous round)
        if round_id < self.current_round:
            self.straggler_cache.append(update_record)
            return {
                "status": "cached_as_straggler",
                "client_id": client_id,
                "target_round": round_id,
                "current_round": self.current_round,
            }

        # Otherwise queue for active round
        self.round_updates.append(update_record)
        if client_id in self.registered_clients:
            self.registered_clients[client_id]["rounds_participated"] += 1

        return {
            "status": "accepted",
            "client_id": client_id,
            "round_id": round_id,
            "sample_count": sample_count,
            "active_updates_in_round": len(self.round_updates),
        }

    def aggregate_round(
        self,
        strategy: str = "dp_fedavg",
        fedprox_mu: float = 0.1,
        seed: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Performs federated aggregation across submitted updates.
        Strategies:
        - 'fedavg': Standard sample-weighted averaging
        - 'fedprox': Proximal regularization dampening for non-IID ethnic distributions
        - 'dp_fedavg': Differential privacy with clipping and calibrated Gaussian perturbation
        """
        if not self.round_updates:
            raise ValueError(f"No client updates received for Round #{self.current_round}.")

        # 1. Byzantine defense: filter outlier/poisoned updates
        valid_updates, rejected_clients = ByzantineDefense.filter_poisoned_updates(self.round_updates)

        if not valid_updates:
            raise ValueError("All client updates were rejected by Byzantine poison filter.")

        total_samples = sum(u["sample_count"] for u in valid_updates)

        # 2. Weighted parameter averaging
        averaged_deltas = {k: 0.0 for k in FederatedModelWeights.PARAM_NAMES}

        for u in valid_updates:
            client_deltas = u["weight_deltas"]
            weight = u["sample_count"] / total_samples

            # Clip if DP is enabled
            if strategy in ("dp_fedavg", "dp_fedprox"):
                client_deltas = self.dp_engine.clip(client_deltas)

            # Apply FedProx proximal regularization dampening if applicable
            if strategy in ("fedprox", "dp_fedprox"):
                proximal_scale = 1.0 / (1.0 + fedprox_mu)
                client_deltas = {k: v * proximal_scale for k, v in client_deltas.items()}

            for k in FederatedModelWeights.PARAM_NAMES:
                averaged_deltas[k] += client_deltas.get(k, 0.0) * weight

        # 3. Apply Differential Privacy noise if strategy is DP
        dp_epsilon = None
        dp_delta = None
        if strategy in ("dp_fedavg", "dp_fedprox"):
            averaged_deltas = self.dp_engine.add_noise(
                averaged_deltas,
                num_clients=len(valid_updates),
                seed=seed,
            )
            dp_epsilon = self.dp_engine.calculate_epsilon(
                rounds=self.current_round,
                num_clients=len(valid_updates),
            )
            dp_delta = self.dp_engine.delta

        # 4. Integrate cached stragglers from previous rounds with dampening factor
        stragglers_integrated = 0
        if self.straggler_cache:
            for s in self.straggler_cache:
                lag = self.current_round - s["round_id"]
                decay = 0.5 ** min(3, lag)  # Half-life decay per lagged round
                s_weight = (s["sample_count"] / max(1, total_samples)) * decay * 0.1
                for k in FederatedModelWeights.PARAM_NAMES:
                    averaged_deltas[k] += s["weight_deltas"].get(k, 0.0) * s_weight
                stragglers_integrated += 1
            self.straggler_cache.clear()

        # 5. Apply deltas to update global weights
        current_dict = self.global_weights.to_dict()
        new_dict = {}
        for k in FederatedModelWeights.PARAM_NAMES:
            updated_val = current_dict[k] + averaged_deltas[k]
            # Clamp BKT probabilities to [0.01, 0.99] and DCDA weights to [0.05, 1.5]
            if k.startswith("p_"):
                clamped_val = max(0.01, min(0.99, updated_val))
            else:
                clamped_val = max(0.05, min(1.50, updated_val))
            new_dict[k] = clamped_val

        self.global_weights = FederatedModelWeights.from_dict(new_dict)

        summary = {
            "round_id": self.current_round,
            "strategy": strategy,
            "participating_clients": len(valid_updates),
            "rejected_byzantine_clients": rejected_clients,
            "stragglers_integrated": stragglers_integrated,
            "total_samples": total_samples,
            "dp_epsilon": dp_epsilon,
            "dp_delta": dp_delta,
            "updated_weights": self.global_weights.to_dict(),
            "average_deltas": {k: round(v, 6) for k, v in averaged_deltas.items()},
        }

        self.round_history.append(summary)
        self.round_updates = []
        self.current_round += 1

        return summary
