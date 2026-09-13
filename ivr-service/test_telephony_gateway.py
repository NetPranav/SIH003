"""
Unit tests for IVR Telephony Gateway
Compatible with both pytest (CI/CD) and unittest (zero-dependency local test runner)
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from telephony_gateway import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestTelephonyGateway(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ivr_health(self):
        response = client.get("/ivr/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "operational")
        self.assertEqual(data["sip_trunk"], "BSNL-NER-PRIMARY")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_missed_call_webhook(self):
        payload = {
            "caller_cli": "+919435018293",
            "toll_free_dialed": "18008892600",
            "telecom_circle": "AS",
        }
        response = client.post("/ivr/webhook/missed-call", json=payload)
        self.assertEqual(response.status_code, 202)
        data = response.json()
        self.assertEqual(data["action"], "OUTBOUND_CALLBACK_SCHEDULED")
        self.assertEqual(len(data["pseudo_id"]), 64)  # Valid SHA-256 string
        self.assertEqual(data["target_circle"], "AS")


if __name__ == "__main__":
    unittest.main()
