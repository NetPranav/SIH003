"""
Unit tests for Smriti-NER Security & Privacy Audit
Sub-Phase 13.3: OWASP Top 10 API pentest, AES-256-GCM / TLS 1.3 cryptographic compliance,
PHI isolation scan (DISHA 2018 / DPDP 2023), and differential privacy federated learning verification.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestSecurityAudit(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_owasp_pentest_results(self):
        """Validates OWASP Top 10 API Security results: 10 executed, 0 critical, 0 high findings."""
        res = client.get("/api/v1/security/owasp-pentest")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 10)
        for vuln in data:
            self.assertEqual(vuln["status"], "VERIFIED_SECURE")
            self.assertIn(vuln["severity"], ["INFORMATIONAL", "LOW"])
            self.assertTrue(len(vuln["mitigation"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_encryption_audit_verification(self):
        """Validates encryption compliance: AES-256-GCM rest, TLS 1.3 transit, hardware keystore, and SPKI pinning."""
        res = client.get("/api/v1/security/encryption-audit")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("AES-256-GCM", data["storage_at_rest_cipher"])
        self.assertEqual(data["tls_version"], "TLS 1.3")
        self.assertTrue(data["certificate_pinning_active"])
        self.assertTrue(data["keystore_hardware_backed"])
        self.assertEqual(data["status"], "COMPLIANT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_phi_isolation_scan_clean(self):
        """Validates telemetry scan when data uses pseudo-IDs without sensitive PII (DISHA compliant)."""
        payload = {
            "payload_id": "telemetry-batch-401",
            "data": {
                "pseudo_id": "PID-MUM-9921",
                "session_timestamp": 1789324000,
                "recall_accuracy": 0.88,
                "reaction_time_ms": 640
            }
        }
        res = client.post("/api/v1/security/phi-isolation-scan", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["pii_detected"])
        self.assertEqual(data["aadhaar_matches_count"], 0)
        self.assertEqual(data["phone_matches_count"], 0)
        self.assertTrue(data["pseudo_id_used"])
        self.assertEqual(data["status"], "CLEAN_DISHA_COMPLIANT")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_phi_isolation_scan_leakage_detected(self):
        """Validates that Aadhaar and phone numbers in telemetry payloads are flagged immediately."""
        leak_payload = {
            "payload_id": "telemetry-batch-bad",
            "data": {
                "patient_name": "Ramesh Chandra",
                "aadhaar_number": "5421 9876 1234",
                "mobile_contact": "9876543210",
                "score": 18
            }
        }
        res = client.post("/api/v1/security/phi-isolation-scan", json=leak_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["pii_detected"])
        self.assertGreaterEqual(data["aadhaar_matches_count"], 1)
        self.assertGreaterEqual(data["phone_matches_count"], 1)
        self.assertEqual(data["status"], "LEAKAGE_DETECTED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_federated_learning_privacy(self):
        """Validates FL differential privacy: epsilon <= 1.0 and zero raw biometric/audio exports."""
        res = client.get("/api/v1/security/federated-privacy")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertLessEqual(data["privacy_budget_epsilon"], data["max_epsilon_threshold"])
        self.assertFalse(data["contains_raw_audio"])
        self.assertFalse(data["contains_raw_keystrokes"])
        self.assertTrue(data["only_weight_tensors"])
        self.assertTrue(data["differential_privacy_applied"])
        self.assertEqual(data["status"], "DP_VERIFIED")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_security_audit_summary(self):
        """Validates overall Sub-Phase 13.3 Security & Privacy audit summary certification."""
        res = client.get("/api/v1/security/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["critical_vulnerabilities_count"], 0)
        self.assertEqual(data["high_vulnerabilities_count"], 0)
        self.assertTrue(data["encryption_audit_passed"])
        self.assertTrue(data["phi_isolation_passed"])
        self.assertTrue(data["federated_privacy_passed"])
        self.assertTrue(data["disha_dpdp_compliant"])


if __name__ == "__main__":
    unittest.main()
