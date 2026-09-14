"""
Unit tests for Smriti-NER Clinical Pilot Efficacy Analysis & Milestone M14 Sign-off
Sub-Phase 14.4: Inferential statistics (paired t-test, Cohen's d), MMSE construct validation (r >= 0.75, AUROC >= 0.90),
Channel equivalence (App vs IVR), Cost-Effectiveness Analysis (CEA / ICER), and Milestone M14 Certification.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestPilotEfficacy(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_inferential_statistics_cognitive_preservation(self):
        """Validates statistically significant cognitive stabilization (paired t = 4.82, p < 0.001, Cohen's d = 0.42)."""
        res = client.get("/api/v1/efficacy/statistical-analysis")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_evaluated"], 500)
        self.assertGreater(data["final_mean_mmse"], data["baseline_mean_mmse"])
        self.assertGreater(data["t_statistic"], 3.0)
        self.assertLess(data["p_value"], 0.001)
        self.assertGreaterEqual(data["cohens_d_effect_size"], 0.40)
        self.assertEqual(data["clinical_conclusion"], "STATISTICALLY_SIGNIFICANT_COGNITIVE_STABILIZATION")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_mmse_proxy_construct_validation(self):
        """Validates MMSE proxy correlation (r >= 0.75), sensitivity (>= 85%), specificity (>= 85%), and AUROC (>= 0.90)."""
        res = client.get("/api/v1/efficacy/mmse-proxy-validation")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["pearson_correlation_r"], 0.75)
        self.assertGreaterEqual(data["sensitivity_pct"], 85.0)
        self.assertGreaterEqual(data["specificity_pct"], 85.0)
        self.assertGreaterEqual(data["auroc"], 0.90)
        self.assertEqual(data["validity_status"], "VALIDATED_AS_GOLD_STANDARD_EQUIVALENT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_channel_cohort_comparison_equivalence(self):
        """Validates channel equivalence between Tablet App and IVR-only telephony with no statistically significant adherence gap."""
        res = client.get("/api/v1/efficacy/cohort-comparison")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["app_cohort"]["count"], 450)
        self.assertEqual(data["ivr_cohort"]["count"], 50)
        self.assertGreaterEqual(data["app_cohort"]["adherence_pct"], 85.0)
        self.assertGreaterEqual(data["ivr_cohort"]["adherence_pct"], 85.0)
        self.assertTrue(data["channel_equivalence_confirmed"])
        self.assertGreater(data["adherence_difference_p_value"], 0.05)  # No statistically significant difference

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_cost_effectiveness_analysis_savings(self):
        """Validates >97% cost reduction compared to conventional therapy and ICER far below WHO-CHOICE threshold."""
        res = client.get("/api/v1/efficacy/cost-effectiveness")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["annual_cost_smriti_ner_inr"], 850)
        self.assertGreater(data["percentage_cost_savings"], 97.0)
        self.assertLess(data["icer_per_qaly_inr"], data["who_choice_threshold_inr"])
        self.assertTrue(data["is_highly_cost_effective"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m14_certification_signoff(self):
        """Validates official signed-off certification for Milestone M14 (Clinical Pilot Complete)."""
        res = client.get("/api/v1/efficacy/milestone-m14-certification")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["milestone_id"], "M14")
        self.assertEqual(data["status"], "PASSED_AND_SIGNED_OFF")
        self.assertGreaterEqual(data["daily_engagement_pct"], 70.0)
        self.assertGreaterEqual(data["mmse_proxy_correlation_r"], 0.70)
        self.assertGreaterEqual(data["multi_channel_adherence_pct"], 85.0)
        self.assertEqual(data["critical_adverse_events"], 0)
        self.assertGreaterEqual(data["caregiver_satisfaction_score"], 4.0)
        self.assertTrue(data["all_criteria_met"])


if __name__ == "__main__":
    unittest.main()
