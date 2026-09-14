"""
Smriti-NER Sub-Phase 5.3 Verification Test Suite
Tests for Difficulty Orchestrator (max delta = +/- 1), Circadian Sundowning Guard,
Digital MMSE Proxy with 95% CI, and Longitudinal Trajectory Slopes.
"""

import unittest
from datetime import datetime


def evaluate_tier_transition(
    current_tier,
    p_learned,
    consecutive_successes,
    consecutive_errors,
    aacb_triggered=False,
    is_sundowning=False,
    trials_since_last_shift=3,
):
    """Reference implementation of DifficultyOrchestrator.evaluateTransition"""
    if aacb_triggered:
        return max(1, current_tier - 1), "AACB triggered"

    ceiling = 3 if is_sundowning else 5

    if is_sundowning and current_tier > ceiling:
        return ceiling, "Sundowning clamped at Tier 3"

    if trials_since_last_shift < 2:
        return current_tier, "Hysteresis active"

    if consecutive_errors >= 2 or p_learned <= 0.35:
        return max(1, current_tier - 1), "Struggle detected"

    if p_learned >= 0.85 and consecutive_successes >= 3:
        if current_tier < ceiling:
            return current_tier + 1, "Promoted"
        return current_tier, "At ceiling"

    return current_tier, "Consolidation"


def calculate_mmse_proxy(orientation, memory, attention, executive, language):
    """Reference implementation of MMSEProxyCalculator"""
    sem = 1.25
    margin = round(1.96 * sem, 1)

    raw_total = (
        min(5.0, max(0.0, orientation))
        + min(8.0, max(0.0, memory))
        + min(7.0, max(0.0, attention))
        + min(6.0, max(0.0, executive))
        + min(4.0, max(0.0, language))
    )
    total_score = round(raw_total, 1)
    ci_lower = max(0.0, round(total_score - margin, 1))
    ci_upper = min(30.0, round(total_score + margin, 1))

    if total_score >= 25.0:
        staging = "Intact"
    elif total_score >= 20.0:
        staging = "MCI"
    elif total_score >= 13.0:
        staging = "Moderate Dementia"
    else:
        staging = "Severe Decline"

    return total_score, ci_lower, ci_upper, staging


def compute_trajectory_slope(points):
    """Reference implementation of LongitudinalTrajectoryEngine"""
    if len(points) < 2:
        return 0.0, "Stable", False

    n = len(points)
    sum_t = sum(p["day"] for p in points)
    sum_y = sum(p["score"] for p in points)

    mean_t = sum_t / n
    mean_y = sum_y / n

    num = sum((p["day"] - mean_t) * (p["score"] - mean_y) for p in points)
    den = sum((p["day"] - mean_t) ** 2 for p in points)

    daily_slope = num / den if den != 0 else 0.0
    slope_per_month = round(daily_slope * 30.0, 2)

    if slope_per_month < -2.0:
        staging = "Rapid Progression"
        alert = True
    elif slope_per_month < -0.5:
        staging = "Mild Decline"
        alert = False
    else:
        staging = "Stable"
        alert = False

    return slope_per_month, staging, alert


class TestDifficultyOrchestratorAndMMSEProxy(unittest.TestCase):
    def test_max_delta_single_tier_step_rule(self):
        """Difficulty step transitions should NEVER jump more than 1 tier at a time"""
        current_tier = 2
        next_tier, reason = evaluate_tier_transition(
            current_tier=current_tier,
            p_learned=0.98,
            consecutive_successes=5,
            consecutive_errors=0,
            is_sundowning=False,
        )
        self.assertEqual(next_tier, 3)
        self.assertLessEqual(abs(next_tier - current_tier), 1)

    def test_sundowning_window_tier_cap(self):
        """Sundowning window should strictly cap difficulty at Tier 3 regardless of high mastery"""
        current_tier = 3
        next_tier, reason = evaluate_tier_transition(
            current_tier=current_tier,
            p_learned=0.95,
            consecutive_successes=4,
            consecutive_errors=0,
            is_sundowning=True,
        )
        self.assertEqual(next_tier, 3)  # Held at Tier 3 ceiling
        self.assertIn("ceiling", reason)

        # If already at Tier 4 during sundowning, must step down to 3
        stepped_down_tier, _ = evaluate_tier_transition(
            current_tier=4,
            p_learned=0.70,
            consecutive_successes=1,
            consecutive_errors=0,
            is_sundowning=True,
        )
        self.assertEqual(stepped_down_tier, 3)

    def test_aacb_emergency_demotion(self):
        """AACB activation should immediately step down tier by 1"""
        next_tier, reason = evaluate_tier_transition(
            current_tier=4,
            p_learned=0.75,
            consecutive_successes=0,
            consecutive_errors=2,
            aacb_triggered=True,
        )
        self.assertEqual(next_tier, 3)
        self.assertIn("AACB", reason)

    def test_mmse_proxy_and_95_ci_bounds(self):
        """MMSE proxy should compute accurate total and symmetric 95% CI bounds"""
        # Test mild impairment: Orientation 4, Memory 6, Attention 5, Executive 4, Language 3 -> 22.0 (MCI)
        score, ci_lower, ci_upper, staging = calculate_mmse_proxy(
            orientation=4.0, memory=6.0, attention=5.0, executive=4.0, language=3.0
        )
        self.assertEqual(score, 22.0)
        self.assertEqual(staging, "MCI")
        self.assertAlmostEqual(score - ci_lower, 2.5, delta=0.1)
        self.assertAlmostEqual(ci_upper - score, 2.5, delta=0.1)
        self.assertGreaterEqual(ci_lower, 0.0)
        self.assertLessEqual(ci_upper, 30.0)

    def test_longitudinal_trajectory_slopes(self):
        """Trajectory slope must correctly classify stable vs rapid progression trajectories"""
        # 1. Stable sessions over 30 days
        stable_points = [
            {"day": 0, "score": 24.0},
            {"day": 10, "score": 24.2},
            {"day": 20, "score": 23.8},
            {"day": 30, "score": 24.0},
        ]
        slope, staging, alert = compute_trajectory_slope(stable_points)
        self.assertEqual(staging, "Stable")
        self.assertFalse(alert)
        self.assertGreaterEqual(slope, -0.5)

        # 2. Rapid cognitive decline (-3.0 points across 30 days)
        declining_points = [
            {"day": 0, "score": 25.0},
            {"day": 10, "score": 24.0},
            {"day": 20, "score": 23.0},
            {"day": 30, "score": 22.0},
        ]
        slope_dec, staging_dec, alert_dec = compute_trajectory_slope(declining_points)
        self.assertEqual(staging_dec, "Rapid Progression")
        self.assertTrue(alert_dec)
        self.assertLess(slope_dec, -2.0)


if __name__ == "__main__":
    unittest.main()
