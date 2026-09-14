"""
Unit tests for Sub-Phase 20.2: Long-Term Sustainability Model
"""

import unittest
from fastapi.testclient import TestClient
from server.main import app


class TestSustainabilityModel(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_funding_proposal(self):
        """Test statutory 5-year programmatic funding proposal and budget allocation."""
        response = self.client.get("/api/v1/sustainability/funding-proposal")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["total_budget_crores"], 38.40)
        self.assertEqual(data["duration_years"], 5)
        self.assertEqual(data["status"], "APPROVED_IN_PRINCIPLE")

        # Statutory alignment checks
        alignments = data["statutory_alignments"]
        self.assertEqual(len(alignments), 4)
        self.assertTrue(any("NHM" in a for a in alignments))
        self.assertTrue(any("NPHCE" in a for a in alignments))
        self.assertTrue(any("RVY" in a for a in alignments))
        self.assertTrue(any("NESIDS" in a for a in alignments))

        # Budget category sum verification
        categories = data["budget_categories"]
        self.assertEqual(len(categories), 5)
        self.assertAlmostEqual(sum(c["allocation_crores"] for c in categories), 38.40, places=2)
        self.assertAlmostEqual(sum(c["percentage"] for c in categories), 100.0, places=1)

    def test_open_source_repo(self):
        """Test open-source repository configuration, MPL-2.0 license, and modules."""
        response = self.client.get("/api/v1/sustainability/open-source-repo")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("github.com/smriti-ner", data["repository_url"])
        self.assertIn("MPL-2.0", data["license"])
        self.assertEqual(data["status"], "PUBLIC_ACTIVE")

        packages = data["packages"]
        self.assertEqual(len(packages), 3)
        package_names = [p["name"] for p in packages]
        self.assertIn("@smriti/core-engine", package_names)
        self.assertIn("@smriti/dcda-runtime", package_names)
        self.assertIn("@smriti/aacb-extractor", package_names)

    def test_academic_grants(self):
        """Test extramural academic research grant applications and awards."""
        response = self.client.get("/api/v1/sustainability/grants")
        self.assertEqual(response.status_code, 200)
        grants = response.json()
        self.assertEqual(len(grants), 3)

        agencies = [g["funding_agency"] for g in grants]
        self.assertTrue(any("ICMR" in a for a in agencies))
        self.assertTrue(any("DBT" in a for a in agencies))
        self.assertTrue(any("Wellcome Trust" in a for a in agencies))

        total_grant_inr = sum(g["grant_value_inr_crores"] for g in grants)
        self.assertAlmostEqual(total_grant_inr, 21.20, places=2)

    def test_kpi_framework(self):
        """Test impact measurement framework and unit economics metrics."""
        response = self.client.get("/api/v1/sustainability/kpi-framework")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["elders_served_current"], 14850)
        self.assertEqual(data["elders_served_target_year1"], 50000)
        self.assertEqual(data["cognitive_preservation_rate_percent"], 28.4)
        self.assertGreaterEqual(data["overall_protocol_adherence_percent"], 70.0)
        self.assertGreaterEqual(data["asha_retention_rate_percent"], 95.0)

        # Unit economics validation
        self.assertEqual(data["unit_cost_per_elder_per_year_inr"], 142.50)
        self.assertEqual(data["traditional_clinic_cost_per_visit_inr"], 4500)
        self.assertGreaterEqual(data["cost_reduction_factor"], 30.0)

    def test_sustainability_summary(self):
        """Test consolidated sustainability metrics summary."""
        response = self.client.get("/api/v1/sustainability/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("20.2", data["sub_phase"])
        self.assertEqual(data["total_five_year_budget_inr_crores"], 38.40)
        self.assertEqual(data["statutory_schemes_aligned_count"], 4)
        self.assertEqual(data["open_source_packages_count"], 3)
        self.assertAlmostEqual(data["total_grant_revenue_inr_crores"], 21.20, places=2)
        self.assertEqual(data["unit_cost_per_elder_inr"], 142.50)
        self.assertEqual(data["sustainability_status"], "LONG_TERM_SUSTAINABILITY_SECURED")


if __name__ == "__main__":
    unittest.main()
