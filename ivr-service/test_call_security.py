"""
Unit Tests for Telephony Call Security & Zero-Audio Retention
SIH 2026 Problem Statement ID: 26003 | MDoNER
"""

import os
import sys
import unittest

# Ensure current folder is in path for module import
sys.path.insert(0, os.path.dirname(__file__))

from call_security_manager import (
    anonymize_caller_ani,
    detect_telecom_circle,
    sanitize_cdr_record,
    EphemeralAudioBuffer
)

class TestCallSecurityManager(unittest.TestCase):
    def test_anonymize_caller_ani(self):
        """Verify phone number is converted to 64-char hexadecimal HMAC-SHA256 string."""
        raw_phone = "+91-9435018293"
        pseudo_id = anonymize_caller_ani(raw_phone)
        self.assertEqual(len(pseudo_id), 64)
        self.assertTrue(all(c in "0123456789abcdef" for c in pseudo_id))

        # Deterministic check
        self.assertEqual(pseudo_id, anonymize_caller_ani("9435018293"))
        self.assertEqual(pseudo_id, anonymize_caller_ani("+919435018293"))

    def test_detect_telecom_circle(self):
        """Verify circle detection across the 8 NER states."""
        self.assertEqual(detect_telecom_circle("9435018293"), "AS") # Assam
        self.assertEqual(detect_telecom_circle("9436123456"), "NE1") # Meghalaya/Mizoram/Tripura
        self.assertEqual(detect_telecom_circle("9402987654"), "NE2") # Manipur/Nagaland/Arunachal
        self.assertEqual(detect_telecom_circle("9434055555"), "WB_SK") # Sikkim

    def test_ephemeral_audio_buffer_wiping(self):
        """Verify spoken audio is processed in RAM only and wiped to zero bytes."""
        buffer = EphemeralAudioBuffer(capacity_bytes=1024)
        sample_audio = b"\x1f\x2a\x3b\x4c" * 64
        written = buffer.ingest_audio_stream(sample_audio)
        self.assertEqual(written, len(sample_audio))
        self.assertFalse(buffer.is_wiped)

        result = buffer.transcribe_and_wipe()
        self.assertTrue(result["buffer_wiped"])
        self.assertEqual(result["disk_writes"], 0)
        self.assertEqual(len(result["transcription_tokens"]), 3)

        # Confirm all bytes in memory are now zero
        self.assertTrue(all(b == 0 for b in buffer._buffer))

        # Verify writing to wiped buffer raises RuntimeError
        with self.assertRaises(RuntimeError):
            buffer.ingest_audio_stream(b"more_audio")

    def test_sanitize_cdr_record(self):
        """Verify raw phone numbers are replaced with HMAC-SHA256 hashes."""
        raw_cdr = {
            "call_id": "call_test_01",
            "caller_cli": "+91-9435018293",
            "duration_seconds": 125,
            "orientation_score": 1,
            "recall_words_count": 3,
            "medication_adherence": True,
            "sos_triggered": False
        }
        sanitized = sanitize_cdr_record(raw_cdr)
        self.assertEqual(sanitized["call_id"], "call_test_01")
        self.assertEqual(len(sanitized["caller_ani_hmac"]), 64)
        self.assertNotIn("+91-9435018293", str(sanitized))
        self.assertNotIn("9435018293", str(sanitized))
        self.assertEqual(sanitized["telecom_circle"], "AS")
        self.assertTrue(sanitized["zero_audio_retention_verified"])

    def test_sanitize_cdr_missing_cli(self):
        """Verify missing caller_cli raises ValueError."""
        with self.assertRaises(ValueError):
            sanitize_cdr_record({"duration_seconds": 60})

if __name__ == "__main__":
    unittest.main()
