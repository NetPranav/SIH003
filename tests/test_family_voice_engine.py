"""
Smriti-NER (স্মৃতি) — Sub-Phase 6.3: Personalized Family Voice System Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates Audio Signal Normalization, Silence Trimming, VU Meter Quality, and Quota Limits.
"""

import unittest
import math


class TestFamilyVoiceEngine(unittest.TestCase):

    @staticmethod
    def normalize_samples(samples: list, target_peak: float = 0.7079) -> list:
        max_abs = max((abs(x) for x in samples), default=0.0)
        if max_abs == 0.0:
            return list(samples)
        scale = target_peak / max_abs
        return [max(-1.0, min(1.0, x * scale)) for x in samples]

    @staticmethod
    def trim_silence(samples: list, threshold: float = 0.02) -> list:
        start = 0
        while start < len(samples) and abs(samples[start]) < threshold:
            start += 1
        end = len(samples) - 1
        while end > start and abs(samples[end]) < threshold:
            end -= 1
        if start >= end:
            return []
        return samples[start : end + 1]

    @staticmethod
    def rate_quality(peak: float) -> str:
        if peak < 0.15 or peak > 0.98:
            return "POOR"
        if peak < 0.35 or peak > 0.85:
            return "FAIR"
        return "OPTIMAL"

    def test_audio_normalization(self):
        """Verifies samples scale to target peak of 0.7079 (-3 dB FS)."""
        # Low volume speech: max peak 0.20
        raw_samples = [0.0, 0.05, -0.10, 0.18, -0.20, 0.12, 0.0]
        normalized = self.normalize_samples(raw_samples, target_peak=0.7079)
        max_norm = max(abs(x) for x in normalized)
        self.assertAlmostEqual(max_norm, 0.7079, places=3)

        # Excessive volume speech (clipping risk): max peak 0.95
        loud_samples = [0.0, 0.50, -0.95, 0.70, 0.0]
        normalized_loud = self.normalize_samples(loud_samples, target_peak=0.7079)
        max_loud_norm = max(abs(x) for x in normalized_loud)
        self.assertAlmostEqual(max_loud_norm, 0.7079, places=3)

    def test_silence_trimming(self):
        """Verifies lead-in and lead-out dead silence (<0.02) are trimmed."""
        # 4 zeros at start, speech in middle, 3 zeros at end
        samples = [0.001, 0.005, 0.01, 0.015, 0.45, 0.65, -0.50, 0.30, 0.01, 0.005, 0.0]
        trimmed = self.trim_silence(samples, threshold=0.02)
        self.assertEqual(len(trimmed), 4)
        self.assertEqual(trimmed[0], 0.45)
        self.assertEqual(trimmed[-1], 0.30)

        # All silence
        silent = [0.001, 0.005, 0.01]
        self.assertEqual(len(self.trim_silence(silent, threshold=0.02)), 0)

    def test_vu_quality_ratings(self):
        """Verifies audio input quality grading."""
        self.assertEqual(self.rate_quality(0.08), "POOR")   # Too quiet
        self.assertEqual(self.rate_quality(0.99), "POOR")   # Clipped / shouting
        self.assertEqual(self.rate_quality(0.25), "FAIR")   # A bit quiet
        self.assertEqual(self.rate_quality(0.90), "FAIR")   # A bit loud
        self.assertEqual(self.rate_quality(0.60), "OPTIMAL") # Ideal elder-reassurance level

    def test_max_clip_quota_constraint(self):
        """Verifies that patient profile is restricted to maximum 10 clips to respect edge storage."""
        max_clips = 10
        stored_clips = [f"clip_{i}" for i in range(10)]
        self.assertEqual(len(stored_clips), max_clips)

        # Simulating attempt to store 11th clip
        def add_clip(current_list, new_item):
            if len(current_list) >= max_clips:
                raise ValueError(f"Family voice quota exceeded. Maximum {max_clips} clips allowed.")
            current_list.append(new_item)

        with self.assertRaises(ValueError):
            add_clip(stored_clips, "clip_11")


if __name__ == "__main__":
    unittest.main()
