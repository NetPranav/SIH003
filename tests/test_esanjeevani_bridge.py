"""
Unit tests for Smriti-NER e-Sanjeevani Teleconsultation Bridge
Sub-Phase 12.3: Teleconsult API Handshake, Neurological Referral Dossier, and Trigger Escalation
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, ESANJEEVANI_REFERRAL_REGISTRY
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestESanjeevaniBridge(unittest.TestCase):
    def setUp(self):
        """Cleans test referral registry."""
        if HAS_FASTAPI:
            ESANJEEVANI_REFERRAL_REGISTRY.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_esanjeevani_handshake_success(self):
        """Tests successful HWC center handshake and session token issuance."""
        payload = {
            "hwc_center_code": "AS_KAM_HWC_1042",
            "hwc_name": "Sonapur Ayushman Bharat HWC",
            "district": "Kamrup Metropolitan",
            "state": "Assam",
            "cho_or_asha_id": "asha_anita_01",
            "auth_secret": "esanj_sec_token_valid_2026"
        }
        res = client.post("/api/v1/esanjeevani/handshake", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ACTIVE")
        self.assertEqual(data["hwc_center_code"], "AS_KAM_HWC_1042")
        self.assertIn("GMCH", data["specialist_hub"])
        self.assertTrue(data["token"].startswith("esanj_tok_"))

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_esanjeevani_handshake_unauthorized(self):
        """Tests invalid HWC credentials rejected with 401."""
        payload = {
            "hwc_center_code": "INVALID_CODE",
            "hwc_name": "Unknown",
            "district": "Unknown",
            "state": "Assam",
            "cho_or_asha_id": "none",
            "auth_secret": "short"
        }
        res = client.post("/api/v1/esanjeevani/handshake", json=payload)
        self.assertEqual(res.status_code, 401)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_compile_referral_dossier_critical_mmse_drop(self):
        """Tests automated referral dossier compilation upon >3 pt MMSE drop."""
        payload = {
            "patient_id": "p_anand_01",
            "abha_number": "91-4821-9034-1289",
            "patient_name": "Anand Baruah",
            "age": 72,
            "gender": "M",
            "baseline_mmse": 24.0,
            "current_mmse": 20.8,  # -3.2 pts drop
            "adherence_30d_pct": 74.2,
            "sundowning_episodes_count": 5
        }
        res = client.post("/api/v1/esanjeevani/referral-package", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["referral_urgency"], "HIGH_PRIORITY")
        self.assertEqual(data["trigger_reason"], "CRITICAL_MMSE_DROP_OVER_3_POINTS")
        self.assertEqual(data["clinical_summary"]["delta_points"], -3.2)
        self.assertGreaterEqual(len(data["suggested_questions_for_specialist"]), 3)

        # Retrieve via GET
        get_res = client.get(f"/api/v1/esanjeevani/referrals/{data['referral_id']}")
        self.assertEqual(get_res.status_code, 200)
        get_data = get_res.json()
        self.assertEqual(get_data["referral_id"], data["referral_id"])

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_compile_referral_dossier_concurrent_critical(self):
        """Tests CRITICAL escalation when both MMSE drops >3 pts AND adherence fails (<70%)."""
        payload = {
            "patient_id": "p_anand_01",
            "abha_number": "91-4821-9034-1289",
            "patient_name": "Anand Baruah",
            "age": 72,
            "gender": "M",
            "baseline_mmse": 24.0,
            "current_mmse": 20.5,  # -3.5 pts
            "adherence_30d_pct": 62.0,  # < 70%
            "sundowning_episodes_count": 6
        }
        res = client.post("/api/v1/esanjeevani/referral-package", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["referral_urgency"], "CRITICAL")
        self.assertEqual(data["trigger_reason"], "CONCURRENT_CRITICAL_MMSE_DROP_AND_ADHERENCE_FAILURE")


if __name__ == "__main__":
    unittest.main()
