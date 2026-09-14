"""
Unit tests for Smriti-NER NHM ASHA Tablet Ecosystem Integration (Sub-Phase 16.3)
Validates enterprise tablet hardware QA (Samsung, Lenovo, Lava),
signed OTA deployment package with kiosk lockdown, and 8 state health mission MoUs.
"""

import unittest

try:
    from fastapi.testclient import TestClient
    from server.main import app
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestNhmTabletEcosystem(unittest.TestCase):
    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_hardware_compatibility_models(self):
        """Validates all 5 standard NHM tablet models are certified with low RAM and battery footprint."""
        res = client.get("/api/v1/nhm/hardware-compatibility")
        self.assertEqual(res.status_code, 200)
        models = res.json()
        self.assertEqual(len(models), 5)

        for m in models:
            self.assertEqual(m["certification_status"], "CERTIFIED_FOR_PILOT_EXPANSION")
            self.assertGreaterEqual(m["compatibility_score_pct"], 95.0)
            self.assertLessEqual(m["peak_interaction_ram_mb"], 150)  # Max memory constraint
            self.assertLessEqual(m["battery_drain_per_session_pct"], 4.0)  # Battery conservation
            self.assertGreaterEqual(m["audio_spl_db"], 75)  # Auditory clarity for seniors

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_ota_deployment_package(self):
        """Validates signed enterprise APK footprint (< 30MB) and MDM kiosk lockdown mode."""
        res = client.get("/api/v1/nhm/ota-package")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["package_id"], "org.smriti.ner.asha.kiosk")
        self.assertEqual(data["version_tag"], "v2.0.4-nhm-prod")
        self.assertLess(data["package_size_mb"], 30.0)
        self.assertTrue(data["silent_install_capable"])
        self.assertTrue(data["kiosk_lockdown_supported"])
        self.assertGreaterEqual(len(data["mdm_profiles_supported"]), 3)
        self.assertEqual(data["status"], "RELEASED_ENTERPRISE_PRODUCTION")

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_state_health_mission_mou_registry(self):
        """Validates bilateral MoUs executed across all 8 NER state health societies covering > 1,500 ASHAs."""
        res = client.get("/api/v1/nhm/mou-registry")
        self.assertEqual(res.status_code, 200)
        mous = res.json()
        self.assertEqual(len(mous), 8)

        state_codes = {m["state_code"] for m in mous}
        self.assertEqual(state_codes, {"AS", "ML", "MN", "TR", "AR", "NL", "MZ", "SK"})

        total_ashas = sum(m["certified_ashas_covered"] for m in mous)
        self.assertGreater(total_ashas, 1500)

        for m in mous:
            self.assertEqual(m["status"], "EXECUTED_ACTIVE")
            self.assertTrue(m["ncd_co_location_approved"])
            self.assertTrue(len(m["mou_reference_number"]) > 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient not installed in local environment")
    def test_nhm_ecosystem_summary(self):
        """Validates consolidated NHM tablet ecosystem integration summary."""
        res = client.get("/api/v1/nhm/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_hardware_models_tested"], 5)
        self.assertEqual(data["total_tablets_compatible_pct"], 100.0)
        self.assertTrue(data["all_state_mous_signed"])
        self.assertEqual(data["states_with_executed_mous"], 8)
        self.assertGreater(data["total_ashas_covered"], 1500)
        self.assertEqual(data["status"], "ECOSYSTEM_INTEGRATION_COMPLETE")


if __name__ == "__main__":
    unittest.main()
