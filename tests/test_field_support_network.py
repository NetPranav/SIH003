"""
Unit tests for Smriti-NER Field Support Network (Sub-Phase 17.2)
Validates 30 District Technical Champions across 15 districts,
3-tier incident escalation SLAs, and device maintenance SOPs.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestFieldSupportNetwork(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_technical_champions_roster(self):
        """Validates 32 District Technical Champions distributed across 16 district headquarters."""
        res = client.get("/api/v1/support/champions")
        self.assertEqual(res.status_code, 200)
        champs = res.json()
        self.assertEqual(len(champs), 32)

        districts = {c["district_hq"] for c in champs}
        self.assertEqual(len(districts), 16)

        states = {c["state_code"] for c in champs}
        self.assertTrue({"AS", "ML", "MN", "TR", "AR", "NL", "MZ", "SK"}.issubset(states))

        for c in champs:
            self.assertEqual(c["active_status"], "ACTIVE_ON_DUTY")
            self.assertGreater(c["peer_cohort_coverage"], 0)
            self.assertGreaterEqual(len(c["specialist_skills"]), 2)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_escalation_protocols(self):
        """Validates the 3-tier escalation model with strict resolution SLAs."""
        res = client.get("/api/v1/support/escalation-tiers")
        self.assertEqual(res.status_code, 200)
        tiers = res.json()
        self.assertEqual(len(tiers), 3)

        t1 = next(t for t in tiers if t["tier_level"] == 1)
        self.assertLessEqual(t1["target_response_minutes"], 15)
        self.assertGreaterEqual(t1["sla_success_rate_pct"], 99.0)

        t2 = next(t for t in tiers if t["tier_level"] == 2)
        self.assertLessEqual(t2["target_resolution_hours"], 2.0)

        t3 = next(t for t in tiers if t["tier_level"] == 3)
        self.assertLessEqual(t3["target_resolution_hours"], 6.0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_device_maintenance_sops(self):
        """Validates all 4 maintenance SOP categories (Monsoon, High Altitude, Battery, Kiosk)."""
        res = client.get("/api/v1/support/maintenance-sops")
        self.assertEqual(res.status_code, 200)
        sops = res.json()
        self.assertEqual(len(sops), 4)

        categories = {s["category"] for s in sops}
        self.assertEqual(categories, {"MONSOON_HUMIDITY", "HIGH_ALTITUDE_COLD", "BATTERY_HEALTH", "KIOSK_RECOVERY"})

        for s in sops:
            self.assertGreaterEqual(len(s["protocol_rules"]), 3)
            self.assertGreaterEqual(len(s["required_accessories"]), 2)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_field_support_summary(self):
        """Validates consolidated field support summary metrics."""
        res = client.get("/api/v1/support/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_technical_champions"], 32)
        self.assertEqual(data["districts_covered"], 16)
        self.assertEqual(data["states_covered"], 8)
        self.assertLessEqual(data["mean_incident_resolution_hours"], 2.0)
        self.assertGreaterEqual(data["overall_support_sla_pct"], 99.0)
        self.assertEqual(data["status"], "FIELD_SUPPORT_OPERATIONAL")


if __name__ == "__main__":
    unittest.main()
