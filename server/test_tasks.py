"""
Unit Tests for Celery Background Tasks & Clinical Alert Escalations
SIH 2026 Problem Statement ID: 26003 | MDoNER
"""

import unittest
from server.tasks import (
    process_telemetry_batch,
    compute_daily_mmse_trajectory,
    schedule_ivr_callback_task,
    generate_daily_circadian_profiles,
)

class TestCeleryTasks(unittest.TestCase):
    def test_process_telemetry_normal(self):
        """Test processing normal game telemetry without alerts."""
        batch = {
            "patient_pseudo_id": "a" * 64,
            "events": [
                {"game_id": "dhol_pepa", "accuracy": 0.85, "stability": 0.90, "tremor_hz": 3.2},
                {"game_id": "muga_silk", "accuracy": 0.80, "stability": 0.88, "tremor_hz": 3.0},
            ]
        }
        res = process_telemetry_batch(batch)
        self.assertEqual(res["status"], "success")
        self.assertEqual(res["processed_events"], 2)
        self.assertEqual(res["alerts_generated"], 0)

    def test_process_telemetry_tremor_alert(self):
        """Test triggering warning when tremor exceeds 6.5 Hz threshold."""
        batch = {
            "patient_pseudo_id": "b" * 64,
            "events": [
                {"game_id": "dhol_pepa", "accuracy": 0.65, "stability": 0.70, "tremor_hz": 7.1},
            ]
        }
        res = process_telemetry_batch(batch)
        self.assertEqual(res["alerts_generated"], 1)
        self.assertEqual(res["alerts"][0]["severity"], "WARNING")
        self.assertEqual(res["alerts"][0]["metric"], "touch_tremor_hz")

    def test_process_telemetry_asha_critical_escalation(self):
        """Test triggering CRITICAL_ASHA escalation on severe drop."""
        batch = {
            "patient_pseudo_id": "c" * 64,
            "events": [
                {"game_id": "rhinos_maze", "accuracy": 0.25, "stability": 0.20, "tremor_hz": 4.5},
            ]
        }
        res = process_telemetry_batch(batch)
        self.assertEqual(res["alerts_generated"], 1)
        self.assertEqual(res["alerts"][0]["severity"], "CRITICAL_ASHA")

    def test_compute_daily_mmse_trajectory(self):
        """Test MMSE proxy score projection from trailing interaction data."""
        trials = [
            {"accuracy": 0.80},
            {"accuracy": 0.85},
            {"accuracy": 0.90},
        ]
        res = compute_daily_mmse_trajectory("d" * 64, trials)
        self.assertGreaterEqual(res["total_mmse_proxy"], 24.0)
        self.assertEqual(res["clinical_tier"], "mci")
        self.assertIn("orientation", res["domain_scores"])

    def test_schedule_ivr_callback_task(self):
        """Test IVR outbound callback queuing within 3 seconds."""
        res = schedule_ivr_callback_task("e" * 32, "as")
        self.assertEqual(res["status"], "queued")
        self.assertLessEqual(res["scheduled_delay_ms"], 3000)

    def test_circadian_calming_generation(self):
        """Test batch circadian audio playlist generation."""
        res = generate_daily_circadian_profiles()
        self.assertEqual(res["status"], "completed")
        self.assertEqual(res["cohorts_calibrated"], 8)

if __name__ == "__main__":
    unittest.main()
