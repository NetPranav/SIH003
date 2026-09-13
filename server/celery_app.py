"""
Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) — Asynchronous Celery Application
SIH 2026 Problem Statement ID: 26003 | MDoNER
Coordinates distributed background tasks: BKT updates, circadian calming profiles, and ASHA escalation.
"""

import os
from celery import Celery

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "smriti_redis_2026")
REDIS_DB = int(os.getenv("REDIS_DB", "0"))

REDIS_URL = os.getenv(
    "REDIS_URL",
    f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
)

celery_app = Celery(
    "smriti_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["server.tasks"]
)

# Celery production configurations
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes maximum runtime
    worker_concurrency=int(os.getenv("CELERY_CONCURRENCY", "4")),
    worker_prefetch_multiplier=1,
    beat_schedule={
        "daily-circadian-calming-generation": {
            "task": "server.tasks.generate_daily_circadian_profiles",
            "schedule": 21600.0,  # Periodic check (every 6 hours)
        },
        "weekly-mmse-velocity-audit": {
            "task": "server.tasks.compute_cohort_mmse_velocities",
            "schedule": 86400.0,  # Daily audit
        },
    }
)

if __name__ == "__main__":
    celery_app.start()
