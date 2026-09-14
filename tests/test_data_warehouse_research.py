"""
Unit tests for Smriti-NER Data Warehouse & Research Pipeline (Sub-Phase 18.3)
Validates HIPAA/DPDP de-identified research export pipeline (k-anonymity >= 50),
4 medical college research MOUs (GMCH, RIMS, SMIMS, NEIGRIHMS),
and 3 peer-reviewed journal manuscript drafts.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestDataWarehouseResearch(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_research_export_pipeline(self):
        """Validates research de-identification parameters and latest Parquet export batch."""
        res = client.get("/api/v1/research/export-pipeline")
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Config validation
        cfg = data["de_identification_config"]
        self.assertEqual(cfg["k_anonymity_cluster_size"], 50)
        self.assertEqual(cfg["stripped_identifiers_count"], 18)
        self.assertIn("HMAC-SHA256", cfg["salt_hash_algorithm"])
        self.assertIn("Parquet", cfg["output_format"])

        # Export job validation
        job = data["latest_export_job"]
        self.assertEqual(job["cohort_size"], 5300)
        self.assertEqual(job["districts_represented"], 16)
        self.assertEqual(job["states_represented"], 8)
        self.assertGreater(job["total_records_exported"], 40000)
        self.assertTrue(len(job["sha256_checksum"]) > 0)
        self.assertEqual(job["status"], "COMPLETED_ENCRYPTED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_medical_college_partnerships(self):
        """Validates 4 executed medical college research partnership MOUs across NER."""
        res = client.get("/api/v1/research/college-partnerships")
        self.assertEqual(res.status_code, 200)
        mous = res.json()
        self.assertEqual(len(mous), 4)

        codes = {m["institution_code"] for m in mous}
        self.assertEqual(codes, {"GMCH-GHY", "RIMS-IMP", "SMIMS-GTK", "NEIGRIHMS-SHL"})

        states = {m["state_code"] for m in mous}
        self.assertEqual(states, {"AS", "MN", "SK", "ML"})

        for m in mous:
            self.assertTrue(m["iec_protocol_number"].startswith(m["institution_code"].split("-")[0]))
            self.assertGreaterEqual(len(m["principal_investigators"]), 2)
            self.assertGreaterEqual(len(m["departments_involved"]), 1)
            self.assertEqual(m["status"], "ACTIVE_EXECUTED")
            self.assertGreaterEqual(m["validity_years"], 3)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_academic_manuscripts(self):
        """Validates the 3 peer-reviewed manuscript drafts prepared for publication."""
        res = client.get("/api/v1/research/manuscripts")
        self.assertEqual(res.status_code, 200)
        papers = res.json()
        self.assertEqual(len(papers), 3)

        paper_ids = {p["manuscript_id"] for p in papers}
        self.assertEqual(paper_ids, {"MANUSCRIPT-01-LANCET", "MANUSCRIPT-02-ALZDEM", "MANUSCRIPT-03-JMIR"})

        journals = {p["target_journal"] for p in papers}
        self.assertIn("The Lancet Regional Health - Southeast Asia", journals)
        self.assertIn("Alzheimer's & Dementia: Translational Research & Clinical Interventions (TRCI)", journals)
        self.assertIn("JMIR mHealth and uHealth", journals)

        for p in papers:
            self.assertEqual(p["submission_readiness"], "READY_FOR_SUBMISSION")
            self.assertGreaterEqual(len(p["primary_findings"]), 3)
            self.assertTrue(len(p["abstract_summary"]) > 50)
            self.assertTrue(len(p["lead_author_affiliation"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_research_pipeline_summary(self):
        """Validates consolidated summary metrics for Sub-Phase 18.3."""
        res = client.get("/api/v1/research/summary")
        self.assertEqual(res.status_code, 200)
        summary = res.json()

        self.assertEqual(summary["total_academic_mous"], 4)
        self.assertGreater(summary["anonymized_cohort_records"], 40000)
        self.assertEqual(summary["manuscripts_drafted"], 3)
        self.assertEqual(summary["k_anonymity_guaranteed"], 50)
        self.assertEqual(summary["status"], "RESEARCH_PIPELINE_OPERATIONAL")


if __name__ == "__main__":
    unittest.main()
