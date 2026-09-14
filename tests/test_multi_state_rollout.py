"""
Unit tests for Smriti-NER Multi-State Expansion Rollout Plan (Sub-Phase 16.1)
Validates 4-wave scale-out across all 8 NER states:
90 PHCs, 900 MDM tablets, 5,300 patients, and triple-failover connectivity.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestMultiStateRollout(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_rollout_waves_aggregation(self):
        """Validates that 4 staged waves accurately sum to 90 PHCs, 5,300 patients, and 900 tablets."""
        res = client.get("/api/v1/rollout/waves")
        self.assertEqual(res.status_code, 200)
        waves = res.json()
        self.assertEqual(len(waves), 4)

        total_phcs = sum(w["target_phcs"] for w in waves)
        total_patients = sum(w["target_patients"] for w in waves)
        total_tablets = sum(w["mdm_tablets_allocated"] for w in waves)

        self.assertEqual(total_phcs, 90)
        self.assertEqual(total_patients, 5300)
        self.assertEqual(total_tablets, 900)

        # Check wave 1 is active
        wave1 = next(w for w in waves if w["wave"] == "WAVE_1")
        self.assertEqual(wave1["status"], "ACTIVE")
        self.assertIn("Assam", wave1["states_covered"])
        self.assertIn("Meghalaya", wave1["states_covered"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_state_rollout_profiles(self):
        """Validates all 8 NER states have profiles, checking VSAT fallback flags on border states."""
        res = client.get("/api/v1/rollout/states")
        self.assertEqual(res.status_code, 200)
        states = res.json()
        self.assertEqual(len(states), 8)

        state_codes = {s["state_code"] for s in states}
        expected_codes = {"AS", "ML", "MN", "TR", "AR", "NL", "MZ", "SK"}
        self.assertEqual(state_codes, expected_codes)

        # Total PHCs and patients across state profiles
        total_phcs = sum(s["phc_count"] for s in states)
        total_patients = sum(s["patient_target"] for s in states)
        self.assertEqual(total_phcs, 90)
        self.assertEqual(total_patients, 5300)

        # Verify border mountain states have VSAT fallback required
        vsat_states = {s["state_code"] for s in states if s["vsat_fallback_required"]}
        self.assertTrue({"AR", "NL", "MZ"}.issubset(vsat_states))

        # Check all MOUs are executed
        for s in states:
            self.assertEqual(s["state_mou_status"], "EXECUTED")
            self.assertGreater(len(s["expansion_districts"]), 0)
            self.assertGreater(len(s["dominant_languages"]), 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_multi_state_rollout_summary(self):
        """Validates consolidated pan-NER scale-out summary."""
        res = client.get("/api/v1/rollout/summary")
        self.assertEqual(res.status_code, 200)
        summary = res.json()
        self.assertEqual(summary["total_states_covered"], 8)
        self.assertEqual(summary["total_phcs_target"], 90)
        self.assertEqual(summary["total_patients_target"], 5300)
        self.assertEqual(summary["total_mdm_tablets_deployed"], 900)
        self.assertEqual(summary["waves_count"], 4)
        self.assertEqual(summary["active_nodal_officers"], 24)
        self.assertTrue(summary["telecom_triple_failover_active"])
        self.assertEqual(summary["pan_ner_deployment_status"], "ROLLOUT_ACTIVE_ON_SCHEDULE")


if __name__ == "__main__":
    unittest.main()
