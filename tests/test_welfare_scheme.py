"""
Unit tests for Smriti-NER Welfare Scheme Alignment & Milestone M12
Sub-Phase 12.4: NPHCE Program Mapping, RVY Eligibility Engine, and Milestone M12 Sign-Off
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestWelfareScheme(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_nphce_tier_mappings(self):
        """Tests that all 4 NPHCE health tiers are structurally mapped."""
        res = client.get("/api/v1/policy/nphce-mapping")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 4)
        tiers = [item["tier"] for item in data]
        self.assertIn("AB_HWC", tiers)
        self.assertIn("PHC", tiers)
        self.assertIn("DISTRICT_HOSPITAL", tiers)
        self.assertIn("REGIONAL_GERIATRIC_CENTRE", tiers)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_rvy_eligibility_bpl_senior(self):
        """Tests that low-income senior citizen qualifies for 100% RVY tablet & beacon subsidy."""
        payload = {
            "patient_id": "p_anand_01",
            "age": 72,
            "is_bpl_or_pensioner": True,
            "monthly_income_inr": 8000.0
        }
        res = client.post("/api/v1/policy/rvy-eligibility", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_senior_citizen"])
        self.assertTrue(data["income_or_bpl_qualified"])
        self.assertTrue(data["eligible_for_cognitive_kit"])
        self.assertEqual(data["recommended_bundle"]["government_subsidy_pct"], 100)
        self.assertIn("100% ALIMCO / RVY sponsorship", data["application_guidance"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_rvy_eligibility_ineligible_non_senior(self):
        """Tests that non-senior citizen is rejected for RVY senior kit."""
        payload = {
            "patient_id": "p_younger_01",
            "age": 45,
            "is_bpl_or_pensioner": False,
            "monthly_income_inr": 35000.0
        }
        res = client.post("/api/v1/policy/rvy-eligibility", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["is_senior_citizen"])
        self.assertFalse(data["eligible_for_cognitive_kit"])
        self.assertEqual(data["recommended_bundle"]["government_subsidy_pct"], 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_scheme_currency_records(self):
        """Tests that all 5 national welfare schemes are actively verified for Q3 2026."""
        res = client.get("/api/v1/policy/scheme-currency")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 5)
        for record in data:
            self.assertEqual(record["active_status"], "ACTIVE")
            self.assertEqual(record["last_verified_date"], "2026-09-14")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m12_audit_signoff(self):
        """Tests official Milestone M12 sign-off report."""
        res = client.get("/api/v1/policy/milestone-m12-audit")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["milestone_id"], "M12")
        self.assertTrue(data["all_api_endpoints_passed"])
        self.assertTrue(data["abha_sandbox_verified"])
        self.assertTrue(data["esanjeevani_referral_tested"])
        self.assertTrue(data["scheme_citations_verified_current"])
        self.assertTrue(data["signed_off"])


if __name__ == "__main__":
    unittest.main()
