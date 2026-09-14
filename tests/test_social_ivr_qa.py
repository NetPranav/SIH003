"""
Unit tests for Smriti-NER Social & IVR Feature QA and Milestone M13 Sign-off
Sub-Phase 13.4: Grandchild Connect E2E testing, IVR reliability across 3 telecom circles (2G Edge simulation),
Dual-gate consent verification & PII redaction, and Milestone M13 QA Gate Certification.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestSocialIvrQA(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_grandchild_connect_e2e_loop_compliant(self):
        """Validates successful end-to-end clue recording, elder play loop, and reaction dispatch (<= 10s)."""
        payload = {
            "patient_id": "pat-guw-109",
            "grandchild_name": "Ananya",
            "duration_seconds": 6.8,
            "target_game": "BIHU_LOOM"
        }
        res = client.post("/api/v1/qa/social/grandchild-connect-e2e", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["duration_compliant"])
        self.assertEqual(data["elder_response_status"], "COMPLETED")
        self.assertEqual(data["elder_reaction_badge"], "CELEBRATION_STAR")
        self.assertTrue(data["e2e_loop_completed"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_grandchild_connect_e2e_loop_duration_exceeded(self):
        """Validates that clue duration > 10.0 seconds is rejected to prevent cognitive fatigue."""
        payload = {
            "patient_id": "pat-guw-109",
            "grandchild_name": "Ananya",
            "duration_seconds": 12.5,
            "target_game": "BIHU_LOOM"
        }
        res = client.post("/api/v1/qa/social/grandchild-connect-e2e", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["duration_compliant"])
        self.assertEqual(data["elder_response_status"], "ABORTED")
        self.assertFalse(data["e2e_loop_completed"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ivr_telecom_reliability_across_circles(self):
        """Validates IVR stability across 3 telecom circles with minimum MOS >= 3.6 under 2G Edge conditions."""
        res = client.get("/api/v1/qa/ivr/telecom-reliability")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["circles_tested"], 3)
        self.assertTrue(data["all_circles_passed"])
        self.assertGreaterEqual(data["min_mos_score_observed"], data["target_mos_threshold"])
        # Check NE1 circle specifically for DTMF fallback
        ne1 = next(c for c in data["results"] if c["circle_id"] == "CIRCLE_NE1")
        self.assertTrue(ne1["dtmf_fallback_engaged"])
        self.assertEqual(ne1["call_completion_status"], "DEGRADED_PASS")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_social_consent_verification_clean_flow(self):
        """Validates clean folkloric reminiscence with confirmed dual-gate consent."""
        payload = {
            "patient_id": "pat-guw-109",
            "caregiver_id": "cg-guw-001",
            "scopes": ["FAMILY_ONLY", "COMMUNITY_CIRCLE"],
            "elder_assent_confirmed": True,
            "sample_content": "We sang Bihu songs near the Brahmaputra banks during Bohag."
        }
        res = client.post("/api/v1/qa/social/consent-verification", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["dual_gate_consent_captured"])
        self.assertFalse(data["pii_scrubbing_verified"])
        self.assertEqual(len(data["detected_pii_flags"]), 0)
        self.assertTrue(data["clean_item_allowed"])
        self.assertEqual(data["status"], "AUDIT_PASSED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_social_consent_verification_pii_blocking(self):
        """Validates that items with phone numbers, Aadhaar, or medications are blocked."""
        payload = {
            "patient_id": "pat-guw-109",
            "caregiver_id": "cg-guw-001",
            "scopes": ["FAMILY_ONLY"],
            "elder_assent_confirmed": True,
            "sample_content": "Grandpa takes Donepezil, call mobile 9876543210 Aadhaar 1122 3344 5566."
        }
        res = client.post("/api/v1/qa/social/consent-verification", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["pii_scrubbing_verified"])
        self.assertIn("DETECTED_PHONE_NUMBER", data["detected_pii_flags"])
        self.assertIn("DETECTED_AADHAAR_NUMBER", data["detected_pii_flags"])
        self.assertIn("DETECTED_PRESCRIPTION_DRUG", data["detected_pii_flags"])
        self.assertFalse(data["clean_item_allowed"])
        self.assertEqual(data["status"], "FLAGGED_OR_RESTRICTED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_milestone_m13_certification_signoff(self):
        """Validates Milestone M13 official sign-off certification (coverage, a11y, pentest, social/IVR)."""
        res = client.get("/api/v1/qa/milestone-m13/certification")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["milestone_id"], "M13")
        self.assertEqual(data["status"], "PASSED_AND_SIGNED_OFF")
        self.assertGreaterEqual(data["coverage_percent"], 90.0)
        self.assertEqual(data["wcag_accessibility_score"], 100)
        self.assertEqual(data["axe_core_violations_count"], 0)
        self.assertEqual(data["critical_vulnerabilities_count"], 0)
        self.assertEqual(data["high_vulnerabilities_count"], 0)
        self.assertTrue(data["grandchild_connect_verified"])
        self.assertTrue(data["ivr_multi_circle_reliability_verified"])
        self.assertTrue(data["social_consent_protection_verified"])


if __name__ == "__main__":
    unittest.main()
