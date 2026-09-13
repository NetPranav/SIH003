"""
Unit Tests for DISHA 2018 Data Sanitizer & ABDM FHIR R4 Generator
SIH 2026 Problem Statement ID: 26003 | MDoNER
"""

import unittest
from server.security.disha_sanitizer import (
    scan_for_pii,
    generate_disha_pseudo_id,
    sanitize_telemetry_payload,
    build_abdm_fhir_diagnostic_report
)

class TestDishaSanitizer(unittest.TestCase):
    def test_scan_for_pii_detects_mobile(self):
        """Verify Indian mobile numbers are intercepted."""
        text = "Patient caregiver contact is +91-9435018293 in Guwahati."
        findings = scan_for_pii(text)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0][0], "INDIAN_MOBILE_NUMBER")

    def test_scan_for_pii_detects_aadhaar(self):
        """Verify 12-digit Aadhaar patterns are intercepted."""
        text = "Aadhaar verified: 5432 9876 1234"
        findings = scan_for_pii(text)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0][0], "AADHAAR_CARD_NUMBER")

    def test_scan_for_pii_clean(self):
        """Verify clean telemetry strings produce zero false positives."""
        text = "Game dhol_pepa reaction_time 1420ms stability 0.88 accuracy 0.95"
        findings = scan_for_pii(text)
        self.assertEqual(len(findings), 0)

    def test_generate_disha_pseudo_id(self):
        """Verify pseudo identifiers are deterministic 64-character SHA-256 strings."""
        id1 = generate_disha_pseudo_id("KAMRUP_PATIENT_01", "Assam")
        id2 = generate_disha_pseudo_id("KAMRUP_PATIENT_01", "Assam")
        id3 = generate_disha_pseudo_id("KAMRUP_PATIENT_02", "Assam")

        self.assertEqual(len(id1), 64)
        self.assertEqual(id1, id2) # Deterministic
        self.assertNotEqual(id1, id3) # Unique across patients
        self.assertTrue(all(c in "0123456789abcdef" for c in id1))

    def test_sanitize_telemetry_payload_valid(self):
        """Verify valid payloads pass without error."""
        valid_id = "a" * 64
        payload = {
            "patient_pseudo_id": valid_id,
            "game_id": "dhol_pepa_rhythm",
            "accuracy": 0.88
        }
        res = sanitize_telemetry_payload(payload)
        self.assertEqual(res["patient_pseudo_id"], valid_id)

    def test_sanitize_telemetry_payload_rejects_pii(self):
        """Verify payload containing raw phone number triggers ValueError."""
        valid_id = "b" * 64
        payload = {
            "patient_pseudo_id": valid_id,
            "notes": "Call Dr. Bora at 9435018293 if patient is agitated"
        }
        with self.assertRaises(ValueError) as ctx:
            sanitize_telemetry_payload(payload)
        self.assertIn("DISHA 2018 Policy Violation", str(ctx.exception))

    def test_build_abdm_fhir_diagnostic_report(self):
        """Verify ABDM FHIR R4 DiagnosticReport structure and LOINC codes."""
        report = build_abdm_fhir_diagnostic_report(
            patient_pseudo_id="c" * 64,
            abha_id="91-4567-8901-2345",
            mmse_score=24.5,
            clinical_tier="mci",
            domain_scores={"visuospatial": 8.5, "orientation": 9.0, "recall": 2.5, "executive": 7.5},
            trailing_velocity=-0.15
        )
        self.assertEqual(report["resourceType"], "DiagnosticReport")
        self.assertEqual(report["subject"]["reference"], "Patient/91-4567-8901-2345")
        self.assertEqual(report["code"]["coding"][0]["system"], "http://loinc.org")

        # Verify contained Observation
        obs = report["contained"][0]
        self.assertEqual(obs["resourceType"], "Observation")
        self.assertEqual(obs["code"]["coding"][0]["code"], "72106-8")
        self.assertEqual(obs["valueQuantity"]["value"], 24.5)

if __name__ == "__main__":
    unittest.main()
