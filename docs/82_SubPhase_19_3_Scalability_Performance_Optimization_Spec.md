# Sub-Phase 19.3 Specification: Scalability & Performance Optimization

## 1. Executive Summary & Context
Sub-Phase 19.3 provisions the **cloud auto-scaling, CDN edge acceleration, and telephony capacity hardening** required to sustain population-scale public usage across the 8 North Eastern states. With public availability spanning Android devices, Progressive Web Apps, and the toll-free `1800-890-SMRITI` telephony gateway, infrastructure must effortlessly absorb high-concurrency surge events (such as morning radio broadcast call spikes and weekly ASHA synchronizations).

---

## 2. Cloud Auto-Scaling Architecture (Kubernetes HPA & High Concurrency)

### 2.1 Concurrency Sizing & Capacity Requirements
- **Target Peak Concurrency**: $\ge 50,000$ simultaneous client sync requests and WebSocket telemetry sessions.
- **Infrastructure Footprint**:
  - Hosted across National Informatics Centre (NIC) MeghRaj Cloud and Meghalaya/Assam State Data Centres (SDC).
  - Kubernetes cluster (k8s 1.30) with node groups distributed across 3 Availability Zones.
- **Horizontal Pod Autoscaler (HPA) Specification**:
  - **Min Replicas**: 6 pods (idle baseline)
  - **Max Replicas**: 80 pods (surge peak)
  - **Scale-Up Triggers**:
    - Average CPU utilization $> 70\%$
    - Average Memory utilization $> 75\%$
    - Custom Prometheus Metric: `http_requests_in_flight > 250` per pod
  - **Autoscaler Timing**:
    - Scale-up stabilization window: 15 seconds (rapid surge response)
    - Scale-down stabilization window: 300 seconds (cooldown to prevent flapping)
- **Database & In-Memory Layer Scaling**:
  - Connection Pool: PgBouncer cluster with max pool size of 1,200 connections and statement timeout of 5,000 ms.
  - Redis Cluster 7.2: 6 nodes (3 masters, 3 replicas) handling session state, distributed rate limiting, and cache invalidation.

---

## 3. CDN Deployment & Edge Acceleration Architecture

### 3.1 Edge PoP Topology & Routing
- **Primary India Edge PoPs**:
  1. **Guwahati PoP** (Primary regional cache for Assam, Meghalaya, Arunachal Pradesh)
  2. **Kolkata PoP** (Regional peering hub for Tripura, Mizoram, Manipur)
  3. **Patna PoP** (Eastern transit corridor)
  4. **Delhi PoP** (National routing core)
  5. **Mumbai PoP** (Western exchange)
  6. **Chennai PoP** (Southern exchange)
- **Origin Shield Architecture**:
  - Primary Origin: STPI Guwahati Data Centre
  - Secondary Disaster Recovery Origin: SDC Shillong
  - Anycast DNS with sub-5ms DNS resolution time across all Indian telecom providers (Airtel, BSNL, Jio, Vi).

### 3.2 Caching & Content Delivery Policies
- **Static Assets (Folklore audio files, UI bundles, cultural imagery)**:
  - Cache-Control: `public, max-age=31536000, immutable`
  - Cache Hit Ratio Target: $\ge 96.5\%$
  - Brotli Level 6 and Zstandard compression enabled at edge.
  - Automatic WebP/AVIF image transcoding.
- **Latency Benchmarks**:
  - P95 asset latency $< 85$ ms across all 8 NER states over 3G/4G cellular links.
  - P99 dynamic API handshake latency $< 160$ ms.

---

## 4. IVR Line Capacity Scaling & Load Testing Report

### 4.1 Telephony Infrastructure Hardening
- **Toll-Free Inward Trunk Scaling**:
  - **BSNL Guwahati Primary**: Expanded to 4 E1 PRI circuits (120 digital telephony channels).
  - **Jio Infocomm Secondary SIP Trunk**: Provisioned for 1,500 concurrent SIP voice channels with dynamic burst capacity up to 2,500 channels.
  - Total provisioned telephony concurrency: **1,620 concurrent voice lines**.
- **Media Server Clustering**:
  - 4 Asterisk PBX / Kamailio SIP proxy nodes with RTP media proxying in Active-Active load balancing.

### 4.2 Telephony Load Test Execution & Results
Load test executed using SIPp load generator simulating peak morning radio broadcast response:
- **Simulated Test Volume**: 2,000 concurrent calls over 60-minute stress duration.
- **Total Calls Attempted**: 18,400 calls.
- **Call Completion Rate**: $99.82\%$ (18,367 completed successfully; 33 dropped due to simulated client hang-ups).
- **Call Drop Rate**: $0.18\%$ ($\ll 0.50\%$ SLA target).
- **Audio Quality Metrics**:
  - Mean Opinion Score (MOS): $4.32 / 5.0$ (HD Voice G.711 / Opus codec).
  - Median Jitter: $3.8$ ms (Target $< 10$ ms).
  - Packet Loss: $0.02\%$ (Target $< 0.10\%$).
- **Failover Verification**:
  - Simulated primary BSNL E1 trunk disconnection during active call load; Jio secondary SIP trunk absorbed $100\%$ of failover traffic within $98$ ms without active call drop.

---

## 5. Verification & Testing Standards
- All endpoints must return HTTP 200 with structured JSON.
- Automated tests must verify:
  1. Cloud autoscaling configuration (50,000+ concurrency target, min/max pod limits, scale-up rules).
  2. CDN edge PoPs, origin shield routing, and cache-hit SLAs.
  3. IVR capacity load test report (total channels $\ge 1,500$, completion rate $\ge 99.5\%$, call drop rate $\le 0.5\%$, MOS $\ge 4.0$).
  4. Consolidated scalability summary.
