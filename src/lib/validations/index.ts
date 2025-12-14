/**
 * Zod Validation Schemas
 *
 * Centralized validation for all API inputs.
 * Using Zod for runtime type checking and validation.
 */

import { z } from "zod";

// ============================================
// Common Validators
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(20),
});

export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens");

export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email().max(255);

export const urlSchema = z.string().url().max(2048);

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format");

export const currencyAmountSchema = z.coerce
  .number()
  .min(0)
  .max(999999999999); // Max ~1 trillion

export const percentageSchema = z.coerce.number().min(0).max(100);

export const dateSchema = z.coerce.date();

export const isoDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

// ============================================
// Project Schemas
// ============================================

export const projectFilterSchema = z.object({
  tier: z
    .enum(["SSS", "S+", "S", "A", "B", "C", "D", "F"])
    .optional(),
  district: z.string().max(100).optional(),
  developer: z.string().max(100).optional(),
  minPrice: currencyAmountSchema.optional(),
  maxPrice: currencyAmountSchema.optional(),
  verified: z.coerce.boolean().optional(),
  search: z.string().max(200).optional(),
  sortBy: z
    .enum(["score", "price", "updatedAt", "name", "tier-score", "updated", "sources"])
    .default("tier-score"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  ...paginationSchema.shape,
});

export const projectCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  developerId: uuidSchema,
  description: z.string().max(5000).optional(),
  address: z.string().max(500),
  district: z.string().max(100),
  city: z.string().max(100).default("Ho Chi Minh City"),
  country: z.string().max(100).default("Vietnam"),
  priceMin: currencyAmountSchema,
  priceMax: currencyAmountSchema,
  unitCount: z.coerce.number().int().min(1).max(100000),
  startDate: dateSchema.optional(),
  completionDate: dateSchema.optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

// ============================================
// Auction Schemas
// ============================================

export const auctionBidSchema = z.object({
  amount: currencyAmountSchema.refine((val) => val >= 1000000, {
    message: "Minimum bid is 1,000,000 VND",
  }),
  projectSlug: slugSchema,
});

export const auctionCreateSchema = z.object({
  slotType: z.enum(["HOMEPAGE_FEATURED", "SEARCH_TOP", "CATEGORY_BANNER"]),
  slotName: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  startPrice: currencyAmountSchema.default(1000000),
  minBidIncrement: currencyAmountSchema.default(100000),
  startTime: dateSchema,
  endTime: dateSchema,
});

// ============================================
// Watchlist Schemas
// ============================================

export const watchlistAddSchema = z.object({
  projectSlug: slugSchema,
  notes: z.string().max(1000).optional(),
});

// ============================================
// Alert Schemas
// ============================================

export const alertCreateSchema = z.object({
  type: z.enum([
    "PRICE_CHANGE",
    "TIER_CHANGE",
    "NEW_PROJECT",
    "VERIFICATION_UPDATE",
    "CONSTRUCTION_UPDATE",
  ]),
  projectSlug: slugSchema.optional(),
  district: z.string().max(100).optional(),
  developerId: uuidSchema.optional(),
  thresholdPercentage: percentageSchema.optional(),
  enabled: z.boolean().default(true),
});

// ============================================
// Onboarding Schemas
// ============================================

export const onboardingAccountTypeSchema = z.object({
  accountType: z.enum(["investor", "agency", "developer", "api_user"]),
});

export const onboardingProfileSchema = z.object({
  displayName: z.string().min(1).max(100),
  phone: phoneSchema.optional(),
  company: z.string().max(200).optional(),
  position: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
});

export const onboardingCompleteSchema = z.object({
  action: z.literal("complete"),
});

export const onboardingStepSchema = z.object({
  step: z.string().max(50),
});

// ============================================
// Verification Schemas
// ============================================

export const verificationRequestSchema = z.object({
  projectId: uuidSchema,
  level: z.coerce.number().int().min(1).max(4),
  documents: z
    .array(
      z.object({
        type: z.enum([
          "LEGAL_STATUS",
          "OWNERSHIP",
          "PERMIT",
          "DEVELOPER_BACKGROUND",
          "FINANCIALS",
          "CONSTRUCTION_PROGRESS",
        ]),
        url: urlSchema,
        name: z.string().max(200),
      })
    )
    .min(1)
    .max(20),
  notes: z.string().max(2000).optional(),
});

// ============================================
// Portfolio Schemas
// ============================================

export const portfolioHoldingSchema = z.object({
  projectSlug: slugSchema,
  unitType: z.string().max(100),
  unitNumber: z.string().max(50).optional(),
  purchasePrice: currencyAmountSchema,
  purchaseDate: dateSchema,
  currentValue: currencyAmountSchema.optional(),
  notes: z.string().max(1000).optional(),
});

// ============================================
// Lead Generation Schemas
// ============================================

export const leadSubmitSchema = z.object({
  name: z.string().min(1).max(100),
  email: emailSchema,
  phone: phoneSchema,
  projectSlug: slugSchema.optional(),
  message: z.string().max(2000).optional(),
  budget: z.enum(["under_1b", "1b_3b", "3b_5b", "5b_10b", "over_10b"]).optional(),
  timeline: z.enum(["immediately", "1_3_months", "3_6_months", "6_12_months", "exploring"]).optional(),
  consent: z.literal(true, {
    error: "You must consent to data processing",
  }),
});

// ============================================
// Subscription Schemas
// ============================================

export const subscriptionCreateSchema = z.object({
  plan: z.enum(["PRO", "ENTERPRISE"]),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  paymentMethodId: z.string().optional(),
});

// ============================================
// API Key Schemas
// ============================================

export const apiKeyCreateSchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z
    .array(z.enum(["read:projects", "read:developers", "read:market", "write:all"]))
    .min(1),
  expiresAt: dateSchema.optional(),
});

