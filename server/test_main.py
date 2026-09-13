"""
Unit tests for Smriti-NER FastAPI Server
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "smriti-ner-server"
    assert data["disha_compliant"] is True
    assert response.headers.get("X-DISHA-Compliant") == "true"


def test_telemetry_sync_valid():
    payload = {
        "pseudo_patient_id": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "recorded_at": "2026-09-14T01:00:00Z",
        "events": [
            {
                "game_id": "dhol_pepa",
                "timestamp": "2026-09-14T01:00:15Z",
                "reaction_time_ms": 420.5,
                "accuracy_score": 0.95,
                "tremor_jitters_suppressed": 4,
                "aacb_difficulty_level": 2,
            }
        ],
        "medication_taken": True,
        "sundowning_agitation_flag": False,
        "source_channel": "PWA_CLIENT",
    }
    response = client.post("/api/v1/telemetry/sync", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["sync_status"] == "PROCESSED_AND_STORED"
    assert data["records_ingested"] == 1
    assert data["mmse_proxy_score"] >= 20.0
    assert data["adherence_rate"] == 92.0


def test_telemetry_sync_invalid_pseudo_id():
    payload = {
        "pseudo_patient_id": "short_id",  # Invalid short ID
        "recorded_at": "2026-09-14T01:00:00Z",
        "events": [],
        "medication_taken": False,
        "sundowning_agitation_flag": False,
        "source_channel": "PWA_CLIENT",
    }
    response = client.post("/api/v1/telemetry/sync", json=payload)
    assert response.status_code == 400
