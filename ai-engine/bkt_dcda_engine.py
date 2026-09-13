"""
Smriti-NER AI Cognitive Engine: Dynamic Cognitive Difficulty Adjustment (DCDA)
Sub-Phase 3.1: Monorepo Foundation & Bayesian Knowledge Tracing (BKT) Core
Problem Statement 26003 | MDoNER
"""

from typing import Dict, Any, Tuple
import math


class BayesianKnowledgeTracing:
    """
    Standard Bayesian Knowledge Tracing (Corbett & Anderson) with
    Geriatric Cognitive Slip & Guess Adaptations for Dementia Screening.
    """

    def __init__(
        self,
        p_init: float = 0.50,  # Prior probability of cognitive competence
        p_transit: float = 0.15,  # Probability of transitioning to mastery / learning
        p_slip: float = 0.12,  # Probability of slipping due to tremor / lapse
        p_guess: float = 0.20,  # Probability of lucky correct tap
    ):
        self.p_init = p_init
        self.p_transit = p_transit
        self.p_slip = p_slip
        self.p_guess = p_guess

    def update(self, p_prior: float, is_correct: bool) -> float:
        """
        Calculates posterior mastery probability P(L_t | Action)
        followed by transition probability P(L_{t+1}).
        """
        if is_correct:
            numerator = p_prior * (1.0 - self.p_slip)
            denominator = numerator + (1.0 - p_prior) * self.p_guess
        else:
            numerator = p_prior * self.p_slip
            denominator = numerator + (1.0 - p_prior) * (1.0 - self.p_guess)

        # Posterior probability
        p_posterior = numerator / max(1e-6, denominator)

        # Account for learning/fluctuation transition
        p_next = p_posterior + (1.0 - p_posterior) * self.p_transit
        return max(0.01, min(0.99, p_next))


class DCDAEngine:
    """
    Dynamic Cognitive Difficulty Adjustment (DCDA) Engine:
    Maintains user state within the 'Zone of Proximal Flow' (Csikszentmihalyi, 1990)
    to prevent cognitive distress, catastrophic frustration, and sundowning agitation.
    """

    DIFFICULTY_LEVELS = [1, 2, 3, 4, 5]

    def __init__(self):
        self.bkt = BayesianKnowledgeTracing()

    def calculate_next_level(
        self,
        current_level: int,
        p_mastery: float,
        reaction_time_ms: float,
        target_rt_ms: float = 1200.0,
    ) -> Tuple[int, float]:
        """
        Adjusts level up or down based on Bayesian competence and motor latency.
        Returns: (new_level, updated_mastery)
        """
        # Latency penalty factor: if elder took >2x target time, dampen competence
        latency_ratio = reaction_time_ms / target_rt_ms
        effective_mastery = p_mastery * (1.0 if latency_ratio <= 1.2 else (1.2 / latency_ratio))

        new_level = current_level
        if effective_mastery > 0.78 and current_level < 5:
            new_level += 1
        elif effective_mastery < 0.35 and current_level > 1:
            new_level -= 1

        return new_level, effective_mastery

    @staticmethod
    def mmse_5_domain_proxy(
        orientation_score: float,
        memory_score: float,
        attention_score: float,
        executive_score: float,
        language_score: float,
    ) -> Dict[str, Any]:
        """
        Maps multi-domain game performance to standard 30-point MMSE cognitive scale.
        """
        # Weighted domain sum
        total = (
            min(5.0, orientation_score)
            + min(6.0, memory_score)
            + min(6.0, attention_score)
            + min(5.0, executive_score)
            + min(4.0, language_score)
            + 4.0  # Visuospatial & constructional baseline proxy
        )

        total_clamped = max(0.0, min(30.0, total))

        if total_clamped >= 24.0:
            staging = "Normal / Age-Appropriate Cognition"
            risk = "Low"
        elif total_clamped >= 18.0:
            staging = "Mild Cognitive Impairment (MCI)"
            risk = "Moderate"
        elif total_clamped >= 10.0:
            staging = "Mild to Moderate ADRD"
            risk = "High"
        else:
            staging = "Severe Dementia Staging"
            risk = "Critical"

        return {
            "total_score": round(total_clamped, 1),
            "staging": staging,
            "clinical_risk": risk,
            "domains": {
                "orientation": round(orientation_score, 1),
                "memory": round(memory_score, 1),
                "attention": round(attention_score, 1),
                "executive": round(executive_score, 1),
                "language": round(language_score, 1),
            },
        }