// ============================================
// Attestation Schemas
// ============================================

export const attestationRequestSchema = z.object({
  assetId: uuidSchema,
  schemaId: z.string().min(1).max(100),
  claims: z.record(z.string(), z.unknown()),
  evidenceHashes: z.array(z.string().length(64)).optional(), // SHA-256 hashes
});

// ============================================
// Advisor Chat Schemas
// ============================================

export const advisorChatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: uuidSchema.optional(),
  context: z
    .object({
      projectSlug: slugSchema.optional(),
      district: z.string().max(100).optional(),
    })
    .optional(),
});

// ============================================
// Valuation Request Schema
// ============================================

export const valuationRequestSchema = z.object({
  address: z.string().min(1).max(500),
  propertyType: z.enum(["apartment", "house", "villa", "townhouse", "land"]),
  area: z.coerce.number().min(10).max(10000), // sqm
  bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  bathrooms: z.coerce.number().int().min(0).max(20).optional(),
  floor: z.coerce.number().int().min(0).max(100).optional(),
  yearBuilt: z.coerce.number().int().min(1900).max(2030).optional(),
  features: z.array(z.string().max(50)).max(20).optional(),
});

// ============================================
// Comment Schemas
// ============================================

export const commentTargetTypeSchema = z.enum(["PROJECT", "DEVELOPER"]);

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(2000, "Comment must be less than 2000 characters"),
  targetType: commentTargetTypeSchema,
  targetId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(2000, "Comment must be less than 2000 characters"),
});

export const createReplySchema = z.object({
  content: z
    .string()
    .min(5, "Reply must be at least 5 characters")
    .max(1000, "Reply must be less than 1000 characters"),
});

export const commentVoteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

export const reportCommentSchema = z.object({
  reason: z.enum(["SPAM", "HARASSMENT", "MISINFORMATION", "INAPPROPRIATE", "OTHER"]),
  details: z.string().max(500).optional(),
});

export const commentsQuerySchema = z.object({
  targetType: commentTargetTypeSchema,
  targetId: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "FLAGGED"]).optional(),
  sortBy: z.enum(["createdAt", "upvoteCount", "rating"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  ...paginationSchema.shape,
});

// ============================================
// Utility Functions
// ============================================

/**
 * Validate request body with Zod schema
 * Returns parsed data or throws validation error
 */
export async function validateBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
      throw new ValidationError(messages.join("; "), error.issues);
    }
    throw new ValidationError("Invalid JSON body");
  }
}

/**
 * Validate URL search params with Zod schema
 */
export function validateSearchParams<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const params: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const existing = params[key];
    if (existing) {
      params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      params[key] = value;
    }
  });

  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
      throw new ValidationError(messages.join("; "), error.issues);
    }
    throw new ValidationError("Invalid query parameters");
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public readonly issues: z.ZodIssue[];
  public readonly statusCode = 400;

  constructor(message: string, issues: z.ZodIssue[] = []) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }

  toJSON() {
    return {
      error: "Validation Error",
      message: this.message,
      details: this.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
        code: e.code,
      })),
    };
  }
}

/**
 * Sanitize string input - remove dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Sanitize object values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };

  for (const key in result) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }

  return result;
}

// Export all schemas as a namespace for convenience
export const Schemas = {
  pagination: paginationSchema,
  slug: slugSchema,
  uuid: uuidSchema,
  email: emailSchema,
  url: urlSchema,
  phone: phoneSchema,
  currencyAmount: currencyAmountSchema,
  percentage: percentageSchema,
  date: dateSchema,
  isoDateString: isoDateStringSchema,
  projectFilter: projectFilterSchema,
  projectCreate: projectCreateSchema,
  projectUpdate: projectUpdateSchema,
  auctionBid: auctionBidSchema,
  auctionCreate: auctionCreateSchema,
  watchlistAdd: watchlistAddSchema,
  alertCreate: alertCreateSchema,
  onboardingAccountType: onboardingAccountTypeSchema,
  onboardingProfile: onboardingProfileSchema,
  onboardingComplete: onboardingCompleteSchema,
  onboardingStep: onboardingStepSchema,
  verificationRequest: verificationRequestSchema,
  portfolioHolding: portfolioHoldingSchema,
  leadSubmit: leadSubmitSchema,
  subscriptionCreate: subscriptionCreateSchema,
  apiKeyCreate: apiKeyCreateSchema,
  attestationRequest: attestationRequestSchema,
  advisorChat: advisorChatSchema,
  valuationRequest: valuationRequestSchema,
  // Comment schemas
  createComment: createCommentSchema,
  updateComment: updateCommentSchema,
  createReply: createReplySchema,
  commentVote: commentVoteSchema,
  reportComment: reportCommentSchema,
  commentsQuery: commentsQuerySchema,
};

export type ProjectFilter = z.infer<typeof projectFilterSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type AuctionBid = z.infer<typeof auctionBidSchema>;
export type AlertCreate = z.infer<typeof alertCreateSchema>;
export type LeadSubmit = z.infer<typeof leadSubmitSchema>;
export type ValuationRequest = z.infer<typeof valuationRequestSchema>;

// Comment types
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
export type CreateReply = z.infer<typeof createReplySchema>;
export type CommentVote = z.infer<typeof commentVoteSchema>;
export type ReportComment = z.infer<typeof reportCommentSchema>;
export type CommentsQuery = z.infer<typeof commentsQuerySchema>;
