-- CreateEnum
CREATE TYPE "UserTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE', 'DEVELOPER', 'AGENCY', 'API_USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('INVESTOR', 'INVESTOR_PRO', 'AGENCY_OWNER', 'AGENCY_ADMIN', 'AGENCY_AGENT', 'DEVELOPER_OWNER', 'DEVELOPER_ADMIN', 'DEVELOPER_STAFF', 'API_READONLY', 'API_FULL', 'PLATFORM_ADMIN', 'PLATFORM_SUPPORT');

-- CreateEnum
CREATE TYPE "PermissionCode" AS ENUM ('READ_PROJECTS', 'WRITE_PROJECTS', 'DELETE_PROJECTS', 'READ_ATTESTATIONS', 'CREATE_ATTESTATIONS', 'UPDATE_ATTESTATIONS', 'READ_COLLECTIONS', 'WRITE_COLLECTIONS', 'SHARE_COLLECTIONS', 'API_READ', 'API_WRITE', 'API_ADMIN', 'ADMIN_USERS', 'ADMIN_PROJECTS', 'ADMIN_ATTESTATIONS', 'ADMIN_BILLING');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'PAUSED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PRICE_CHANGE', 'NEW_LAUNCH', 'TIER_CHANGE', 'CONSTRUCTION_UPDATE', 'VERIFICATION_UPDATE', 'CUSTOM', 'WATCHLIST');

