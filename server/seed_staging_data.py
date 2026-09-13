"""
Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) — Staging Synthetic Cohort Data Generator
SIH 2026 Problem Statement ID: 26003 | MDoNER
Generates realistic, longitudinal clinical telemetry for 100+ synthetic patients across all 8 NER states.
Adheres strictly to DISHA 2018: All identifiers are deterministic HMAC-SHA256 hashes.
"""

import json
import hashlib
import hmac
import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

NER_STATES = [
    {"state": "Assam", "district": "Kamrup Rural", "lang": "as", "games": ["dhol_pepa_rhythm", "muga_silk_weaver"]},
    {"state": "Meghalaya", "district": "East Khasi Hills", "lang": "kha", "games": ["rhinos_maze", "brass_bell_chimes"]},
    {"state": "Manipur", "district": "Imphal West", "lang": "mni", "games": ["bamboo_groves", "muga_silk_weaver"]},
    {"state": "Mizoram", "district": "Aizawl", "lang": "lus", "games": ["dhol_pepa_rhythm", "bamboo_groves"]},
    {"state": "Nagaland", "district": "Kohima", "lang": "en", "games": ["brass_bell_chimes", "rhinos_maze"]},
    {"state": "Tripura", "district": "West Tripura", "lang": "bn", "games": ["dhol_pepa_rhythm", "muga_silk_weaver"]},
    {"state": "Arunachal Pradesh", "district": "Papum Pare", "lang": "as", "games": ["rhinos_maze", "bamboo_groves"]},
    {"state": "Sikkim", "district": "East Sikkim", "lang": "ne", "games": ["brass_bell_chimes", "dhol_pepa_rhythm"]},
]

SECRET_SALT = b"SMRITI_NER_STAGING_SYNTHETIC_SALT_2026"

def generate_pseudo_id(state: str, idx: int) -> str:
    """Generates a DISHA-compliant deterministic HMAC-SHA256 pseudo identifier."""
    raw = f"PATIENT_{state}_{idx}".encode("utf-8")
    return hmac.new(SECRET_SALT, raw, hashlib.sha256).hexdigest()

