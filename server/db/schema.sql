-- ==============================================================================
-- Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) — Production Cloud Database Schema
-- SIH 2026 Problem Statement ID: 26003 | MDoNER
-- Engine: PostgreSQL 16 + TimescaleDB 2.14+
-- Compliance: DISHA 2018 (Section 29/34) & MeitY Cloud Data Sovereignty
-- ==============================================================================

-- 1. Extension Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- 2. Patient Identities (Pseudo-Anonymized Registry)
-- Mobile numbers and names are NEVER stored. Deterministic HMAC-SHA256 pseudo-IDs only.
CREATE TABLE IF NOT EXISTS patient_identities (
    patient_pseudo_id VARCHAR(64) PRIMARY KEY, -- Deterministic HMAC-SHA256
    cluster_state VARCHAR(32) NOT NULL,        -- Assam, Meghalaya, Manipur, etc.
    district VARCHAR(64) NOT NULL,             -- e.g. Kamrup Rural, Imphal West
    primary_language VARCHAR(16) NOT NULL,     -- as, bn, brx, mni, kha, lus, grt, trp
    clinical_tier VARCHAR(32) NOT NULL DEFAULT 'mci', -- mci, mild_dementia, moderate_dementia
    baseline_mmse NUMERIC(4,2) NOT NULL DEFAULT 24.0,
    is_ivr_only BOOLEAN NOT NULL DEFAULT FALSE,
    asha_worker_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_patients_cluster_state ON patient_identities(cluster_state);
CREATE INDEX IF NOT EXISTS idx_patients_clinical_tier ON patient_identities(clinical_tier);
CREATE INDEX IF NOT EXISTS idx_patients_asha_worker ON patient_identities(asha_worker_id);

-- 3. Cognitive Telemetry Events (Time-Series Hypertable)
-- High-frequency bi-factor interaction events captured during game sessions.
CREATE TABLE IF NOT EXISTS telemetry_events (
    time TIMESTAMPTZ NOT NULL,
    event_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    patient_pseudo_id VARCHAR(64) NOT NULL REFERENCES patient_identities(patient_pseudo_id) ON DELETE CASCADE,
    session_id VARCHAR(64) NOT NULL,
    game_id VARCHAR(32) NOT NULL,              -- dhol_pepa_rhythm, muga_silk_weaver, etc.
    state_origin VARCHAR(32) NOT NULL,
    task_level INTEGER NOT NULL DEFAULT 1,
    trial_index INTEGER NOT NULL DEFAULT 1,
    response_latency_ms INTEGER NOT NULL,
    accuracy_score NUMERIC(4,3) NOT NULL,      -- 0.000 to 1.000
    bi_factor_stability NUMERIC(4,3) NOT NULL, -- 0.000 to 1.000
    touch_tremor_hz NUMERIC(4,2) DEFAULT 0.00,
    path_efficiency NUMERIC(4,3) DEFAULT 1.000,
    input_modality VARCHAR(16) NOT NULL DEFAULT 'touch', -- touch, dtmf, voice
    CONSTRAINT pk_telemetry PRIMARY KEY (time, patient_pseudo_id, event_id)
);

-- Convert to TimescaleDB hypertable with 7-day chunk interval
SELECT create_hypertable(
    'telemetry_events', 
    'time', 
    chunk_time_interval => INTERVAL '7 days', 
    if_not_exists => TRUE
);

-- Enable columnar compression on chunks older than 7 days (10.4x storage reduction)
ALTER TABLE telemetry_events SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'patient_pseudo_id, game_id',
    timescaledb.compress_orderby = 'time DESC'
);

