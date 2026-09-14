# Smriti-NER Technical Specification: Sub-Phase 11.2 — Delta Synchronization Engine

## 1. Executive Summary & NER Operational Context
In North East India (NER), continuous 4G/5G broadband connectivity is frequently disrupted by mountainous topography, monsoonal flash floods, and remote valley dead zones. Under these challenging conditions, elderly users and rural ASHA workers cannot rely on persistent cloud connections. 

Sub-Phase 11.2 implements the **Smriti-NER Delta Synchronization Engine**, delivering:
1. **Delta Packet Serialization**: Micro-payload binary-compact JSON representation (<50KB/week target) serializing only timestamped mutations since the client's last synchronized epoch.
2. **Network Detection & Connection Quality Profiling**: Hybrid monitoring combining browser `navigator.onLine` events with active low-overhead heartbeat probes to classify connection state (`OFFLINE`, `2G_POOR`, `3G_FAIR`, `4G_WIFI_GOOD`).
3. **Opportunistic Sync Trigger & Resilient Backoff**: Autonomous synchronization triggering upon connectivity restoration, app foregrounding, and scheduled intervals, backed by truncated exponential backoff with randomized jitter.
4. **Authoritative Conflict Resolution & Immutable Local Ledger**: Deterministic server-wins resolution for clinical state conflicts while preserving client-side append-only audit histories to satisfy DISHA 2018 traceability.

---

## 2. Mathematical & Architectural Formulations

### 2.1 Delta Envelope Serialization Target (<50 KB / week)
For a patient generating daily cognitive game telemetry, circadian sundowning logs, medication adherence, and voice assistant transcripts:
$$\text{Raw JSON Weekly Size} \approx 650 \text{ KB}$$
$$\text{Delta Serialization Ratio} = \frac{\text{Field-Truncated Key Tokens} + \text{Epoch Delimiting}}{\text{Full State Object}} \approx 0.12$$
$$\text{Compressed Delta Size} \approx 650 \text{ KB} \times 0.12 \times \text{Deflate Ratio}(0.45) \approx 35.1 \text{ KB} < 50 \text{ KB Target}$$

### 2.2 Truncated Exponential Backoff with Jitter
When synchronization encounters network timeouts or transient server saturation in remote PHC servers, backoff delay $T_{\text{wait}}$ is computed as:
$$T_{\text{wait}} = \min\left(T_{\text{max}}, T_{\text{base}} \times 2^{\text{attempt}}\right) + \text{Uniform}(0, J)$$
Where:
- $T_{\text{base}} = 2000 \text{ ms}$ (2 seconds)
- $T_{\text{max}} = 300000 \text{ ms}$ (5 minutes)
- $J = 1000 \text{ ms}$ (1 second randomized jitter to prevent thundering herd on cell towers)
- Max active retry count: 5 attempts before dormant queueing.

### 2.3 Quality-Adaptive Sync Prioritization (Tiered Ingestion)
When network quality is classified as `2G_POOR` (RTT > 1200ms or bandwidth < 100kbps):
- **Tier 1 (High Priority - Immediate)**: Emergency distress events, Missed medication alerts, Kinship SOS.
- **Tier 2 (Medium Priority - Deferred)**: Daily MMSE proxy scores, Adherence acknowledgments.
- **Tier 3 (Low Priority - Wi-Fi/Good Only)**: Raw micro-interaction tap latencies, compressed voice speech samples.

---

## 3. Data Schemas & Signatures

### 3.1 Delta Sync Packet Schema
```json
{
  "packet_id": "delta_pkg_20260914_94812",
  "patient_id": "p_anand_01",
  "client_device_id": "smriti_tab_karbi_04",
  "since_epoch": 1789300000000,
  "generated_at": "2026-09-14T13:30:00Z",
  "payload_checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "uncompressed_bytes": 14280,
  "compressed_bytes": 3840,
  "entities": {
    "reminders": [
      {
        "entity_id": "rem_med_01",
        "action": "UPSERT",
        "updated_at": 1789325000000,
        "data": { "status": "COMPLETED", "confirmed_time": "2026-09-14T08:33:00Z" }
      }
    ],
    "game_sessions": [
      {
        "entity_id": "gs_bihu_02",
        "action": "INSERT",
        "updated_at": 1789327000000,
        "data": { "game_id": "bihu_rhythm", "score": 94, "reaction_ms": 420 }
      }
    ],
    "bkt_states": [
      {
        "entity_id": "bkt_wm_recall",
        "action": "UPSERT",
        "updated_at": 1789328000000,
        "data": { "p_know": 0.882, "state": "MASTERY" }
      }
    ]
  }
}
```

### 3.2 Conflict Resolution Entry
```json
{
  "conflict_id": "conf_8819",
  "entity_type": "reminder_status",
  "entity_id": "rem_med_01",
  "client_value": { "status": "COMPLETED", "timestamp": "2026-09-14T08:33:00Z" },
  "server_value": { "status": "ESCALATED_TO_ASHA", "timestamp": "2026-09-14T08:45:00Z" },
  "resolution_applied": "SERVER_WINS_MERGE",
  "resolved_value": {
    "status": "COMPLETED",
    "asha_notified": true,
    "resolution_note": "Medication confirmed offline; ASHA notified of retroactive completion."
  },
  "audit_trail_preserved": true
}
```

---

## 4. Verification & Validation Framework
1. **Packet Serialization Test**: Verifies JSON field compression, delta filtering since last epoch, and SHA-256 checksum calculation.
2. **Network Detection & Connection Profiling Test**: Validates transition between online, offline, and latency-based connection classification (`2G_POOR` vs `4G_WIFI_GOOD`).
3. **Opportunistic Backoff & Queueing Test**: Validates exponential backoff progression and maximum retry bounding.
4. **Server Conflict Resolution Test**: Exercises simultaneous offline client modifications vs server updates with audit preservation.
