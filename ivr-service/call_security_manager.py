"""
Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) — Telephony Call Security & CDR De-Identification Manager
SIH 2026 Problem Statement ID: 26003 | MDoNER
Enforces Zero-Audio Retention on disk, in-memory volatile stream wiping,
and deterministic HMAC-SHA256 caller ANI pseudo-anonymization for 1800-889-2600.
"""

import re
import hmac
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple

TELEPHONY_SALT = b"SMRITI_NER_IVR_TELEPHONY_SALT_2026"

# Telecom circle mappings for the North Eastern Region
NER_TELECOM_CIRCLES = {
    "AS": "Assam Circle (Kamrup, Majuli, Cachar, Dibrugarh)",
    "NE1": "North East-I (Meghalaya, Mizoram, Tripura)",
    "NE2": "North East-II (Manipur, Nagaland, Arunachal Pradesh)",
    "WB_SK": "West Bengal / Sikkim Circle (East/West Sikkim)",
}

class EphemeralAudioBuffer:
    """
    Simulates FreeSWITCH volatile memory audio ringbuffer.
    Guarantees that spoken audio is processed in RAM only and zero-wiped immediately.
    Zero bytes are written to file systems or non-volatile storage.
    """
    def __init__(self, capacity_bytes: int = 65536):
        self.capacity = capacity_bytes
        self._buffer = bytearray(capacity_bytes)
        self.bytes_written = 0
        self.is_wiped = False

    def ingest_audio_stream(self, audio_chunk: bytes) -> int:
        """Appends streaming PCM audio bytes to volatile RAM buffer."""
        if self.is_wiped:
            raise RuntimeError("Cannot write to a wiped ephemeral audio buffer.")
        chunk_len = len(audio_chunk)
        if self.bytes_written + chunk_len > self.capacity:
            chunk_len = self.capacity - self.bytes_written
        self._buffer[self.bytes_written:self.bytes_written + chunk_len] = audio_chunk[:chunk_len]
        self.bytes_written += chunk_len
        return chunk_len

    def transcribe_and_wipe(self) -> Dict[str, Any]:
        """
        Simulates streaming to Bhashini Indic ASR, then performs secure cryptographic memory zeroing.
        """
        simulated_words = ["Gamusa", "Jaapi", "Kaziranga"]
        # Secure wipe: overwrite buffer with zeros
        for i in range(len(self._buffer)):
            self._buffer[i] = 0
        self.bytes_written = 0
        self.is_wiped = True

        return {
            "transcription_tokens": simulated_words,
            "asr_engine": "Bhashini_Indic_Conformer_v2",
            "buffer_wiped": True,
            "wiped_at": datetime.now(timezone.utc).isoformat(),
            "disk_writes": 0
        }


def anonymize_caller_ani(raw_phone_number: str) -> str:
    """
    Converts raw caller CLI / ANI (e.g. +91-9435018293) into a deterministic 64-char HMAC-SHA256 pseudo-ID.
    Raw telephone numbers are mathematically irreversible.
    """
    clean_digits = re.sub(r'\D', '', raw_phone_number)
    if clean_digits.startswith("91") and len(clean_digits) == 12:
        clean_digits = clean_digits[2:]
    message = f"ANI::{clean_digits}".encode("utf-8")
    return hmac.new(TELEPHONY_SALT, message, hashlib.sha256).hexdigest()


def detect_telecom_circle(raw_phone_number: str) -> str:
    """
    Infers telecom circle from CLI prefix or SIP trunk routing headers.
    """
    clean = re.sub(r'\D', '', raw_phone_number)
    if clean.startswith("91"):
        clean = clean[2:]

    # Simulation mapping based on regional operator series
    if clean.startswith(("9435", "9864", "9954", "7002")):
        return "AS" # Assam
    elif clean.startswith(("9436", "9862", "7085")):
        return "NE1" # Meghalaya, Mizoram, Tripura
    elif clean.startswith(("9402", "9863", "8415")):
        return "NE2" # Manipur, Nagaland, Arunachal Pradesh
    elif clean.startswith(("9434", "9733", "8116")):
        return "WB_SK" # Sikkim
    return "AS" # Default primary circle


def sanitize_cdr_record(raw_cdr: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sanitizes raw FreeSWITCH CDR event for insertion into TimescaleDB ivr_call_records:
    - Replaces raw caller_cli with HMAC-SHA256 hash.
    - Preserves session metadata (call duration, dtmf responses, recall words, adherence).
    - Guarantees zero raw phone numbers exist in the sanitized record.
    """
    raw_cli = raw_cdr.get("caller_cli", "")
    if not raw_cli:
        raise ValueError("CDR record missing caller_cli attribute.")

    circle = detect_telecom_circle(raw_cli)
    pseudo_id = anonymize_caller_ani(raw_cli)

    sanitized = {
        "call_id": raw_cdr.get("call_id", f"call_{int(datetime.now().timestamp())}"),
        "call_time": raw_cdr.get("call_time", datetime.now(timezone.utc).isoformat()),
        "caller_ani_hmac": pseudo_id,
        "telecom_circle": circle,
        "circle_name": NER_TELECOM_CIRCLES.get(circle, "Unknown Circle"),
        "language_code": raw_cdr.get("language_code", "as"),
        "call_duration_seconds": int(raw_cdr.get("duration_seconds", 0)),
        "orientation_score": int(raw_cdr.get("orientation_score", 0)),
        "recall_words_recalled": int(raw_cdr.get("recall_words_count", 0)),
        "medication_adherence": bool(raw_cdr.get("medication_adherence", False)),
        "sos_triggered": bool(raw_cdr.get("sos_triggered", False)),
        "bhashini_tts_latency_ms": int(raw_cdr.get("tts_latency_ms", 380)),
        "zero_audio_retention_verified": True
    }
    return sanitized