SELECT add_compression_policy('telemetry_events', INTERVAL '7 days', if_not_exists => TRUE);
SELECT add_retention_policy('telemetry_events', INTERVAL '730 days', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS idx_telemetry_patient_game ON telemetry_events (patient_pseudo_id, game_id, time DESC);

-- 4. Bayesian Knowledge Tracing (BKT) Latent Skill States
CREATE TABLE IF NOT EXISTS bkt_patient_mastery (
    patient_pseudo_id VARCHAR(64) NOT NULL REFERENCES patient_identities(patient_pseudo_id) ON DELETE CASCADE,
    cognitive_domain VARCHAR(32) NOT NULL,     -- visuospatial, executive, memory, orientation, verbal
    p_mastery NUMERIC(5,4) NOT NULL,           -- Latent P(L_t) 0.0000 to 1.0000
    prior_mastery NUMERIC(5,4) NOT NULL,       -- Prior P(L_{t-1})
    slip_parameter NUMERIC(4,3) NOT NULL DEFAULT 0.120,
    guess_parameter NUMERIC(4,3) NOT NULL DEFAULT 0.200,
    transit_parameter NUMERIC(4,3) NOT NULL DEFAULT 0.150,
    total_opportunities INTEGER NOT NULL DEFAULT 0,
    consecutive_successes INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (patient_pseudo_id, cognitive_domain)
);

-- 5. Longitudinal MMSE Trajectory Estimates (Time-Series Hypertable)
CREATE TABLE IF NOT EXISTS mmse_longitudinal_scores (
    assessment_date TIMESTAMPTZ NOT NULL,
    assessment_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    patient_pseudo_id VARCHAR(64) NOT NULL REFERENCES patient_identities(patient_pseudo_id) ON DELETE CASCADE,
    orientation_score NUMERIC(3,1) NOT NULL,        -- Max 10.0
    registration_score NUMERIC(3,1) NOT NULL,       -- Max 3.0
    attention_calculation_score NUMERIC(3,1) NOT NULL, -- Max 5.0
    recall_score NUMERIC(3,1) NOT NULL,            -- Max 3.0
    language_score NUMERIC(3,1) NOT NULL,          -- Max 9.0
    total_mmse_proxy NUMERIC(4,1) NOT NULL,        -- Max 30.0
    clinical_tier VARCHAR(32) NOT NULL,
    trailing_30d_velocity NUMERIC(5,3) NOT NULL DEFAULT 0.000, -- Points delta / month
    assessment_source VARCHAR(16) NOT NULL DEFAULT 'game_telemetry', -- game_telemetry, ivr_recall, formal_asha
    CONSTRAINT pk_mmse PRIMARY KEY (assessment_date, patient_pseudo_id, assessment_id)
);

SELECT create_hypertable(
    'mmse_longitudinal_scores', 
    'assessment_date', 
    chunk_time_interval => INTERVAL '30 days', 
    if_not_exists => TRUE
);

ALTER TABLE mmse_longitudinal_scores SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'patient_pseudo_id',
    timescaledb.compress_orderby = 'assessment_date DESC'
);

SELECT add_compression_policy('mmse_longitudinal_scores', INTERVAL '30 days', if_not_exists => TRUE);

-- 6. Caregiver & ASHA Alert Escalation Queue
CREATE TABLE IF NOT EXISTS caregiver_alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_pseudo_id VARCHAR(64) NOT NULL REFERENCES patient_identities(patient_pseudo_id) ON DELETE CASCADE,
    severity VARCHAR(16) NOT NULL,             -- INFO, WARNING, CRITICAL_ASHA
    cognitive_domain VARCHAR(32) NOT NULL,     -- visuospatial, motor_tremor, circadian, adherence
    alert_message TEXT NOT NULL,
    trigger_metric VARCHAR(64) NOT NULL,
    metric_value NUMERIC(6,3) NOT NULL,
    threshold_value NUMERIC(6,3) NOT NULL,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_by VARCHAR(64),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_pending ON caregiver_alerts(patient_pseudo_id, is_acknowledged, severity);

-- 7. Telephony & IVR Session Records (Time-Series Hypertable)
CREATE TABLE IF NOT EXISTS ivr_call_records (
    call_time TIMESTAMPTZ NOT NULL,
    call_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    patient_pseudo_id VARCHAR(64) NOT NULL REFERENCES patient_identities(patient_pseudo_id) ON DELETE CASCADE,
    caller_ani_hmac VARCHAR(64) NOT NULL,
    language_code VARCHAR(8) NOT NULL,         -- as, bn, brx, mni, kha, lus, grt, trp
    call_duration_seconds INTEGER NOT NULL,
    dtmf_responses JSONB NOT NULL DEFAULT '[]'::jsonb,
    orientation_score INTEGER NOT NULL DEFAULT 0,
    recall_words_recalled INTEGER NOT NULL DEFAULT 0,
    medication_adherence BOOLEAN NOT NULL DEFAULT FALSE,
    sos_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    bhashini_tts_latency_ms INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT pk_ivr PRIMARY KEY (call_time, patient_pseudo_id, call_id)
);

SELECT create_hypertable(
    'ivr_call_records', 
    'call_time', 
    chunk_time_interval => INTERVAL '7 days', 
    if_not_exists => TRUE
);

ALTER TABLE ivr_call_records SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'patient_pseudo_id',
    timescaledb.compress_orderby = 'call_time DESC'
);

SELECT add_compression_policy('ivr_call_records', INTERVAL '7 days', if_not_exists => TRUE);
