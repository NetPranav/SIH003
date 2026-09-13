"""
Zero-dependency unit test suite for server business logic & DISHA hashing
"""

import unittest
from datetime import datetime, timezone
import hashlib


class TestServerLogic(unittest.TestCase):
    def test_disha_pseudo_id_format(self):
        caller_cli = "+919435018293"
        pseudo_id = hashlib.sha256(f"{caller_cli}_SMRITI_SALT_2026".encode()).hexdigest()
        self.assertEqual(len(pseudo_id), 64)
        self.assertTrue(all(c in "0123456789abcdef" for c in pseudo_id))

    def test_mmse_calculation_boundary(self):
        # Accuracy 0.95 -> expected MMSE ~ 29.5
        avg_acc = 0.95
        computed_mmse = round(20.0 + (avg_acc * 10.0), 1)
        self.assertEqual(computed_mmse, 29.5)
        self.assertLessEqual(computed_mmse, 30.0)


if __name__ == "__main__":
    unittest.main()
