/**
 * Smriti-NER Backend API Architecture Engine (Sub-Phase 12.2)
 *
 * Implements client-side contracts for:
 * 1. RBAC and JWT Authentication verification
 * 2. Multi-tier caching layer with automated cache eviction on sync
 * 3. Celery background task tracking (MMSE batch, Sundowning clustering, Adherence rollups)
 * 4. Token-bucket client-side rate limiting
 */

export type UserRole = 'PATIENT' | 'CAREGIVER' | 'ASHA' | 'CLINICIAN' | 'DMO' | 'ADMIN';

export interface JwtClaims {
  sub: string;
  role: UserRole;
  name: string;
  patient_access: string[];
  exp: number;
  jti: string;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expires_at: number;
}

export interface CeleryTaskJob {
  task_id: string;
  task_name: 'compute_mmse_proxy_batch' | 'detect_sundowning_anomalies_batch' | 'compute_adherence_trend_batch';
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  args: Record<string, any>;
  result?: Record<string, any>;
  dispatched_at: string;
  completed_at?: string;
}

export class BackendApiService {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private celeryJobs: Map<string, CeleryTaskJob> = new Map();
  private rateLimitBuckets: Map<string, { tokens: number; lastRefill: number }> = new Map();

  /**
   * RBAC Permission check.
   */
  public hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    if (userRole === 'ADMIN') return true;
    return allowedRoles.includes(userRole);
  }

  /**
   * Simulated JWT Generation for testing RBAC across clinical & caregiver roles.
   */
  public generateSimulatedJwt(sub: string, role: UserRole, name: string, patientAccess: string[] = []): string {
    const claims: JwtClaims = {
      sub,
      role,
      name,
      patient_access: patientAccess,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      jti: `jti_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    return `sim_jwt.${btoa(JSON.stringify(claims))}.signature`;
  }

  public verifySimulatedJwt(token: string): JwtClaims {
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'sim_jwt') {
      throw new Error('INVALID_JWT_FORMAT');
    }
    const claims: JwtClaims = JSON.parse(atob(parts[1]));
    if (claims.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('JWT_EXPIRED');
    }
    return claims;
  }

  /**
   * In-memory cache layer with TTL (Redis abstraction).
   */
  public getFromCache<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.cacheMisses++;
      return null;
    }
    if (Date.now() > entry.expires_at) {
      this.cache.delete(key);
      this.cacheMisses++;
      return null;
    }
    this.cacheHits++;
    return entry.value as T;
  }

  public setInCache<T = any>(key: string, value: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      key,
      value,
      expires_at: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Evicts patient cached trajectories and dashboards upon new delta packet sync or mesh harvest.
   */
  public invalidatePatientCache(patientId: string): number {
    let evictedCount = 0;
    const prefix1 = `traj:${patientId}`;
    const prefix2 = `dash:${patientId}`;

    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(prefix1) || key.startsWith(prefix2)) {
        this.cache.delete(key);
        evictedCount++;
      }
    }
    return evictedCount;
  }

  public getCacheMetrics(): { hits: number; misses: number; keysCount: number } {
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      keysCount: this.cache.size,
    };
  }

  /**
   * Celery background job dispatch simulation.
   */
  public dispatchCeleryJob(
    taskName: CeleryTaskJob['task_name'],
    args: Record<string, any>
  ): CeleryTaskJob {
    const taskId = `celery_${taskName}_${Date.now()}`;
    const job: CeleryTaskJob = {
      task_id: taskId,
      task_name: taskName,
      status: 'SUCCESS', // synchronous completion simulation
      args,
      result: {
        processed_at: new Date().toISOString(),
        status: 'BATCH_COMPLETED',
        details: `Processed task ${taskName} for ${args.patient_id || 'system'}`,
      },
      dispatched_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };
    this.celeryJobs.set(taskId, job);
    return job;
  }

  public getCeleryJob(taskId: string): CeleryTaskJob | undefined {
    return this.celeryJobs.get(taskId);
  }

  /**
   * Token-bucket rate limiter.
   */
  public checkRateLimit(clientKey: string, capacity: number = 60, refillPerSec: number = 1): boolean {
    const now = Date.now();
    let bucket = this.rateLimitBuckets.get(clientKey);

    if (!bucket) {
      bucket = { tokens: capacity, lastRefill: now };
      this.rateLimitBuckets.set(clientKey, bucket);
    }

    const elapsedSeconds = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSeconds * refillPerSec);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true; // Allowed
    }
    return false; // Rate limited
  }
}

export const backendApiService = new BackendApiService();
