"""
Smriti-NER Sub-Phase 5.1 Verification Test Suite
Tests for Telemetry Extraction Pipeline, Bi-Factor Latency Decomposition,
Wander Index, and 7-Element Session Telemetry Vector Schema.
"""

import math
import unittest
from datetime import datetime


def compute_trajectory_metrics(points):
    """
    Python reference implementation of TouchStreamLogger.computeTrajectoryMetrics
    """
    if len(points) < 2:
        return {
            "path_length_px": 0.0,
            "direct_disp_px": 0.0,
            "wander_index": 1.0,
            "point_count": len(points),
            "tremor_detected": False,
        }

    path_length = 0.0
    direction_changes = 0
    last_dx = 0.0
    last_dy = 0.0

    for i in range(len(points) - 1):
        p1 = points[i]
        p2 = points[i + 1]
        dx = p2["x"] - p1["x"]
        dy = p2["y"] - p1["y"]
        segment = math.sqrt(dx * dx + dy * dy)
        path_length += segment

        if i > 0:
            if (dx > 0 and last_dx < 0) or (dx < 0 and last_dx > 0):
                direction_changes += 1
            if (dy > 0 and last_dy < 0) or (dy < 0 and last_dy > 0):
                direction_changes += 1

        last_dx = dx
        last_dy = dy

    first = points[0]
    last = points[-1]
    total_dx = last["x"] - first["x"]
    total_dy = last["y"] - first["y"]
    direct_disp = math.sqrt(total_dx * total_dx + total_dy * total_dy)

    safe_disp = max(1.0, direct_disp)
    wander_index = max(1.0, round(path_length / safe_disp, 2))

    duration_ms = max(1, last["timestamp"] - first["timestamp"])
    duration_sec = duration_ms / 1000.0

    cycles = direction_changes / 4.0
    tremor_hz = round(cycles / duration_sec, 1) if duration_sec > 0.15 else 0.0
    is_tremor = wander_index > 1.35 and 3.0 <= tremor_hz <= 11.5

    return {
        "path_length_px": round(path_length, 1),
        "direct_disp_px": round(direct_disp, 1),
        "wander_index": wander_index,
        "point_count": len(points),
        "tremor_hz": tremor_hz,
        "tremor_detected": is_tremor,
    }


def decompose_reaction_time(total_rt_ms, wander_index=1.15, baseline_motor_ms=280, kappa=240):
    """
    Decomposes total reaction time into tau_motor and RT_delib.
    """
    safe_wander = max(1.0, wander_index)
    tau_motor = round(kappa * math.log(safe_wander) + baseline_motor_ms)
    deliberation = max(80, total_rt_ms - tau_motor)
    return tau_motor, deliberation


def validate_session_telemetry_vector(v):
    """
    Validates standard 7-element telemetry vector schema.
    """
    if not isinstance(v, (list, tuple)) or len(v) != 7:
        return False
    rt, tau, delib, acc, tier, aacb, circ = v
    return (
        isinstance(rt, (int, float)) and rt >= 0 and
        isinstance(tau, (int, float)) and tau >= 0 and
        isinstance(delib, (int, float)) and delib >= 0 and
        isinstance(acc, (int, float)) and 0.0 <= acc <= 1.0 and
        isinstance(tier, int) and 1 <= tier <= 5 and
        aacb in (0, 1) and
        isinstance(circ, (int, float)) and 0.0 <= circ <= 1.0
    )


class TestTelemetryExtractionPipeline(unittest.TestCase):
    def test_straight_line_trajectory_wander(self):
        """A straight confident tap should have wander index close to 1.0"""
        points = [
            {"x": 100, "y": 100, "timestamp": 1000},
            {"x": 150, "y": 150, "timestamp": 1100},
            {"x": 200, "y": 200, "timestamp": 1200},
        ]
        metrics = compute_trajectory_metrics(points)
        self.assertAlmostEqual(metrics["wander_index"], 1.0, delta=0.05)
        self.assertFalse(metrics["tremor_detected"])

    def test_tremulous_wander_trajectory(self):
        """An oscillating tremulous touch should yield high wander index and tremor flag"""
        points = [
            {"x": 100, "y": 100, "timestamp": 1000},
            {"x": 120, "y": 115, "timestamp": 1050},
            {"x": 110, "y": 95, "timestamp": 1100},
            {"x": 130, "y": 120, "timestamp": 1150},
            {"x": 115, "y": 100, "timestamp": 1200},
            {"x": 140, "y": 125, "timestamp": 1250},
            {"x": 125, "y": 105, "timestamp": 1300},
            {"x": 150, "y": 130, "timestamp": 1350},
            {"x": 135, "y": 110, "timestamp": 1400},
            {"x": 160, "y": 135, "timestamp": 1450},
            {"x": 145, "y": 115, "timestamp": 1500},
            {"x": 170, "y": 140, "timestamp": 1550},
        ]
        metrics = compute_trajectory_metrics(points)
        self.assertGreater(metrics["wander_index"], 1.5)
        self.assertGreater(metrics["path_length_px"], metrics["direct_disp_px"])
        self.assertTrue(metrics["tremor_detected"])

    def test_bi_factor_latency_decomposition(self):
        """Verify motor latency isolation does not drop below 80ms lower bound"""
        total_rt = 1200
        tau, delib = decompose_reaction_time(total_rt, wander_index=1.0)
        self.assertEqual(tau, 280)  # ln(1.0) = 0 -> baseline 280ms
        self.assertEqual(delib, 920)

        # Extreme tremor test
        total_rt = 600
        tau_high, delib_floor = decompose_reaction_time(total_rt, wander_index=4.0)
        self.assertGreater(tau_high, 600)
        self.assertEqual(delib_floor, 80)  # Clamped to 80ms retinal-cortical bound

    def test_session_telemetry_vector_validation(self):
        """Verify valid and invalid telemetry vectors"""
        valid_vec = [1250, 340, 910, 0.85, 3, 0, 0.75]
        self.assertTrue(validate_session_telemetry_vector(valid_vec))

        # Invalid lengths or out-of-bound values
        self.assertFalse(validate_session_telemetry_vector([1250, 340]))  # Too short
        self.assertFalse(validate_session_telemetry_vector([1250, 340, 910, 1.5, 3, 0, 0.75]))  # Acc > 1.0
        self.assertFalse(validate_session_telemetry_vector([1250, 340, 910, 0.85, 6, 0, 0.75]))  # Tier > 5
        self.assertFalse(validate_session_telemetry_vector([1250, 340, 910, 0.85, 3, 2, 0.75]))  # AACB not 0/1


if __name__ == "__main__":
    unittest.main()
