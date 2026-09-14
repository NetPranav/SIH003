"""
Unit tests for Smriti-NER Population Federated Learning & Milestone M18 (Sub-Phase 18.4)
Validates cross-district FedProx aggregation across 16 district headquarters (5,300 patients),
cross-linguistic model drift monitoring (PSI < 0.10 across 8 languages),
and formal Milestone M18 certification (Central Hub & CCEI Operational).
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestPopulationFederatedLearning(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_population_federated_round(self):
        """Validates cross-district FedProx aggregation summary and 16 district payloads."""
        res = client.get("/api/v1/federated/population-round")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Round summary validation
        summary = data["round_summary"]
        self.assertEqual(summary["aggregation_algorithm"], "FedProx")
        self.assertEqual(summary["mu_proximal_term"], 0.01)
        self.assertEqual(summary["districts_aggregated_count"], 16)
        self.assertEqual(summary["total_population_samples"], 5300)
        self.assertTrue(summary["global_convergence_achieved"])
        self.assertGreater(summary["loss_reduction_pct"], 10.0)

        # District payloads validation
        payloads = data["district_payloads"]
        self.assertEqual(len(payloads), 16)

        total_samples = sum(p["local_sample_count"] for p in payloads)
        self.assertEqual(total_samples, 5300)

        for p in payloads:
            self.assertTrue(p["district_id"].startswith("DIST-"))
            self.assertGreater(p["participating_tablets_count"], 0)
            self.assertGreater(p["local_sample_count"], 0)
            self.assertLessEqual(p["differential_privacy_budget_epsilon"], 1.0)
            self.assertEqual(p["status"], "INCLUDED_IN_AGGREGATION")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_model_drift_monitoring(self):
        """Validates cross-linguistic PSI model drift metrics across all 8 languages."""
        res = client.get("/api/v1/federated/drift-monitoring")
        self.assertEqual(res.status_code, 200)
        drifts = res.json()
        self.assertEqual(len(drifts), 8)

        langs = {d["language_code"] for d in drifts}
        self.assertEqual(langs, {"as", "brx", "kha", "grx", "mni", "lus", "bn", "ne"})

        for d in drifts:
            self.assertGreaterEqual(d["baseline_auroc"], 0.90)
            self.assertLess(d["current_30day_psi"], 0.10)  # PSI < 0.10 indicates stable
            self.assertEqual(d["drift_alert_level"], "STABLE")
            self.assertTrue(len(d["corrective_action"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m18_certification(self):
        """Validates formal Milestone M18 Certification signed off by MDoNER."""
        res = client.get("/api/v1/federated/milestone-m18-certification")
        self.assertEqual(res.status_code, 200)
        cert = res.json()

        self.assertEqual(cert["milestone_id"], "M18")
        self.assertEqual(cert["status"], "SIGNED_OFF")
        self.assertEqual(cert["total_states_covered"], 8)
        self.assertGreaterEqual(cert["total_patients_enrolled"], 5000)
        self.assertEqual(cert["total_patients_enrolled"], 5300)
        self.assertGreaterEqual(cert["total_ashas_trained"], 1500)
        self.assertEqual(cert["total_ashas_trained"], 1510)
        self.assertEqual(cert["ccei_deployment_tiers_count"], 4)
        self.assertEqual(cert["federated_districts_active"], 16)

        gates = cert["gates"]
        self.assertEqual(len(gates), 5)
        for g in gates:
            self.assertEqual(g["status"], "PASSED")
            self.assertTrue(len(g["required_threshold"]) > 0)
            self.assertTrue(len(g["achieved_value"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_population_fl_summary(self):
        """Validates consolidated summary metrics for Sub-Phase 18.4."""
        res = client.get("/api/v1/federated/population-summary")
        self.assertEqual(res.status_code, 200)
        summary = res.json()

        self.assertEqual(summary["active_federated_districts"], 16)
        self.assertGreaterEqual(summary["total_federated_rounds_completed"], 20)
        self.assertEqual(summary["languages_monitored_count"], 8)
        self.assertLess(summary["max_observed_psi"], 0.10)
        self.assertEqual(summary["milestone_m18_status"], "SIGNED_OFF")
        self.assertEqual(summary["status"], "POPULATION_FL_OPERATIONAL")


if __name__ == "__main__":
    unittest.main()
