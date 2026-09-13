"""
Unit Tests for Smriti-NER TimescaleDB Schema & Database Configuration
SIH 2026 Problem Statement ID: 26003 | MDoNER
"""

import unittest
import os
import re

class TestDatabaseSchema(unittest.TestCase):
    def setUp(self):
        self.schema_path = os.path.join(os.path.dirname(__file__), "db", "schema.sql")
        self.assertTrue(os.path.exists(self.schema_path), f"Schema file not found at {self.schema_path}")
        with open(self.schema_path, "r", encoding="utf-8") as f:
            self.sql = f.read()

    def test_extensions_present(self):
        """Verify uuid-ossp and timescaledb extensions are loaded."""
        self.assertIn('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"', self.sql)
        self.assertIn('CREATE EXTENSION IF NOT EXISTS timescaledb', self.sql)

    def test_core_tables_defined(self):
        """Verify all 6 core tables are declared."""
        tables = [
            "patient_identities",
            "telemetry_events",
            "bkt_patient_mastery",
            "mmse_longitudinal_scores",
            "caregiver_alerts",
            "ivr_call_records",
        ]
        for table in tables:
            self.assertRegex(
                self.sql,
                rf"CREATE TABLE IF NOT EXISTS {table}",
                f"Table {table} missing from schema.sql",
            )

    def test_hypertables_created(self):
        """Verify TimescaleDB hypertables are configured with time dimension."""
        self.assertIn("SELECT create_hypertable(\n    'telemetry_events'", self.sql)
        self.assertIn("SELECT create_hypertable(\n    'mmse_longitudinal_scores'", self.sql)
        self.assertIn("SELECT create_hypertable(\n    'ivr_call_records'", self.sql)

    def test_columnar_compression_policies(self):
        """Verify columnar compression policies are defined for storage efficiency."""
        self.assertIn("timescaledb.compress", self.sql)
        self.assertIn("add_compression_policy('telemetry_events', INTERVAL '7 days'", self.sql)
        self.assertIn("add_compression_policy('mmse_longitudinal_scores', INTERVAL '30 days'", self.sql)

    def test_disha_pseudo_anonymization(self):
        """Verify patient identities table uses 64-char pseudo-ID and no raw mobile/name fields."""
        self.assertIn("patient_pseudo_id VARCHAR(64) PRIMARY KEY", self.sql)
        self.assertNotIn("patient_name", self.sql)
        self.assertNotIn("phone_number", self.sql)

if __name__ == "__main__":
    unittest.main()