def generate_staging_dataset(patient_count: int = 100, history_days: int = 30) -> Dict[str, Any]:
    """
    Generates a full synthetic staging dataset with:
    - 100+ patient identities across 8 states
    - 30 days of daily telemetry sessions
    - Longitudinal MMSE proxy progression
    - BKT domain mastery distributions
    - IVR session check-ins
    - Clinical caregiver alerts
    """
    random.seed(42) # Deterministic for reproducible staging runs
    now = datetime.now(timezone.utc)

    patients = []
    telemetry_events = []
    bkt_masteries = []
    mmse_scores = []
    caregiver_alerts = []
    ivr_records = []

    domains = ["visuospatial", "executive", "memory", "orientation", "verbal"]

    for i in range(patient_count):
        loc = NER_STATES[i % len(NER_STATES)]
        pseudo_id = generate_pseudo_id(loc["state"], i)
        
        # Clinical tier distribution: 45% MCI, 35% Mild Dementia, 20% Moderate Dementia
        roll = random.random()
        if roll < 0.45:
            tier = "mci"
            base_mmse = round(random.uniform(24.0, 27.5), 1)
            decline_rate = random.uniform(-0.1, 0.05)
        elif roll < 0.80:
            tier = "mild_dementia"
            base_mmse = round(random.uniform(19.0, 23.5), 1)
            decline_rate = random.uniform(-0.35, -0.1)
        else:
            tier = "moderate_dementia"
            base_mmse = round(random.uniform(13.0, 18.5), 1)
            decline_rate = random.uniform(-0.6, -0.2)

        is_ivr_only = (i % 6 == 0) # ~16% IVR feature-phone only cohort

        patient_record = {
            "patient_pseudo_id": pseudo_id,
            "cluster_state": loc["state"],
            "district": loc["district"],
            "primary_language": loc["lang"],
            "clinical_tier": tier,
            "baseline_mmse": base_mmse,
            "is_ivr_only": is_ivr_only,
            "asha_worker_id": f"ASHA_{loc['district'].replace(' ', '_').upper()}_{(i % 5) + 1:02d}",
            "created_at": (now - timedelta(days=history_days + 15)).isoformat(),
            "last_active_at": now.isoformat(),
            "is_active": True
        }
        patients.append(patient_record)

        # Generate initial BKT mastery states
        for domain in domains:
            domain_offset = random.uniform(-0.1, 0.1)
            initial_p = max(0.1, min(0.95, (base_mmse / 30.0) + domain_offset))
            bkt_masteries.append({
                "patient_pseudo_id": pseudo_id,
                "cognitive_domain": domain,
                "p_mastery": round(initial_p, 4),
                "prior_mastery": round(max(0.1, initial_p - 0.05), 4),
                "total_opportunities": history_days * 3,
                "last_updated": now.isoformat()
            })

        # Generate 30 days of longitudinal telemetry
        for day in range(history_days):
            day_date = now - timedelta(days=(history_days - day))
            daily_noise = random.uniform(-0.8, 0.8)
            current_mmse = max(10.0, min(30.0, base_mmse + (decline_rate * (day / 30.0) * 3) + daily_noise))

            # Weekly MMSE Hypertable checkpoints
            if day % 7 == 0 or day == history_days - 1:
                mmse_scores.append({
                    "assessment_date": day_date.isoformat(),
                    "patient_pseudo_id": pseudo_id,
                    "orientation_score": round(min(10.0, current_mmse * 0.33), 1),
                    "registration_score": 3.0,
                    "attention_calculation_score": round(min(5.0, current_mmse * 0.17), 1),
                    "recall_score": round(min(3.0, current_mmse * 0.10), 1),
                    "language_score": round(min(9.0, current_mmse * 0.30), 1),
                    "total_mmse_proxy": round(current_mmse, 1),
                    "clinical_tier": tier,
                    "trailing_30d_velocity": round(decline_rate, 3),
                    "assessment_source": "ivr_recall" if is_ivr_only else "game_telemetry"
                })

            if is_ivr_only:
                # Daily IVR check-in record
                adherence = random.random() > 0.12
                recalled = 2 if current_mmse > 20 else (1 if current_mmse > 15 else 0)
                ivr_records.append({
                    "call_time": (day_date.replace(hour=7, minute=15)).isoformat(),
                    "patient_pseudo_id": pseudo_id,
                    "caller_ani_hmac": pseudo_id[:32],
                    "language_code": loc["lang"],
                    "call_duration_seconds": random.randint(95, 140),
                    "orientation_score": 1 if current_mmse > 18 else 0,
                    "recall_words_recalled": recalled,
                    "medication_adherence": adherence,
                    "sos_triggered": False,
                    "bhashini_tts_latency_ms": random.randint(320, 580)
                })
            else:
                # Daily PWA game trials
                for game_id in loc["games"]:
                    accuracy = max(0.2, min(1.0, (current_mmse / 30.0) + random.uniform(-0.15, 0.15)))
                    stability = max(0.3, min(1.0, accuracy * 0.95 + random.uniform(-0.1, 0.1)))
                    tremor = round(random.uniform(2.2, 7.5) if tier != "mci" else random.uniform(1.8, 4.2), 1)

                    telemetry_events.append({
                        "time": (day_date.replace(hour=10, minute=random.randint(10, 50))).isoformat(),
                        "patient_pseudo_id": pseudo_id,
                        "session_id": f"sess_{day}_{game_id[:4]}",
                        "game_id": game_id,
                        "state_origin": loc["state"],
                        "task_level": 2 if current_mmse > 22 else 1,
                        "trial_index": 1,
                        "response_latency_ms": int(random.uniform(850, 2400)),
                        "accuracy_score": round(accuracy, 3),
                        "bi_factor_stability": round(stability, 3),
                        "touch_tremor_hz": tremor,
                        "input_modality": "touch"
                    })

                    # Flag alert if severe tremor or acute drop
                    if tremor >= 6.5 and day == history_days - 1:
                        caregiver_alerts.append({
                            "patient_pseudo_id": pseudo_id,
                            "severity": "WARNING",
                            "cognitive_domain": "motor_stability",
                            "alert_message": f"Elevated touch tremor ({tremor} Hz) detected in {loc['state']}.",
                            "trigger_metric": "touch_tremor_hz",
                            "metric_value": tremor,
                            "threshold_value": 6.5,
                            "created_at": now.isoformat()
                        })

    return {
        "metadata": {
            "version": "1.0.0",
            "environment": "staging",
            "generated_at": now.isoformat(),
            "ner_states_covered": len(NER_STATES),
            "total_patients": len(patients),
            "total_telemetry_events": len(telemetry_events),
            "total_bkt_mastery_states": len(bkt_masteries),
            "total_mmse_trajectory_points": len(mmse_scores),
            "total_ivr_call_records": len(ivr_records),
            "total_alerts": len(caregiver_alerts)
        },
        "patients": patients,
        "telemetry_events": telemetry_events[:1000], # Staged sample for lightweight loading
        "bkt_masteries": bkt_masteries,
        "mmse_scores": mmse_scores,
        "ivr_records": ivr_records,
        "caregiver_alerts": caregiver_alerts
    }

if __name__ == "__main__":
    dataset = generate_staging_dataset(patient_count=100, history_days=30)
    meta = dataset["metadata"]
    print("=== Smriti-NER Staging Dataset Generated Successfully ===")
    print(f"• NER States: {meta['ner_states_covered']}")
    print(f"• Total Synthetic Patients: {meta['total_patients']}")
    print(f"• Telemetry Events: {meta['total_telemetry_events']}")
    print(f"• MMSE Trajectory Points: {meta['total_mmse_trajectory_points']}")
    print(f"• IVR Check-In Records: {meta['total_ivr_call_records']}")
    print(f"• Caregiver Alerts: {meta['total_alerts']}")

    # Save to staging JSON seed file
    output_path = "/Users/pranav/Project Folder/Aditya Upadhyay ka Kaam/server/staging_seed_cohort.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
    print(f"Dataset written to {output_path}")
