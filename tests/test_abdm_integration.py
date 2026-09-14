"""
Unit tests for Smriti-NER ABDM / ABHA Integration
Sub-Phase 12.1: ABHA Linking (M1), FHIR R4 Diagnostic Bundle Push (M2), and Consent Management (M3)
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app, ABDM_CONSENT_REGISTRY
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestAbdmIntegration(unittest.TestCase):
    def setUp(self):
        """Resets baseline ABDM consent registry fixture."""
        if HAS_FASTAPI:
            ABDM_CONSENT_REGISTRY.clear()
            ABDM_CONSENT_REGISTRY["art_dmo_kamrup_01"] = {
                "consent_id": "art_dmo_kamrup_01",
                "patient_abha_id": "91-4821-9034-1289",
                "requester_name": "Dr. Hemanta Phukan, MD",
                "requester_organization": "Guwahati Medical College & Hospital (GMCH)",
                "purpose": "CLINICAL_CONSULTATION",
                "hi_types": ["DiagnosticReport", "Observation"],
                "status": "GRANTED",
                "granted_at": "2026-09-14T10:05:00Z",
                "revoked_at": None,
            }

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_link_abha_success(self):
        """Tests successful ABHA ID linking with valid OTP."""
        payload = {
            "patient_id": "p_anand_01",
            "aadhaar_or_mobile": "9876543210",
            "otp": "123456",
            "patient_name": "Anand Baruah",
            "state": "Assam"
        }
        res = client.post("/api/v1/abdm/link-abha", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["patient_id"], "p_anand_01")
        self.assertEqual(data["status"], "LINKED_SUCCESS")
        self.assertTrue(data["abha_number"].startswith("91-"))
        self.assertTrue(data["abha_address"].endswith("@abdm"))
        self.assertEqual(data["verification_status"], "VERIFIED_AADHAAR_OTP")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_link_abha_invalid_otp(self):
        """Tests rejected ABHA ID linking with bad OTP."""
        payload = {
            "patient_id": "p_anand_01",
            "aadhaar_or_mobile": "9876543210",
            "otp": "000000",
            "patient_name": "Anand Baruah",
            "state": "Assam"
        }
        res = client.post("/api/v1/abdm/link-abha", json=payload)
        self.assertEqual(res.status_code, 400)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_fhir_diagnostic_bundle_push(self):
        """Tests FHIR R4 Bundle generation with Patient, MMSE Obs, Adherence Obs, and DiagnosticReport."""
        payload = {
            "patient_id": "p_anand_01",
            "abha_number": "91-4821-9034-1289",
            "patient_name": "Anand Baruah",
            "mmse_score": 23.4,
            "adherence_percentage": 93.4,
            "clinical_notes": "Mild Cognitive Impairment (MCI) stable over 180-day baseline."
        }
        res = client.post("/api/v1/abdm/fhir-diagnostic-push", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["resource_type"], "Bundle")
        self.assertEqual(data["entries_count"], 4)
        self.assertEqual(data["health_locker_status"], "STORED_IN_ABDM_LOCKER")
        self.assertTrue(data["disha_encrypted"])

        bundle = data["fhir_bundle"]
        self.assertEqual(bundle["resourceType"], "Bundle")
        self.assertEqual(len(bundle["entry"]), 4)
        resource_types = [e["resource"]["resourceType"] for e in bundle["entry"]]
        self.assertIn("Patient", resource_types)
        self.assertIn("Observation", resource_types)
        self.assertIn("DiagnosticReport", resource_types)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_consent_artifact_lifecycle(self):
        """Tests granting and revoking consent artifacts under DISHA 2018 patient control."""
        # 1. Grant a new consent request
        grant_payload = {
            "consent_id": "art_test_02",
            "patient_abha_id": "91-4821-9034-1289",
            "action": "GRANT"
        }
        res_grant = client.post("/api/v1/abdm/consent/update-status", json=grant_payload)
        self.assertEqual(res_grant.status_code, 200)
        grant_data = res_grant.json()
        self.assertEqual(grant_data["status"], "GRANTED")
        self.assertIsNotNone(grant_data["granted_at"])

        # 2. Revoke the consent request
        revoke_payload = {
            "consent_id": "art_test_02",
            "patient_abha_id": "91-4821-9034-1289",
            "action": "REVOKE"
        }
        res_revoke = client.post("/api/v1/abdm/consent/update-status", json=revoke_payload)
        self.assertEqual(res_revoke.status_code, 200)
        revoke_data = res_revoke.json()
        self.assertEqual(revoke_data["status"], "REVOKED")
        self.assertIsNotNone(revoke_data["revoked_at"])

        # 3. Query all consents for this patient
        list_res = client.get("/api/v1/abdm/consent/patient/91-4821-9034-1289")
        self.assertEqual(list_res.status_code, 200)
        list_data = list_res.json()
        self.assertGreaterEqual(len(list_data), 2)


if __name__ == "__main__":
    unittest.main()
