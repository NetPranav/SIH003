/**
 * Smriti-NER (স্মৃতি) — Sub-Phase 7.4: Social Consent & Content Moderation Engine
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Clinical & Statutory Focus:
 * DISHA 2018 Statutory Consent, Elder Verbal Assent, Automated PII Sanitization
 * and ASHA Worker Moderation Queue for Social Features and Game Trivia.
 */

export type ConsentScope =
  | "FAMILY_ONLY"
  | "COMMUNITY_CIRCLE"
  | "GAME_TRIVIA_FLYWHEEL";

export type ConsentStatus = "GRANTED" | "DENIED" | "REVOKED";

export interface ConsentArtifact {
  consentId: string;
  patientId: string;
  caregiverId: string;
  scopes: ConsentScope[];
  status: ConsentStatus;
  elderAssentConfirmed: boolean;
  timestamp: string;
  revokedAt?: string;
  revocationReason?: string;
}

export type ModerationItemType = "STORY" | "CLUE" | "TRIVIA";

export type ModerationStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "FLAGGED_PII"
  | "REJECTED";

export interface ModerationQueueItem {
  itemId: string;
  itemType: ModerationItemType;
  patientId: string;
  authorName: string;
  contentSnippet: string;
  status: ModerationStatus;
  flaggedReasons: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface PiiScanResult {
  hasPii: boolean;
  flaggedReasons: string[];
}

export class SocialConsentEngine {
  private static consentStore: Map<string, ConsentArtifact> = new Map();
  private static moderationQueue: Map<string, ModerationQueueItem> = new Map();

  // Regulatory PII patterns
  private static readonly PHONE_REGEX = /\b[6-9]\d{9}\b/;
  private static readonly AADHAAR_REGEX = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
  private static readonly PHARMA_REGEX = /\b(donepezil|memantine|galantamine|rivastigmine|levodopa|haloperidol)\b/i;
  private static readonly FINANCIAL_REGEX = /\b(pension|bank account|rupees|টকা|rs\.?|inr)\s?\d+/i;

  /**
   * Scans text snippet for sensitive PII or pharmaceutical leaks
   */
  public static scanForPii(text: string): PiiScanResult {
    const reasons: string[] = [];

    if (this.PHONE_REGEX.test(text)) {
      reasons.push("DETECTED_PHONE_NUMBER");
    }
    if (this.AADHAAR_REGEX.test(text)) {
      reasons.push("DETECTED_AADHAAR_NUMBER");
    }
    if (this.PHARMA_REGEX.test(text)) {
      reasons.push("DETECTED_PRESCRIPTION_DRUG");
    }
    if (this.FINANCIAL_REGEX.test(text)) {
      reasons.push("DETECTED_FINANCIAL_INFO");
    }

    return {
      hasPii: reasons.length > 0,
      flaggedReasons: reasons,
    };
  }

  /**
   * Captures dual-gate consent from legal caregiver and elder verbal assent
   */
  public static captureConsent(params: {
    patientId: string;
    caregiverId: string;
    scopes: ConsentScope[];
    elderAssentConfirmed: boolean;
  }): ConsentArtifact {
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const artifact: ConsentArtifact = {
      consentId,
      patientId: params.patientId,
      caregiverId: params.caregiverId,
      scopes: params.scopes,
      status: "GRANTED",
      elderAssentConfirmed: params.elderAssentConfirmed,
      timestamp: new Date().toISOString(),
    };

    this.consentStore.set(params.patientId, artifact);
    return artifact;
  }

  /**
   * Revokes all social sharing consent for a patient with immediate cascade
   */
  public static revokeConsent(patientId: string, reason?: string): ConsentArtifact {
    const existing = this.consentStore.get(patientId);
    if (!existing) {
      throw new Error(`No active consent record for patient '${patientId}'.`);
    }

    existing.status = "REVOKED";
    existing.revokedAt = new Date().toISOString();
    existing.revocationReason = reason || "Caregiver requested full privacy revocation";
    this.consentStore.set(patientId, existing);
    return existing;
  }

  /**
   * Checks whether consent is actively granted for a specific scope
   */
  public static isConsentActive(patientId: string, scope: ConsentScope): boolean {
    const record = this.consentStore.get(patientId);
    if (!record) return false;
    if (record.status !== "GRANTED") return false;
    if (!record.elderAssentConfirmed) return false;
    return record.scopes.includes(scope);
  }

  /**
   * Enqueues content into ASHA / admin moderation queue
   */
  public static enqueueForModeration(params: {
    itemId: string;
    itemType: ModerationItemType;
    patientId: string;
    authorName: string;
    contentSnippet: string;
  }): ModerationQueueItem {
    const scan = this.scanForPii(params.contentSnippet);
    const initialStatus: ModerationStatus = scan.hasPii ? "FLAGGED_PII" : "PENDING_REVIEW";

    const item: ModerationQueueItem = {
      itemId: params.itemId,
      itemType: params.itemType,
      patientId: params.patientId,
      authorName: params.authorName,
      contentSnippet: params.contentSnippet,
      status: initialStatus,
      flaggedReasons: scan.flaggedReasons,
      createdAt: new Date().toISOString(),
    };

    this.moderationQueue.set(params.itemId, item);
    return item;
  }

  /**
   * Processes moderation decision by an ASHA worker or platform administrator
   */
  public static reviewItem(
    itemId: string,
    decision: ModerationStatus,
    reviewerName: string,
    reviewNotes?: string
  ): ModerationQueueItem {
    const item = this.moderationQueue.get(itemId);
    if (!item) {
      throw new Error(`Moderation item '${itemId}' not found.`);
    }

    item.status = decision;
    item.reviewedBy = reviewerName;
    item.reviewedAt = new Date().toISOString();
    if (reviewNotes && !item.flaggedReasons.includes(reviewNotes)) {
      item.flaggedReasons.push(reviewNotes);
    }

    this.moderationQueue.set(itemId, item);
    return item;
  }

  /**
   * Retrieves pending items requiring ASHA review
   */
  public static getPendingQueue(): ModerationQueueItem[] {
    const pending: ModerationQueueItem[] = [];
    this.moderationQueue.forEach((item) => {
      if (item.status === "PENDING_REVIEW" || item.status === "FLAGGED_PII") {
        pending.push(item);
      }
    });
    return pending;
  }
}