-- CreateEnum
CREATE TYPE "CommentTargetType" AS ENUM ('PROJECT', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "VerificationRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED', 'FINALIZED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "tier" "UserTier" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" "PermissionCode" NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "organizationId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "stackAuthId" TEXT,
    "email" TEXT,
    "displayName" TEXT,
    "profileImageUrl" TEXT,
    "tier" "UserTier" NOT NULL DEFAULT 'FREE',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "evmWalletAddress" TEXT,
    "primaryAuthMethod" TEXT DEFAULT 'email',
    "walletLinkedAt" TIMESTAMP(3),
    "apiCallsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "apiCallsLimit" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "onboardedAt" TIMESTAMP(3),
    "onboardingStep" TEXT,
    "accountType" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiweNonce" (
    "id" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiweNonce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "UserTier" NOT NULL DEFAULT 'ENTERPRISE',
    "stripeCustomerId" TEXT,
    "maxSeats" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "foundedYear" INTEGER,
    "headquarters" TEXT,
    "website" TEXT,
    "stockCode" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "financialHealthScore" INTEGER,
    "deliveryTrackRecord" INTEGER,
    "legalComplianceScore" INTEGER,
    "customerSatisfactionScore" INTEGER,
    "overallScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'Unverified',
    "sponsored" BOOLEAN NOT NULL DEFAULT false,
    "sponsorExpiresAt" TIMESTAMP(3),
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "verdict" TEXT,
    "roiLabel" TEXT,
    "sourceCount" INTEGER NOT NULL DEFAULT 0,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSignal" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "legalStatus" TEXT,
    "priceRange" TEXT,
    "liquidityStatus" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMetrics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalUnits" INTEGER,
    "soldUnits" INTEGER,
    "availableUnits" INTEGER,
    "salesProgress" DECIMAL(5,2),
    "launchDate" TIMESTAMP(3),
    "estimatedCompletion" TIMESTAMP(3),
    "minPricePerSqm" BIGINT,
    "maxPricePerSqm" BIGINT,
    "avgPricePerSqm" BIGINT,
    "priceChange3M" DECIMAL(5,2),
    "priceChange12M" DECIMAL(5,2),
    "estimatedRoiMin" DECIMAL(5,2),
    "estimatedRoiMax" DECIMAL(5,2),
    "rentalYield" DECIMAL(5,2),
    "avgRentPrice" BIGINT,
    "capitalGrowth1Y" DECIMAL(5,2),
    "capitalGrowth3Y" DECIMAL(5,2),
    "paybackPeriod" INTEGER,
    "minArea" INTEGER,
    "maxArea" INTEGER,
    "avgArea" INTEGER,
    "totalLandArea" DECIMAL(10,2),
    "greenSpaceRatio" DECIMAL(5,2),
    "buildingDensity" DECIMAL(5,2),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectScoreCategory" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "weight" DECIMAL(3,2) NOT NULL DEFAULT 1.0,

    CONSTRAINT "ProjectScoreCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEvidence" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectHistory" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "tierChange" TEXT,
    "scoreChange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectWhyBullet" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectWhyBullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectKeyRisk" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectKeyRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBestFor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectBestFor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "displayNameEn" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "calculationMethod" TEXT NOT NULL,
    "requiredEvidence" TEXT[],
    "requiredAttestations" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "score_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_runs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "codeVersion" TEXT NOT NULL,
    "weightsVersion" TEXT NOT NULL,
    "inputsHash" TEXT NOT NULL,
    "evidenceSetHash" TEXT NOT NULL,
    "outputJson" JSONB NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "tierResult" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "computedBy" TEXT,
    "computeMethod" TEXT NOT NULL DEFAULT 'automatic',
    "previousRunId" TEXT,

    CONSTRAINT "score_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_run_evidence_links" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "note" TEXT,

    CONSTRAINT "score_run_evidence_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_run_attestation_links" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "attestationId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,

    CONSTRAINT "score_run_attestation_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_diffs" (
    "id" TEXT NOT NULL,
    "fromRunId" TEXT NOT NULL,
    "toRunId" TEXT NOT NULL,
    "componentDeltas" JSONB NOT NULL,
    "totalDelta" INTEGER NOT NULL,
    "tierChanged" BOOLEAN NOT NULL,
    "oldTier" TEXT,
    "newTier" TEXT,
    "explanationText" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "reviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "reviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_diffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issuers" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "jurisdiction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verificationNote" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issuers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issuer_credentials" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "credentialType" TEXT NOT NULL,
    "credentialNumber" TEXT,
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "verificationMethod" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "documentUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issuer_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issuer_keys" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "keyName" TEXT,
    "publicKey" TEXT NOT NULL,
    "keyType" TEXT NOT NULL,
    "keyAlgorithm" TEXT,
    "chainAddress" TEXT,
    "activeFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issuer_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issuer_members" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "canSign" BOOLEAN NOT NULL DEFAULT false,
    "canRevoke" BOOLEAN NOT NULL DEFAULT false,
    "canManage" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "issuer_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issuer_scopes" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "schemaId" TEXT NOT NULL,
    "maxAttestationsPerMonth" INTEGER,
    "requiresDualControl" BOOLEAN NOT NULL DEFAULT false,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,

    CONSTRAINT "issuer_scopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attestation_schemas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "displayNameVi" TEXT,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "fieldsJson" JSONB NOT NULL,
    "defaultExpiryDays" INTEGER,
    "requiresDualControl" BOOLEAN NOT NULL DEFAULT false,
    "requiresEvidence" BOOLEAN NOT NULL DEFAULT true,
    "scoreComponent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attestation_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaPricing" (
    "id" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "avgPricePerSqm" BIGINT NOT NULL,
    "avgRentPerSqm" BIGINT NOT NULL,
    "priceToRentRatio" DECIMAL(5,2) NOT NULL,
    "trend" TEXT NOT NULL,
    "yoyChange" DECIMAL(5,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeighborhoodData" (
    "id" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "population" INTEGER,
    "avgIncome" BIGINT,
    "ageDistribution" JSONB,
    "schoolsCount" INTEGER,
    "hospitalsCount" INTEGER,
    "mallsCount" INTEGER,
    "metroStationsCount" INTEGER,
    "livabilityScore" INTEGER,
    "investmentPotentialScore" INTEGER,
    "infrastructureScore" INTEGER,
    "centerLatitude" DECIMAL(10,8),
    "centerLongitude" DECIMAL(11,8),
    "boundaryGeojson" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeighborhoodData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "notes" TEXT,
    "priceAtAdd" BIGINT,
    "targetPrice" BIGINT,
    "alertOnPriceChange" BOOLEAN NOT NULL DEFAULT false,
    "alertThresholdPercent" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Portfolio',
    "totalValue" BIGINT,
    "totalGainLoss" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" BIGINT,
    "unitArea" DECIMAL(10,2),
    "currentValue" BIGINT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alertType" "AlertType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "channels" JSONB,
    "filters" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alertType" "AlertType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "projectId" TEXT,
    "developerId" TEXT,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "targetType" "CommentTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "rating" SMALLINT,
    "upvoteCount" INTEGER NOT NULL DEFAULT 0,
    "downvoteCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "moderationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "upvoteCount" INTEGER NOT NULL DEFAULT 0,
    "downvoteCount" INTEGER NOT NULL DEFAULT 0,
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVote" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentReplyVote" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentReplyVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentReport" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCalculation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calculatorType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "outputs" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyValuation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT,
    "unitArea" DECIMAL(10,2),
    "floorNumber" INTEGER,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "viewType" TEXT,
    "condition" TEXT,
    "additionalFeatures" JSONB,
    "estimatedValueLow" BIGINT,
    "estimatedValueMid" BIGINT,
    "estimatedValueHigh" BIGINT,
    "confidenceScore" DECIMAL(3,2),
    "comparableSales" JSONB,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyValuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerIntentSignal" (
    "id" TEXT NOT NULL,
    "anonymousUserHash" TEXT,
    "projectId" TEXT,
    "developerId" TEXT,
    "signalType" TEXT NOT NULL,
    "signalStrength" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuyerIntentSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricePrediction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "district" TEXT,
    "city" TEXT,
    "predictionDate" TIMESTAMP(3) NOT NULL,
    "price1M" BIGINT,
    "price3M" BIGINT,
    "price6M" BIGINT,
    "price12M" BIGINT,
    "confidenceLevel" DECIMAL(3,2),
    "modelVersion" TEXT,
    "factors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricePrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeatmapData" (
    "id" TEXT NOT NULL,
    "cellId" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "metricType" TEXT NOT NULL,
    "metricValue" DECIMAL(15,2) NOT NULL,
    "normalizedValue" DECIMAL(3,2) NOT NULL,
    "period" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeatmapData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfrastructureProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3),
    "impactRadiusKm" DECIMAL(5,2),
    "estimatedPriceImpact" DECIMAL(5,2),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "routeGeojson" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InfrastructureProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructionProgress" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "overallProgress" DECIMAL(5,2) NOT NULL,
    "phase" TEXT,
    "description" TEXT,
    "images" JSONB,
    "videoUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConstructionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "developerId" TEXT,
    "requesterId" TEXT NOT NULL,
    "status" "VerificationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestType" TEXT NOT NULL,
    "pricePaid" BIGINT,
    "stripePaymentId" TEXT,
    "notes" TEXT,
    "reviewerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attestation" (
    "id" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL DEFAULT 'project',
    "subjectId" TEXT,
    "issuerId" TEXT,
    "schemaId" TEXT,
    "dataJson" JSONB,
    "dataHash" TEXT,
    "evidenceRefs" TEXT[],
    "evidenceHash" TEXT,
    "projectId" TEXT,
    "verificationRequestId" TEXT,
    "attestationType" TEXT NOT NULL DEFAULT 'project_verified',
    "tierAtAttestation" TEXT,
    "scoreAtAttestation" INTEGER,
    "metadataUri" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "revocationReason" TEXT,
    "attestorId" TEXT,
    "reviewerId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "signature" TEXT,
    "signatureType" TEXT,
    "chainId" INTEGER,
    "txHash" TEXT,
    "contractAddress" TEXT,
    "blockNumber" INTEGER,
    "anchoredAt" TIMESTAMP(3),
    "tokenId" BIGINT,
    "tokenType" TEXT,
    "derivedTokenId" BIGINT,
    "derivedTokenType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "UserTier" NOT NULL,
    "stripePriceId" TEXT,
    "priceMonthly" BIGINT,
    "priceYearly" BIGINT,
    "features" JSONB,
    "apiCallsLimit" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformLicense" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "monthlyFee" BIGINT,
    "features" JSONB,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PlatformLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WidgetConfiguration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,
    "widgetType" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "allowedDomains" TEXT[],
    "customization" JSONB,
    "impressionsCount" BIGINT NOT NULL DEFAULT 0,
    "clicksCount" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WidgetConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DueDiligenceReport" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "developerId" TEXT,
    "reportType" TEXT NOT NULL,
    "generatedById" TEXT,
    "stripePaymentId" TEXT,
    "pricePaid" BIGINT,
    "reportData" JSONB,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "DueDiligenceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketReport" (
    "id" TEXT NOT NULL,
    "reportPeriod" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "reportData" JSONB,
    "pdfUrl" TEXT,
    "price" BIGINT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "requiredTier" "UserTier",
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "amountPaid" BIGINT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "name" TEXT,
    "permissions" JSONB,
    "rateLimitPerMinute" INTEGER NOT NULL DEFAULT 60,
    "rateLimitPerDay" INTEGER NOT NULL DEFAULT 10000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsageLog" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseTimeMs" INTEGER,
    "requestIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "modelUsed" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usageDate" DATE NOT NULL,
    "messagesCount" INTEGER NOT NULL DEFAULT 0,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NftProjectProfile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contractAddress" TEXT,
    "tokenId" BIGINT,
    "chainId" INTEGER,
    "metadataUri" TEXT,
    "tier" TEXT,
    "mintedAt" TIMESTAMP(3),
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NftProjectProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NftHolding" (
    "id" TEXT NOT NULL,
    "nftProfileId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "txHash" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NftHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationSbtRecord" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "contractAddress" TEXT,
    "tokenId" BIGINT,
    "txHash" TEXT,
    "chainId" INTEGER,
    "verificationHistory" JSONB,
    "currentTier" TEXT,
    "currentScore" INTEGER,
    "mintedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationSbtRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_leads" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "interestedProjects" TEXT[],
    "budgetMin" BIGINT,
    "budgetMax" BIGINT,
    "preferredDistricts" TEXT[],
    "timeline" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_purchases" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "pricePaid" BIGINT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_slots" (
    "id" TEXT NOT NULL,
    "slotType" TEXT NOT NULL,
    "slotPosition" INTEGER NOT NULL,
    "maxProjects" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsored_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_auctions" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "slotType" TEXT NOT NULL,
    "slotName" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "minBid" BIGINT NOT NULL,
    "currentBid" BIGINT,
    "currentBidderId" TEXT,
    "winningProjectId" TEXT,
    "winningBidId" TEXT,
    "status" "AuctionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsored_auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_bids" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "developerId" TEXT,
    "projectId" TEXT NOT NULL,
    "bidAmount" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isWinning" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsored_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsored_placements" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "bidId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "impressions" BIGINT NOT NULL DEFAULT 0,
    "clicks" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsored_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulting_engagements" (
    "id" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "engagementType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "contractValue" BIGINT,
    "stripePaymentId" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "deliverables" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consulting_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_categories" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" JSONB,
    "prizeDescription" TEXT,
    "nominationFee" BIGINT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "award_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_nominations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "developerId" TEXT,
    "projectId" TEXT,
    "nominatedById" TEXT,
    "stripePaymentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "score" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "award_nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_winners" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nominationId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "announcedAt" TIMESTAMP(3),
    "badgeIssued" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "award_winners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_type_key" ON "Role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_organizationId_idx" ON "UserRole"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_organizationId_key" ON "UserRole"("userId", "roleId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stackAuthId_key" ON "User"("stackAuthId");

-- CreateIndex
CREATE UNIQUE INDEX "User_evmWalletAddress_key" ON "User"("evmWalletAddress");

-- CreateIndex
CREATE INDEX "User_stackAuthId_idx" ON "User"("stackAuthId");

-- CreateIndex
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "User_evmWalletAddress_idx" ON "User"("evmWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "SiweNonce_nonce_key" ON "SiweNonce"("nonce");

-- CreateIndex
CREATE INDEX "SiweNonce_nonce_idx" ON "SiweNonce"("nonce");

-- CreateIndex
CREATE INDEX "SiweNonce_expiresAt_idx" ON "SiweNonce"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_slug_key" ON "Developer"("slug");

-- CreateIndex
CREATE INDEX "Developer_tier_idx" ON "Developer"("tier");

-- CreateIndex
CREATE INDEX "Developer_slug_idx" ON "Developer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_tier_idx" ON "Project"("tier");

-- CreateIndex
CREATE INDEX "Project_district_idx" ON "Project"("district");

-- CreateIndex
CREATE INDEX "Project_city_idx" ON "Project"("city");

-- CreateIndex
CREATE INDEX "Project_developerId_idx" ON "Project"("developerId");

-- CreateIndex
CREATE INDEX "Project_sponsored_idx" ON "Project"("sponsored");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSignal_projectId_key" ON "ProjectSignal"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMetrics_projectId_key" ON "ProjectMetrics"("projectId");

-- CreateIndex
CREATE INDEX "ProjectScoreCategory_projectId_idx" ON "ProjectScoreCategory"("projectId");

-- CreateIndex
CREATE INDEX "ProjectEvidence_projectId_idx" ON "ProjectEvidence"("projectId");

-- CreateIndex
CREATE INDEX "ProjectHistory_projectId_idx" ON "ProjectHistory"("projectId");

-- CreateIndex
CREATE INDEX "ProjectWhyBullet_projectId_idx" ON "ProjectWhyBullet"("projectId");

-- CreateIndex
CREATE INDEX "ProjectKeyRisk_projectId_idx" ON "ProjectKeyRisk"("projectId");

-- CreateIndex
CREATE INDEX "ProjectBestFor_projectId_idx" ON "ProjectBestFor"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "score_components_name_key" ON "score_components"("name");

-- CreateIndex
CREATE UNIQUE INDEX "score_runs_runId_key" ON "score_runs"("runId");

-- CreateIndex
CREATE INDEX "score_runs_projectId_idx" ON "score_runs"("projectId");

-- CreateIndex
CREATE INDEX "score_runs_computedAt_idx" ON "score_runs"("computedAt");

-- CreateIndex
CREATE INDEX "score_runs_tierResult_idx" ON "score_runs"("tierResult");

-- CreateIndex
CREATE INDEX "score_run_evidence_links_runId_idx" ON "score_run_evidence_links"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "score_run_evidence_links_runId_evidenceId_componentName_key" ON "score_run_evidence_links"("runId", "evidenceId", "componentName");

-- CreateIndex
CREATE INDEX "score_run_attestation_links_runId_idx" ON "score_run_attestation_links"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "score_run_attestation_links_runId_attestationId_key" ON "score_run_attestation_links"("runId", "attestationId");

-- CreateIndex
CREATE UNIQUE INDEX "score_diffs_fromRunId_key" ON "score_diffs"("fromRunId");

-- CreateIndex
CREATE INDEX "score_diffs_toRunId_idx" ON "score_diffs"("toRunId");

-- CreateIndex
CREATE UNIQUE INDEX "issuers_slug_key" ON "issuers"("slug");

-- CreateIndex
CREATE INDEX "issuers_status_idx" ON "issuers"("status");

-- CreateIndex
CREATE INDEX "issuers_type_idx" ON "issuers"("type");

-- CreateIndex
CREATE INDEX "issuer_credentials_issuerId_idx" ON "issuer_credentials"("issuerId");

-- CreateIndex
CREATE INDEX "issuer_credentials_verificationStatus_idx" ON "issuer_credentials"("verificationStatus");

-- CreateIndex
CREATE INDEX "issuer_keys_issuerId_idx" ON "issuer_keys"("issuerId");

-- CreateIndex
CREATE INDEX "issuer_keys_chainAddress_idx" ON "issuer_keys"("chainAddress");

-- CreateIndex
CREATE INDEX "issuer_keys_isActive_idx" ON "issuer_keys"("isActive");

-- CreateIndex
CREATE INDEX "issuer_members_userId_idx" ON "issuer_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "issuer_members_issuerId_userId_key" ON "issuer_members"("issuerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "issuer_scopes_issuerId_schemaId_key" ON "issuer_scopes"("issuerId", "schemaId");

-- CreateIndex
CREATE UNIQUE INDEX "attestation_schemas_name_key" ON "attestation_schemas"("name");

-- CreateIndex
CREATE INDEX "AreaPricing_city_idx" ON "AreaPricing"("city");

-- CreateIndex
CREATE UNIQUE INDEX "AreaPricing_district_city_key" ON "AreaPricing"("district", "city");

-- CreateIndex
CREATE UNIQUE INDEX "NeighborhoodData_district_city_key" ON "NeighborhoodData"("district", "city");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_projectId_key" ON "Watchlist"("userId", "projectId");

-- CreateIndex
CREATE INDEX "Portfolio_userId_idx" ON "Portfolio"("userId");

-- CreateIndex
CREATE INDEX "PortfolioHolding_portfolioId_idx" ON "PortfolioHolding"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "AlertPreference_userId_alertType_key" ON "AlertPreference"("userId", "alertType");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_userId_readAt_idx" ON "Alert"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Comment_targetType_targetId_status_idx" ON "Comment"("targetType", "targetId", "status");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "CommentReply_commentId_idx" ON "CommentReply"("commentId");

-- CreateIndex
CREATE INDEX "CommentReply_authorId_idx" ON "CommentReply"("authorId");

-- CreateIndex
CREATE INDEX "CommentVote_commentId_idx" ON "CommentVote"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVote_commentId_userId_key" ON "CommentVote"("commentId", "userId");

-- CreateIndex
CREATE INDEX "CommentReplyVote_replyId_idx" ON "CommentReplyVote"("replyId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentReplyVote_replyId_userId_key" ON "CommentReplyVote"("replyId", "userId");

-- CreateIndex
CREATE INDEX "CommentReport_resolved_idx" ON "CommentReport"("resolved");

-- CreateIndex
CREATE UNIQUE INDEX "CommentReport_commentId_userId_key" ON "CommentReport"("commentId", "userId");

-- CreateIndex
CREATE INDEX "SavedCalculation_userId_idx" ON "SavedCalculation"("userId");

-- CreateIndex
CREATE INDEX "PropertyValuation_userId_idx" ON "PropertyValuation"("userId");

-- CreateIndex
CREATE INDEX "PropertyValuation_projectId_idx" ON "PropertyValuation"("projectId");

-- CreateIndex
CREATE INDEX "BuyerIntentSignal_projectId_idx" ON "BuyerIntentSignal"("projectId");

-- CreateIndex
CREATE INDEX "BuyerIntentSignal_createdAt_idx" ON "BuyerIntentSignal"("createdAt");

-- CreateIndex
CREATE INDEX "PricePrediction_projectId_idx" ON "PricePrediction"("projectId");

-- CreateIndex
CREATE INDEX "PricePrediction_district_city_idx" ON "PricePrediction"("district", "city");

-- CreateIndex
CREATE UNIQUE INDEX "HeatmapData_cellId_metricType_period_key" ON "HeatmapData"("cellId", "metricType", "period");

-- CreateIndex
CREATE INDEX "ConstructionProgress_projectId_idx" ON "ConstructionProgress"("projectId");

-- CreateIndex
CREATE INDEX "VerificationRequest_status_idx" ON "VerificationRequest"("status");

-- CreateIndex
CREATE INDEX "Attestation_subjectType_subjectId_idx" ON "Attestation"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "Attestation_issuerId_idx" ON "Attestation"("issuerId");

-- CreateIndex
CREATE INDEX "Attestation_schemaId_idx" ON "Attestation"("schemaId");

-- CreateIndex
CREATE INDEX "Attestation_projectId_idx" ON "Attestation"("projectId");

-- CreateIndex
CREATE INDEX "Attestation_txHash_idx" ON "Attestation"("txHash");

-- CreateIndex
CREATE INDEX "Attestation_tokenId_idx" ON "Attestation"("tokenId");

-- CreateIndex
CREATE INDEX "Attestation_issuedAt_idx" ON "Attestation"("issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WidgetConfiguration_apiKey_key" ON "WidgetConfiguration"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiUsageLog_apiKeyId_idx" ON "ApiUsageLog"("apiKeyId");

-- CreateIndex
CREATE INDEX "ApiUsageLog_createdAt_idx" ON "ApiUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "ChatConversation_userId_idx" ON "ChatConversation"("userId");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_idx" ON "ChatMessage"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "AiUsage_userId_usageDate_key" ON "AiUsage"("userId", "usageDate");

-- CreateIndex
CREATE UNIQUE INDEX "NftProjectProfile_projectId_key" ON "NftProjectProfile"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "NftHolding_txHash_key" ON "NftHolding"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationSbtRecord_tokenId_key" ON "VerificationSbtRecord"("tokenId");

-- CreateIndex
CREATE INDEX "VerificationSbtRecord_walletAddress_idx" ON "VerificationSbtRecord"("walletAddress");

-- CreateIndex
CREATE INDEX "VerificationSbtRecord_developerId_idx" ON "VerificationSbtRecord"("developerId");

-- CreateIndex
CREATE INDEX "lead_purchases_developerId_idx" ON "lead_purchases"("developerId");

-- CreateIndex
CREATE INDEX "sponsored_auctions_status_idx" ON "sponsored_auctions"("status");

-- CreateIndex
CREATE INDEX "sponsored_auctions_slotType_idx" ON "sponsored_auctions"("slotType");

-- CreateIndex
CREATE INDEX "sponsored_auctions_winningProjectId_idx" ON "sponsored_auctions"("winningProjectId");

-- CreateIndex
CREATE INDEX "sponsored_bids_auctionId_idx" ON "sponsored_bids"("auctionId");

-- CreateIndex
CREATE INDEX "sponsored_bids_stripeSessionId_idx" ON "sponsored_bids"("stripeSessionId");

-- CreateIndex
CREATE INDEX "sponsored_bids_projectId_idx" ON "sponsored_bids"("projectId");

-- CreateIndex
CREATE INDEX "sponsored_bids_developerId_idx" ON "sponsored_bids"("developerId");

-- CreateIndex
CREATE INDEX "sponsored_placements_isActive_idx" ON "sponsored_placements"("isActive");

-- CreateIndex
CREATE INDEX "sponsored_placements_projectId_idx" ON "sponsored_placements"("projectId");

-- CreateIndex
CREATE INDEX "consulting_engagements_developerId_idx" ON "consulting_engagements"("developerId");

-- CreateIndex
CREATE INDEX "consulting_engagements_status_idx" ON "consulting_engagements"("status");

-- CreateIndex
CREATE UNIQUE INDEX "award_categories_year_name_key" ON "award_categories"("year", "name");

-- CreateIndex
CREATE INDEX "award_nominations_developerId_idx" ON "award_nominations"("developerId");

-- CreateIndex
CREATE INDEX "award_nominations_projectId_idx" ON "award_nominations"("projectId");

-- CreateIndex
CREATE INDEX "award_nominations_status_idx" ON "award_nominations"("status");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSignal" ADD CONSTRAINT "ProjectSignal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMetrics" ADD CONSTRAINT "ProjectMetrics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectScoreCategory" ADD CONSTRAINT "ProjectScoreCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEvidence" ADD CONSTRAINT "ProjectEvidence_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectHistory" ADD CONSTRAINT "ProjectHistory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWhyBullet" ADD CONSTRAINT "ProjectWhyBullet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectKeyRisk" ADD CONSTRAINT "ProjectKeyRisk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBestFor" ADD CONSTRAINT "ProjectBestFor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_runs" ADD CONSTRAINT "score_runs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_run_evidence_links" ADD CONSTRAINT "score_run_evidence_links_runId_fkey" FOREIGN KEY ("runId") REFERENCES "score_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_run_evidence_links" ADD CONSTRAINT "score_run_evidence_links_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "ProjectEvidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_run_attestation_links" ADD CONSTRAINT "score_run_attestation_links_runId_fkey" FOREIGN KEY ("runId") REFERENCES "score_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_run_attestation_links" ADD CONSTRAINT "score_run_attestation_links_attestationId_fkey" FOREIGN KEY ("attestationId") REFERENCES "Attestation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_diffs" ADD CONSTRAINT "score_diffs_fromRunId_fkey" FOREIGN KEY ("fromRunId") REFERENCES "score_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issuer_credentials" ADD CONSTRAINT "issuer_credentials_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "issuers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issuer_keys" ADD CONSTRAINT "issuer_keys_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "issuers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issuer_members" ADD CONSTRAINT "issuer_members_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "issuers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issuer_members" ADD CONSTRAINT "issuer_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issuer_scopes" ADD CONSTRAINT "issuer_scopes_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "issuers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issuer_scopes" ADD CONSTRAINT "issuer_scopes_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "attestation_schemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertPreference" ADD CONSTRAINT "AlertPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVote" ADD CONSTRAINT "CommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReplyVote" ADD CONSTRAINT "CommentReplyVote_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "CommentReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReplyVote" ADD CONSTRAINT "CommentReplyVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReport" ADD CONSTRAINT "CommentReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReport" ADD CONSTRAINT "CommentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCalculation" ADD CONSTRAINT "SavedCalculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyValuation" ADD CONSTRAINT "PropertyValuation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerIntentSignal" ADD CONSTRAINT "BuyerIntentSignal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricePrediction" ADD CONSTRAINT "PricePrediction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionProgress" ADD CONSTRAINT "ConstructionProgress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "issuers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "attestation_schemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_verificationRequestId_fkey" FOREIGN KEY ("verificationRequestId") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformLicense" ADD CONSTRAINT "PlatformLicense_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WidgetConfiguration" ADD CONSTRAINT "WidgetConfiguration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportPurchase" ADD CONSTRAINT "ReportPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportPurchase" ADD CONSTRAINT "ReportPurchase_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MarketReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageLog" ADD CONSTRAINT "ApiUsageLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NftProjectProfile" ADD CONSTRAINT "NftProjectProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_purchases" ADD CONSTRAINT "lead_purchases_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "buyer_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_auctions" ADD CONSTRAINT "sponsored_auctions_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "sponsored_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_bids" ADD CONSTRAINT "sponsored_bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "sponsored_auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsored_placements" ADD CONSTRAINT "sponsored_placements_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "sponsored_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_nominations" ADD CONSTRAINT "award_nominations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "award_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_winners" ADD CONSTRAINT "award_winners_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "award_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_winners" ADD CONSTRAINT "award_winners_nominationId_fkey" FOREIGN KEY ("nominationId") REFERENCES "award_nominations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
