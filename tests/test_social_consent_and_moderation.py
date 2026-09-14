"""
Smriti-NER (স্মৃতি) — Sub-Phase 7.4: Social Consent & Content Moderation Tests
Problem Statement 26003 | MDoNER & SIH 2026
Validates DISHA 2018 statutory consent capture, verbal assent, instant revocation,
automated regex PII detection, and ASHA moderation review workflows.
"""

import unittest
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

try:
    from fastapi.testclient import TestClient
    from server.main import (
        app,
        CONSENT_STORE,
        MODERATION_QUEUE,
        scan_text_pii,
    )
    client = TestClient(app)
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False


class TestSocialConsentAndModeration(unittest.TestCase):

    def setUp(self):
        if HAS_FASTAPI:
            CONSENT_STORE.clear()
            MODERATION_QUEUE.clear()

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_dual_gate_consent_lifecycle(self):
        """Tests DISHA 2018 consent capture, retrieval, and immediate revocation."""
        patient_id = "pt_elder_consent_01"

        # 1. Capture consent
        payload = {
            "patient_id": patient_id,
            "caregiver_id": "cg_daughter_01",
            "scopes": ["FAMILY_ONLY", "COMMUNITY_CIRCLE", "GAME_TRIVIA_FLYWHEEL"],
            "elder_assent_confirmed": True,
        }
        resp = client.post("/api/v1/social/consent/capture", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "GRANTED")
        self.assertTrue(data["elder_assent_confirmed"])
        self.assertEqual(len(data["scopes"]), 3)

        # 2. Get status
        status_resp = client.get(f"/api/v1/social/consent/status/{patient_id}")
        self.assertEqual(status_resp.status_code, 200)
        self.assertEqual(status_resp.json()["status"], "GRANTED")

        # 3. Revoke consent
        rev_resp = client.post("/api/v1/social/consent/revoke", json={
            "patient_id": patient_id,
            "reason": "Family opted out of community circles.",
        })
        self.assertEqual(rev_resp.status_code, 200)
        rev_data = rev_resp.json()
        self.assertEqual(rev_data["status"], "REVOKED")
        self.assertIn("opted out", rev_data["revocation_reason"])

    def test_pii_regex_scanner_accuracy(self):
        """Validates automated detection of phone numbers, Aadhaar, and prescription drugs."""
        # 1. Phone number leak
        phone_text = "Call me on 9864012345 after lunch."
        reasons = scan_text_pii(phone_text)
        self.assertIn("DETECTED_PHONE_NUMBER", reasons)

        # 2. Aadhaar leak
        aadhaar_text = "My identity number is 5412 8901 2345 recorded by the postman."
        reasons = scan_text_pii(aadhaar_text)
        self.assertIn("DETECTED_AADHAAR_NUMBER", reasons)

        # 3. Prescription drug leak
        pharma_text = "The doctor gave Donepezil 5mg for my memory loss."
        reasons = scan_text_pii(pharma_text)
        self.assertIn("DETECTED_PRESCRIPTION_DRUG", reasons)

        # 4. Clean traditional folklore narrative
        clean_text = "১৯৬৫ চনত আমাৰ গাঁৱৰ নাওখেল হৈছিল ব্ৰহ্মপুত্ৰত। বৰ ধুনীয়া স্মৃতি।"
        reasons = scan_text_pii(clean_text)
        self.assertEqual(len(reasons), 0)

    @unittest.skipUnless(HAS_FASTAPI, "FastAPI / TestClient required for endpoint testing")
    def test_moderation_queue_and_asha_review(self):
        """Tests queuing content and ASHA worker moderation approval/rejection."""
        item_id = "mod_item_01"
        MODERATION_QUEUE[item_id] = {
            "item_id": item_id,
            "item_type": "STORY",
            "patient_id": "pt_elder_01",
            "author_name": "ককা হাজৰিকা",
            "content_snippet": "আমাৰ গাঁৱৰ বিহুগীত আৰু ঢোলৰ স্মৃতি।",
            "status": "PENDING_REVIEW",
            "flagged_reasons": [],
            "reviewed_by": None,
            "reviewed_at": None,
            "created_at": "2026-09-14T12:00:00Z",
        }

        # 1. Retrieve pending queue
        queue_resp = client.get("/api/v1/social/moderation/queue")
        self.assertEqual(queue_resp.status_code, 200)
        self.assertEqual(len(queue_resp.json()), 1)

        # 2. ASHA approves item
        review_resp = client.post("/api/v1/social/moderation/review", json={
            "item_id": item_id,
            "decision": "APPROVED",
            "reviewer_name": "Jonali Saikia (ASHA)",
            "review_notes": "Verified culturally authentic and free of private health details.",
        })
        self.assertEqual(review_resp.status_code, 200)
        item_data = review_resp.json()
        self.assertEqual(item_data["status"], "APPROVED")
        self.assertEqual(item_data["reviewed_by"], "Jonali Saikia (ASHA)")

        # 3. Verify queue is now empty
        empty_queue = client.get("/api/v1/social/moderation/queue")
        self.assertEqual(len(empty_queue.json()), 0)


if __name__ == "__main__":
    unittest.main()
