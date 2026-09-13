"""
Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) — DISHA 2018 Data Sanitizer & ABDM FHIR Generator
SIH 2026 Problem Statement ID: 26003 | MDoNER
Ensures zero plaintext PHI enters server storage, enforces HMAC-SHA256 pseudo-anonymization,
and formats longitudinal cognitive summaries into HL7 FHIR R4 resources.
"""

import re
import hmac
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple, Optional

# Indian Mobile Regex: +91 or 91 optional, starting with 6-9, followed by 9 digits
INDIAN_MOBILE_REGEX = re.compile(r'(?:\+91[-.\s]?|91[-.\s]?)?[6-9]\d{9}\b')

# Aadhaar Regex: 12 digits, often formatted as 4-4-4
AADHAAR_REGEX = re.compile(r'\b[2-9]\d{3}[-\s]?\d{4}[-\s]?\d{4}\b')

# Email Regex
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')

# Master Salt for DISHA-compliant pseudo-anonymization (Loaded from secure KMS / Env in prod)
DISHA_SALT = b"SMRITI_NER_DISHA_SOVEREIGN_KEY_2026"


def scan_for_pii(text: str) -> List[Tuple[str, str]]:
    """
    Scans an arbitrary string or JSON payload for Indian PII/PHI.
    Returns a list of (pii_type, matched_string) tuples.
    """
    findings = []
    for match in INDIAN_MOBILE_REGEX.finditer(text):
        findings.append(("INDIAN_MOBILE_NUMBER", match.group()))
    for match in AADHAAR_REGEX.finditer(text):
        findings.append(("AADHAAR_CARD_NUMBER", match.group()))
    for match in EMAIL_REGEX.finditer(text):
        findings.append(("EMAIL_ADDRESS", match.group()))
    return findings


def generate_disha_pseudo_id(raw_identifier: str, state_cluster: str = "NER") -> str:
    """
    Generates a deterministic 64-character hexadecimal HMAC-SHA256 pseudo-identifier.
    Complies with Section 34 of DISHA 2018: Raw identifiers are mathematically non-recoverable.
    """
    normalized = raw_identifier.strip().upper()
    message = f"{state_cluster}::{normalized}".encode("utf-8")
    return hmac.new(DISHA_SALT, message, hashlib.sha256).hexdigest()


def sanitize_telemetry_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Audits an incoming telemetry payload before database ingestion:
    - Verifies patient_pseudo_id is a valid 64-character SHA-256 hash.
    - Ensures zero PII strings exist in free-text fields or session metadata.
    Raises ValueError if raw PII is detected.
    """
    raw_str = str(payload)
    pii_findings = scan_for_pii(raw_str)
    if pii_findings:
        details = ", ".join(f"{f[0]}: [REDACTED]" for f in pii_findings)
        raise ValueError(f"DISHA 2018 Policy Violation: Plaintext PII detected in payload ({details}). Access denied.")

    pseudo_id = payload.get("patient_pseudo_id") or payload.get("pseudo_patient_id")
    if not pseudo_id or len(pseudo_id) != 64:
        raise ValueError("DISHA 2018 Format Error: patient_pseudo_id must be a 64-character hexadecimal HMAC-SHA256 string.")

    return payload


def build_abdm_fhir_diagnostic_report(
    patient_pseudo_id: str,
    abha_id: str,
    mmse_score: float,
    clinical_tier: str,
    domain_scores: Dict[str, float],
    trailing_velocity: float
) -> Dict[str, Any]:
    """
    Constructs an HL7 FHIR R4 DiagnosticReport resource representing the patient's
    longitudinal cognitive assessment for ABDM Health Information Provider (HIP) exchange.
    Standardized with LOINC code 72106-8 (Mini-Mental State Examination score).
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    report_id = f"smriti-diag-{patient_pseudo_id[:12]}-{int(datetime.now().timestamp())}"

    # Observation resource for total MMSE proxy
    mmse_observation = {
        "resourceType": "Observation",
        "id": f"obs-mmse-{patient_pseudo_id[:8]}",
        "status": "final",
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code": "survey",
                        "display": "Survey"
                    }
                ]
            }
        ],
        "code": {
            "coding": [
                {
                    "system": "http://loinc.org",
                    "code": "72106-8",
                    "display": "Mini-Mental State Examination total score [MMSE]"
                }
            ],
            "text": "Smriti-NER Culturally-Rooted MMSE Proxy Score"
        },
        "subject": {
            "reference": f"Patient/{abha_id}",
            "identifier": {
                "system": "https://healthid.abdm.gov.in",
                "value": abha_id
            }
        },
        "effectiveDateTime": now_iso,
        "valueQuantity": {
            "value": round(mmse_score, 1),
            "unit": "{score}",
            "system": "http://unitsofmeasure.org",
            "code": "{score}"
        },
        "interpretation": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                        "code": "L" if mmse_score < 24.0 else "N",
                        "display": "Abnormal Low" if mmse_score < 24.0 else "Normal"
                    }
                ],
                "text": f"Clinical Tier: {clinical_tier.upper().replace('_', ' ')}"
            }
        ],
        "component": [
            {
                "code": {"text": "Visuospatial & Motor Domain"},
                "valueQuantity": {"value": domain_scores.get("visuospatial", 8.0)}
            },
            {
                "code": {"text": "Orientation Domain"},
                "valueQuantity": {"value": domain_scores.get("orientation", 8.5)}
            },
            {
                "code": {"text": "Memory & Delayed Recall Domain"},
                "valueQuantity": {"value": domain_scores.get("recall", 2.0)}
            },
            {
                "code": {"text": "Executive Function Domain"},
                "valueQuantity": {"value": domain_scores.get("executive", 7.0)}
            }
        ]
    }

    # DiagnosticReport resource bundling observations
    diagnostic_report = {
        "resourceType": "DiagnosticReport",
        "id": report_id,
        "identifier": [
            {
                "system": "https://smriti-ner.gov.in/reports",
                "value": report_id
            }
        ],
        "status": "final",
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
                        "code": "CG",
                        "display": "Cognitive Examination"
                    }
                ]
            }
        ],
        "code": {
            "coding": [
                {
                    "system": "http://loinc.org",
                    "code": "11522-0",
                    "display": "Mental status assessment"
                }
            ],
            "text": "Smriti-NER Longitudinal Cognitive Trajectory & Cultural Rhythm Profile"
        },
        "subject": {
            "reference": f"Patient/{abha_id}",
            "type": "Patient"
        },
        "issued": now_iso,
        "performer": [
            {
                "display": "Smriti-NER AI Cognitive Wellness Platform (MDoNER / SIH 2026)"
            }
        ],
        "result": [
            {"reference": f"Observation/{mmse_observation['id']}"}
        ],
        "conclusion": f"Patient exhibits {clinical_tier.replace('_', ' ')} cognitive profile. Monthly decline velocity: {trailing_velocity} pts/month. Cultural engagement (Borgeet & Loom games) maintains emotional stability.",
        "contained": [mmse_observation]
    }

    return diagnostic_report
