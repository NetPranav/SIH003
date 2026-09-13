"""
Unit tests for IVR Telephony Gateway
"""

import pytest
from fastapi.testclient import TestClient
from telephony_gateway import app

client = TestClient(app)


def test_ivr_health():
    response = client.get("/ivr/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["sip_trunk"] == "BSNL-NER-PRIMARY"


def test_missed_call_webhook():
    payload = {
        "caller_cli": "+919435018293",
        "toll_free_dialed": "18008892600",
        "telecom_circle": "AS",
    }
    response = client.post("/ivr/webhook/missed-call", json=payload)
    assert response.status_code == 202
    data = response.json()
    assert data["action"] == "OUTBOUND_CALLBACK_SCHEDULED"
    assert len(data["pseudo_id"]) == 64  # Valid SHA-256 string
    assert data["target_circle"] == "AS"
