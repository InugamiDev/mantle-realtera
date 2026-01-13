// RealTera API Authentication Middleware
// Handles API key validation and rate limiting

import { NextRequest, NextResponse } from "next/server";
import { MOCK_API_KEYS, type ApiKey, type ApiPermission } from "./mock/api-keys";

// ============================================================================
// TYPES
// ============================================================================

export interface AuthResult {
  authenticated: boolean;
  apiKey?: ApiKey;
  error?: string;
  errorCode?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  error?: string;
}

// ============================================================================
// MOCK MODE DETECTION
// ============================================================================

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true" ||
                   process.env.NEXT_PUBLIC_MOCK_BLOCKCHAIN === "true" ||
                   process.env.NODE_ENV === "development";

// ============================================================================
// API KEY VALIDATION
// ============================================================================

/**
 * Validate an API key from request headers
 */
export function validateApiKey(request: NextRequest): AuthResult {
  const apiKey = request.headers.get("X-API-Key") ||
                 request.headers.get("x-api-key") ||
                 request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return {
      authenticated: false,
      error: "API key is required. Provide it via X-API-Key header.",
      errorCode: "MISSING_API_KEY",
    };
  }

  // In mock mode, check against mock keys
  if (isMockMode) {
    const mockKey = MOCK_API_KEYS[apiKey];
    if (mockKey && mockKey.isActive) {
      return {
        authenticated: true,
        apiKey: mockKey,
      };
    }
  }

  // In production, would check against database
  // For now, reject if not in mock keys
  return {
    authenticated: false,
    error: "Invalid API key",
    errorCode: "INVALID_API_KEY",
  };
}

/**
 * Check if an API key has a specific permission
 */
export function hasPermission(apiKey: ApiKey, permission: ApiPermission): boolean {
  if (apiKey.permissions.includes("admin:all")) {
    return true;
  }
  return apiKey.permissions.includes(permission);
}

/**
 * Check multiple permissions (all required)
 */
export function hasAllPermissions(apiKey: ApiKey, permissions: ApiPermission[]): boolean {
  return permissions.every((perm) => hasPermission(apiKey, perm));
}

/**
 * Check multiple permissions (any required)
 */
export function hasAnyPermission(apiKey: ApiKey, permissions: ApiPermission[]): boolean {
  return permissions.some((perm) => hasPermission(apiKey, perm));
}

// ============================================================================
// RATE LIMITING
// ============================================================================

// In-memory rate limit store (in production, use Redis)
const rateLimitStore: Record<string, { count: number; resetAt: number }> = {};

/**
 * Check rate limit for an API key
 */
export function checkRateLimit(apiKey: ApiKey): RateLimitResult {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const windowStart = Math.floor(now / hourMs) * hourMs;
  const windowEnd = windowStart + hourMs;

  const key = `ratelimit:${apiKey.id}:${windowStart}`;

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 0, resetAt: windowEnd };
  }

  const limit = rateLimitStore[key];

  // Clean up old entries
  for (const k of Object.keys(rateLimitStore)) {
    if (rateLimitStore[k].resetAt < now) {
      delete rateLimitStore[k];
    }
  }

  if (limit.count >= apiKey.rateLimit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: limit.resetAt,
      error: `Rate limit exceeded. Limit: ${apiKey.rateLimit} requests per hour.`,
    };
  }

  limit.count++;

  return {
    allowed: true,
    remaining: apiKey.rateLimit - limit.count,
    resetAt: limit.resetAt,
  };
}

// ============================================================================
// MIDDLEWARE HELPER
// ============================================================================

/**
 * Create an API middleware that validates authentication and permissions
 */
export function createApiMiddleware(options: {
  requiredPermissions?: ApiPermission[];
  anyPermission?: ApiPermission[];
  checkRateLimit?: boolean;
}) {
  return async (request: NextRequest): Promise<{ success: true; apiKey: ApiKey } | NextResponse> => {
    // Validate API key
    const authResult = validateApiKey(request);
    if (!authResult.authenticated || !authResult.apiKey) {
      return NextResponse.json(
        {
          error: authResult.error,
          code: authResult.errorCode,
        },
        { status: 401 }
      );
    }

    const apiKey = authResult.apiKey;

    // Check required permissions
    if (options.requiredPermissions && options.requiredPermissions.length > 0) {
      if (!hasAllPermissions(apiKey, options.requiredPermissions)) {
        return NextResponse.json(
          {
            error: "Insufficient permissions",
            code: "INSUFFICIENT_PERMISSIONS",
            required: options.requiredPermissions,
          },
          { status: 403 }
        );
      }
    }

    // Check any permission
    if (options.anyPermission && options.anyPermission.length > 0) {
      if (!hasAnyPermission(apiKey, options.anyPermission)) {
        return NextResponse.json(
          {
            error: "Insufficient permissions",
            code: "INSUFFICIENT_PERMISSIONS",
            anyOf: options.anyPermission,
          },
          { status: 403 }
        );
      }
    }

    // Check rate limit
    if (options.checkRateLimit !== false) {
      const rateLimitResult = checkRateLimit(apiKey);
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            error: rateLimitResult.error,
            code: "RATE_LIMIT_EXCEEDED",
            resetAt: new Date(rateLimitResult.resetAt).toISOString(),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": apiKey.rateLimit.toString(),
              "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
              "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
              "Retry-After": Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
            },
          }
        );
      }
    }

    return { success: true, apiKey };
  };
}

// ============================================================================
// RESPONSE HELPERS
// ============================================================================

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

/**
 * Create an error API response
 */
export function apiError(
  error: string,
  code: string,
  status: number,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      ...details,
    },
    { status }
  );
}

// ============================================================================
// HASH UTILITIES
// ============================================================================

/**
 * Hash an API key for storage (in production, use proper hashing)
 */
export function hashApiKey(key: string): string {
  // In production, use bcrypt or similar
  // For demo, just return a simple hash
  return `hash_${key.slice(0, 8)}`;
}

/**
 * Generate a new API key
 */
export function generateApiKey(environment: "production" | "sandbox"): string {
  const prefix = environment === "production" ? "rlt_live_" : "rlt_test_";
  const random = Array.from(
    { length: 24 },
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
  ).join("");
  return `${prefix}${random}`;
}
