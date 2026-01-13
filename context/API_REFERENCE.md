# RealTera API Reference

**Base URL:** `/api/v1`
**Authentication:** Stack Auth (Bearer token)
**Response Format:** JSON

---

## Core APIs

### Projects

#### List Projects
```http
GET /api/v1/projects
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| tier | string | Filter by tier (SSS, S+, S, A, B, C, D, F) |
| district | string | Filter by district |
| developer | string | Filter by developer slug |
| minScore | number | Minimum score (0-100) |
| maxPrice | number | Maximum price |
| verified | boolean | Only verified projects |
| limit | number | Results per page (default: 20) |
| offset | number | Pagination offset |

**Response:**
```json
{
  "projects": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

#### Get Project
```http
GET /api/v1/projects/[slug]
```

**Response:**
```json
{
  "project": {
    "id": "...",
    "slug": "vinhomes-grand-park",
    "name": "Vinhomes Grand Park",
    "tier": "S+",
    "score": 88,
    "developer": {...},
    "location": {...},
    "prices": {...},
    "scoreBreakdown": {...},
    "signals": [...],
    "verdict": "..."
  }
}
```

---

### Developers

#### List Developers
```http
GET /api/v1/developers
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| tier | string | Filter by tier |
| verified | boolean | Only verified developers |
| limit | number | Results per page |
| offset | number | Pagination offset |

#### Get Developer
```http
GET /api/v1/developers/[slug]
```

**Response:**
```json
{
  "developer": {
    "id": "...",
    "slug": "vingroup",
    "name": "Vingroup",
    "tier": "SSS",
    "score": 95,
    "projects": [...],
    "scoreBreakdown": {...}
  }
}
```

---

### Search

#### Global Search
```http
GET /api/v1/search
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search query (required) |
| type | string | Filter type: project, developer, all |

**Response:**
```json
{
  "projects": [...],
  "developers": [...],
  "total": 15
}
```

---

## User APIs

### Watchlist

#### Get Watchlist
```http
GET /api/v1/watchlist
```
*Requires authentication*

#### Add to Watchlist
```http
POST /api/v1/watchlist
```
**Body:**
```json
{
  "projectSlug": "vinhomes-grand-park"
}
```

#### Remove from Watchlist
```http
DELETE /api/v1/watchlist/[projectSlug]
```

---

### Portfolio

#### Get Portfolio
```http
GET /api/v1/portfolio
```
*Requires authentication*

#### Add Property
```http
POST /api/v1/portfolio
```
**Body:**
```json
{
  "projectSlug": "...",
  "unitType": "2BR",
  "purchasePrice": 3500000000,
  "purchaseDate": "2024-01-15",
  "area": 70
}
```

---

### Alerts

#### Get Alerts
```http
GET /api/v1/alerts
```

#### Create Alert
```http
POST /api/v1/alerts
```
**Body:**
```json
{
  "type": "new_launch",
  "filters": {
    "district": "Quận 2",
    "maxPrice": 5000000000,
    "minTier": "A"
  }
}
```

#### Custom Triggers
```http
POST /api/v1/alerts/triggers
```
**Body:**
```json
{
  "projectSlug": "...",
  "conditions": [
    { "field": "price", "operator": "decreases_by", "value": 5 },
    { "field": "tier", "operator": "upgrades" }
  ]
}
```

---

## Revenue APIs

### Subscriptions

#### Get Plans
```http
GET /api/v1/subscriptions
```

**Response:**
```json
{
  "plans": [
    { "id": "free", "name": "Free", "price": 0, "features": [...] },
    { "id": "pro", "name": "Pro", "price": 199000, "features": [...] },
    { "id": "enterprise", "name": "Enterprise", "price": 999000, "features": [...] }
  ]
}
```

#### Subscribe
```http
POST /api/v1/subscriptions
```
**Body:**
```json
{
  "planId": "pro",
  "paymentMethodId": "pm_..."
}
```

---

### Verification

#### Request Verification
```http
POST /api/v1/verification
```
**Body:**
```json
{
  "projectSlug": "...",
  "tier": "STANDARD",
  "contactEmail": "...",
  "documents": [...]
}
```

**Tiers:**
- BASIC: 1,000,000 VND - Document verification
- STANDARD: 3,000,000 VND - + On-site inspection
- PREMIUM: 5,000,000 VND - + Priority processing

---

### Reports

#### Request Report
```http
POST /api/v1/reports
```
**Body:**
```json
{
  "projectSlug": "...",
  "type": "COMPREHENSIVE"
}
```

**Types:**
- BASIC: Legal check
- STANDARD: + Market analysis
- COMPREHENSIVE: + Risk assessment, projections

---

### Leads

#### Submit Lead
```http
POST /api/v1/leads
```
**Body:**
```json
{
  "projectSlug": "...",
  "name": "...",
  "phone": "...",
  "email": "...",
  "budget": 5000000000,
  "timeline": "3-6 months"
}
```

---

## Intelligence APIs

### Market Data

#### Get Overview
```http
GET /api/v1/market-data?type=overview
```

**Response:**
```json
{
  "totalProjects": 150,
  "totalDevelopers": 45,
  "avgMarketScore": 72,
  "tierDistribution": {...},
  "verificationRate": 68
}
```

#### Get District Stats
```http
GET /api/v1/market-data?type=district&district=Quận 2
```

---

### Heatmaps

```http
GET /api/v1/heatmaps?type=projects
```

**Types:** projects, prices, tiers, demand, growth

**Response:**
```json
{
  "cells": [
    { "district": "Quận 1", "value": 45, "intensity": 0.8, "label": "45 dự án" }
  ]
}
```

---

### Neighborhoods

```http
GET /api/v1/neighborhoods?district=Quận 2
```

**Response:**
```json
{
  "neighborhood": {
    "name": "Quận 2",
    "avgPrice": 65000000,
    "amenities": {...},
    "schools": [...],
    "transport": [...],
    "developmentPlans": [...]
  }
}
```

---

### Valuation

```http
POST /api/v1/valuation
```
**Body:**
```json
{
  "district": "Quận 2",
  "area": 70,
  "bedrooms": 2,
  "floor": 15,
  "hasBalcony": true
}
```

**Response:**
```json
{
  "valuation": {
    "estimatedValue": { "low": 4200000000, "mid": 4500000000, "high": 4800000000 },
    "pricePerSqm": { "low": 60000000, "mid": 64000000, "high": 68000000 },
    "confidence": "high",
    "factors": [...],
    "marketContext": {...}
  }
}
```

---

### AI Advisor

```http
POST /api/v1/advisor
```
**Body:**
```json
{
  "message": "Dự án nào tốt nhất ở Quận 2 dưới 5 tỷ?",
  "conversationId": "..." // optional for context
}
```

**Response:**
```json
{
  "conversationId": "...",
  "response": {
    "message": "...",
    "relatedProjects": [...],
    "followUpQuestions": [...]
  }
}
```

---

## Webhook Events

### Stripe Webhooks
**Endpoint:** `POST /api/webhooks/stripe`

**Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

---

## Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

**Common Codes:**
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `RATE_LIMITED` - 429
- `SERVER_ERROR` - 500

---

## Rate Limits

| Tier | Requests/min | Requests/day |
|------|-------------|--------------|
| FREE | 10 | 100 |
| PRO | 60 | 5,000 |
| ENTERPRISE | 300 | Unlimited |
