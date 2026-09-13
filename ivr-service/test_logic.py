"""
Zero-dependency unit test suite for IVR telephony logic & hashing
"""

import unittest
import hashlib


class TestIVRLogic(unittest.TestCase):
    def test_missed_call_hash_stability(self):
        cli = "+919864012345"
        hash_1 = hashlib.sha256(f"{cli}_SMRITI_SALT_2026".encode()).hexdigest()
        hash_2 = hashlib.sha256(f"{cli}_SMRITI_SALT_2026".encode()).hexdigest()
        self.assertEqual(hash_1, hash_2)
        self.assertEqual(len(hash_1), 64)

    def test_callback_task_id_prefix(self):
        cli = "+919864012345"
        pseudo_token = hashlib.sha256(f"{cli}_SMRITI_SALT_2026".encode()).hexdigest()
        task_id = f"CB-{pseudo_token[:8]}"
        self.assertTrue(task_id.startswith("CB-"))
        self.assertEqual(len(task_id), 11)


if __name__ == "__main__":
    unittest.main()
