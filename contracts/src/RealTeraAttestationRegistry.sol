// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RealTeraAttestationRegistry
 * @dev Non-transferable attestation registry for real estate verification
 *
 * This is NOT an NFT contract. It is a registry of verification attestations
 * that B2B integrators can query to verify asset legality and due diligence.
 *
 * Deployed on Mantle Network for the Mantle Global Hackathon 2025
 *
 * Key Features:
 * - Non-transferable attestations bound to asset_id
 * - Tiered verification (0-4)
 * - Evidence hash anchoring for tamper-proof audit
 * - Expiry and dispute workflows
 * - Events for B2B monitoring subscriptions
 */
contract RealTeraAttestationRegistry is Ownable, ReentrancyGuard {

    // ============================================================================
    // VERIFICATION TIER CONSTANTS
    // ============================================================================

    uint8 public constant TIER_UNVERIFIED = 0;      // No verification
    uint8 public constant TIER_BASIC = 1;           // Basic document check
    uint8 public constant TIER_STANDARD = 2;        // Document consistency checks
    uint8 public constant TIER_CORROBORATED = 3;    // Registry corroboration / partner co-sign
    uint8 public constant TIER_MONITORED = 4;       // Active monitoring with updates

    // ============================================================================
    // VERIFICATION CHECK FLAGS (bitmask)
    // ============================================================================

    uint256 public constant CHECK_LEGAL_STATUS = 1 << 0;           // Legal documents verified
    uint256 public constant CHECK_OWNERSHIP_TITLE = 1 << 1;        // Land use rights verified
    uint256 public constant CHECK_CONSTRUCTION_PERMIT = 1 << 2;    // Building permits verified
    uint256 public constant CHECK_DEVELOPER_BACKGROUND = 1 << 3;   // Developer due diligence
    uint256 public constant CHECK_FINANCIAL_HEALTH = 1 << 4;       // Financial statements checked
    uint256 public constant CHECK_CONSTRUCTION_PROGRESS = 1 << 5;  // Physical progress verified
    uint256 public constant CHECK_REGISTRY_CORROBORATION = 1 << 6; // Cross-checked with registries
    uint256 public constant CHECK_PARTNER_COSIGN = 1 << 7;         // Third-party co-signature

    // ============================================================================
    // STRUCTS
    // ============================================================================

    struct Attestation {
        bytes32 assetId;            // Unique identifier for the property/asset
        uint8 tier;                 // Verification tier (0-4)
        uint256 checksPassed;       // Bitmask of passed checks
        uint256 checksFailed;       // Bitmask of failed checks
        bytes32 evidenceHash;       // SHA-256 hash of evidence bundle
        string encryptedCid;        // IPFS CID for encrypted evidence (optional)
        uint256 issuedAt;           // Timestamp of issuance
        uint256 expiresAt;          // Expiry timestamp (0 = never)
        address signer;             // Primary signer (RealTera)
        address coSigner;           // Optional co-signer (partner)
        bool disputed;              // Whether attestation is under dispute
        bool revoked;               // Whether attestation has been revoked
        string revokeReason;        // Reason for revocation (if any)
    }

    struct DisputeRecord {
        bytes32 assetId;
        address disputant;
        string reason;
        uint256 raisedAt;
        uint256 resolvedAt;
        bool upheld;                // True if dispute was valid
        string resolution;
    }

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    // Main attestation storage
    mapping(bytes32 => Attestation) public attestations;

    // Asset ID to attestation exists
    mapping(bytes32 => bool) public attestationExists;

    // Dispute records
    mapping(bytes32 => DisputeRecord[]) public disputes;

    // Status change history (for monitoring)
    mapping(bytes32 => uint256[]) public statusHistory; // timestamps

    // Authorized co-signers (partners)
    mapping(address => bool) public authorizedCoSigners;

    // Counter for statistics
    uint256 public totalAttestations;
    uint256 public activeAttestations;

    // ============================================================================
    // EVENTS (for B2B monitoring subscriptions)
    // ============================================================================

    event AttestationIssued(
        bytes32 indexed assetId,
        uint8 tier,
        uint256 checksPassed,
        bytes32 evidenceHash,
        uint256 expiresAt,
        address indexed signer,
        address indexed coSigner
    );

    event AttestationUpdated(
        bytes32 indexed assetId,
        uint8 oldTier,
        uint8 newTier,
        uint256 newChecksPassed,
        bytes32 newEvidenceHash,
        uint256 newExpiresAt
    );

    event DisputeRaised(
        bytes32 indexed assetId,
        address indexed disputant,
        string reason,
        uint256 timestamp
    );

    event DisputeResolved(
        bytes32 indexed assetId,
        bool upheld,
        string resolution,
        uint256 timestamp
    );

    event AttestationRevoked(
        bytes32 indexed assetId,
        string reason,
        uint256 timestamp
    );

    event AttestationExpired(
        bytes32 indexed assetId,
        uint256 timestamp
    );

    event CoSignerAuthorized(address indexed coSigner, bool authorized);

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor() Ownable(msg.sender) {}

    // ============================================================================
    // ATTESTATION MANAGEMENT
    // ============================================================================

    /**
     * @dev Issue a new attestation for an asset
     * @param assetId Unique identifier for the property
     * @param tier Verification tier (0-4)
     * @param checksPassed Bitmask of checks that passed
     * @param checksFailed Bitmask of checks that failed
     * @param evidenceHash SHA-256 hash of the evidence bundle
     * @param encryptedCid IPFS CID for encrypted evidence (optional)
     * @param validityDays How long the attestation is valid (0 for never expires)
     * @param coSigner Optional co-signer address (must be authorized)
     */
    function issueAttestation(
        bytes32 assetId,
        uint8 tier,
        uint256 checksPassed,
        uint256 checksFailed,
        bytes32 evidenceHash,
        string calldata encryptedCid,
        uint256 validityDays,
        address coSigner
    ) external onlyOwner nonReentrant {
        require(!attestationExists[assetId], "Attestation already exists");
        require(tier <= TIER_MONITORED, "Invalid tier");
        require(evidenceHash != bytes32(0), "Evidence hash required");

        // Validate co-signer if provided
        if (coSigner != address(0)) {
            require(authorizedCoSigners[coSigner], "Co-signer not authorized");
        }

        uint256 expiresAt = validityDays > 0
            ? block.timestamp + (validityDays * 1 days)
            : 0;

        attestations[assetId] = Attestation({
            assetId: assetId,
            tier: tier,
            checksPassed: checksPassed,
            checksFailed: checksFailed,
            evidenceHash: evidenceHash,
            encryptedCid: encryptedCid,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            signer: msg.sender,
            coSigner: coSigner,
            disputed: false,
            revoked: false,
            revokeReason: ""
        });

        attestationExists[assetId] = true;
        statusHistory[assetId].push(block.timestamp);
        totalAttestations++;
        activeAttestations++;

        emit AttestationIssued(
            assetId,
            tier,
            checksPassed,
            evidenceHash,
            expiresAt,
            msg.sender,
            coSigner
        );
    }

    /**
     * @dev Update an existing attestation (e.g., when new evidence is added)
     */
    function updateAttestation(
        bytes32 assetId,
        uint8 newTier,
        uint256 newChecksPassed,
        uint256 newChecksFailed,
        bytes32 newEvidenceHash,
        string calldata newEncryptedCid,
        uint256 newValidityDays
    ) external onlyOwner nonReentrant {
        require(attestationExists[assetId], "Attestation does not exist");
        require(!attestations[assetId].revoked, "Attestation is revoked");
        require(newTier <= TIER_MONITORED, "Invalid tier");

        Attestation storage att = attestations[assetId];
        uint8 oldTier = att.tier;

        att.tier = newTier;
        att.checksPassed = newChecksPassed;
        att.checksFailed = newChecksFailed;
        att.evidenceHash = newEvidenceHash;
        att.encryptedCid = newEncryptedCid;
        att.expiresAt = newValidityDays > 0
            ? block.timestamp + (newValidityDays * 1 days)
            : 0;

        statusHistory[assetId].push(block.timestamp);

        emit AttestationUpdated(
            assetId,
            oldTier,
            newTier,
            newChecksPassed,
            newEvidenceHash,
            att.expiresAt
        );
    }

    /**
     * @dev Revoke an attestation
     */
    function revokeAttestation(
        bytes32 assetId,
        string calldata reason
    ) external onlyOwner {
        require(attestationExists[assetId], "Attestation does not exist");
        require(!attestations[assetId].revoked, "Already revoked");

        attestations[assetId].revoked = true;
        attestations[assetId].revokeReason = reason;
        activeAttestations--;

        statusHistory[assetId].push(block.timestamp);

        emit AttestationRevoked(assetId, reason, block.timestamp);
    }

    // ============================================================================
    // DISPUTE MANAGEMENT
    // ============================================================================

    /**
     * @dev Raise a dispute against an attestation
     */
    function raiseDispute(
        bytes32 assetId,
        string calldata reason
    ) external {
        require(attestationExists[assetId], "Attestation does not exist");
        require(!attestations[assetId].revoked, "Attestation is revoked");
        require(!attestations[assetId].disputed, "Already under dispute");

        attestations[assetId].disputed = true;

        disputes[assetId].push(DisputeRecord({
            assetId: assetId,
            disputant: msg.sender,
            reason: reason,
            raisedAt: block.timestamp,
            resolvedAt: 0,
            upheld: false,
            resolution: ""
        }));

        statusHistory[assetId].push(block.timestamp);

        emit DisputeRaised(assetId, msg.sender, reason, block.timestamp);
    }

    /**
     * @dev Resolve a dispute
     */
    function resolveDispute(
        bytes32 assetId,
        bool upheld,
        string calldata resolution
    ) external onlyOwner {
        require(attestationExists[assetId], "Attestation does not exist");
        require(attestations[assetId].disputed, "No active dispute");

        attestations[assetId].disputed = false;

        // Update the latest dispute record
        uint256 disputeIndex = disputes[assetId].length - 1;
        disputes[assetId][disputeIndex].resolvedAt = block.timestamp;
        disputes[assetId][disputeIndex].upheld = upheld;
        disputes[assetId][disputeIndex].resolution = resolution;

        statusHistory[assetId].push(block.timestamp);

        emit DisputeResolved(assetId, upheld, resolution, block.timestamp);
    }

    // ============================================================================
    // CO-SIGNER MANAGEMENT
    // ============================================================================

    /**
     * @dev Authorize or deauthorize a co-signer (partner)
     */
    function setCoSignerAuthorization(
        address coSigner,
        bool authorized
    ) external onlyOwner {
        require(coSigner != address(0), "Invalid address");
        authorizedCoSigners[coSigner] = authorized;
        emit CoSignerAuthorized(coSigner, authorized);
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    /**
     * @dev Get full attestation data
     */
    function getAttestation(bytes32 assetId) external view returns (Attestation memory) {
        require(attestationExists[assetId], "Attestation does not exist");
        return attestations[assetId];
    }

    /**
     * @dev Check if an attestation is currently valid
     */
    function isAttestationValid(bytes32 assetId) public view returns (bool) {
        if (!attestationExists[assetId]) return false;

        Attestation memory att = attestations[assetId];

        if (att.revoked) return false;
        if (att.disputed) return false;
        if (att.expiresAt != 0 && block.timestamp >= att.expiresAt) return false;

        return true;
    }

    /**
     * @dev Get attestation tier (returns 0 if invalid or non-existent)
     */
    function getAttestationTier(bytes32 assetId) external view returns (uint8) {
        if (!isAttestationValid(assetId)) return TIER_UNVERIFIED;
        return attestations[assetId].tier;
    }

    /**
     * @dev Get list of passed checks as human-readable array
     */
    function getChecksPassedList(bytes32 assetId) external view returns (string[] memory) {
        require(attestationExists[assetId], "Attestation does not exist");

        uint256 checksPassed = attestations[assetId].checksPassed;
        uint8 count = 0;

        // Count passed checks
        for (uint8 i = 0; i < 8; i++) {
            if ((checksPassed & (1 << i)) != 0) count++;
        }

        string[] memory checkNames = new string[](count);
        uint8 idx = 0;

        if ((checksPassed & CHECK_LEGAL_STATUS) != 0) checkNames[idx++] = "LEGAL_STATUS";
        if ((checksPassed & CHECK_OWNERSHIP_TITLE) != 0) checkNames[idx++] = "OWNERSHIP_TITLE";
        if ((checksPassed & CHECK_CONSTRUCTION_PERMIT) != 0) checkNames[idx++] = "CONSTRUCTION_PERMIT";
        if ((checksPassed & CHECK_DEVELOPER_BACKGROUND) != 0) checkNames[idx++] = "DEVELOPER_BACKGROUND";
        if ((checksPassed & CHECK_FINANCIAL_HEALTH) != 0) checkNames[idx++] = "FINANCIAL_HEALTH";
        if ((checksPassed & CHECK_CONSTRUCTION_PROGRESS) != 0) checkNames[idx++] = "CONSTRUCTION_PROGRESS";
        if ((checksPassed & CHECK_REGISTRY_CORROBORATION) != 0) checkNames[idx++] = "REGISTRY_CORROBORATION";
        if ((checksPassed & CHECK_PARTNER_COSIGN) != 0) checkNames[idx++] = "PARTNER_COSIGN";

        return checkNames;
    }

    /**
     * @dev Get status history timestamps
     */
    function getStatusHistory(bytes32 assetId) external view returns (uint256[] memory) {
        return statusHistory[assetId];
    }

    /**
     * @dev Get all disputes for an asset
     */
    function getDisputes(bytes32 assetId) external view returns (DisputeRecord[] memory) {
        return disputes[assetId];
    }

    /**
     * @dev Check if address is an authorized co-signer
     */
    function isAuthorizedCoSigner(address addr) external view returns (bool) {
        return authorizedCoSigners[addr];
    }

    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (uint256 total, uint256 active) {
        return (totalAttestations, activeAttestations);
    }

    // ============================================================================
    // BATCH OPERATIONS (for gas efficiency)
    // ============================================================================

    /**
     * @dev Batch check validity of multiple attestations
     */
    function batchCheckValidity(bytes32[] calldata assetIds) external view returns (bool[] memory) {
        bool[] memory results = new bool[](assetIds.length);
        for (uint256 i = 0; i < assetIds.length; i++) {
            results[i] = isAttestationValid(assetIds[i]);
        }
        return results;
    }

    /**
     * @dev Batch get attestation tiers
     */
    function batchGetTiers(bytes32[] calldata assetIds) external view returns (uint8[] memory) {
        uint8[] memory tiers = new uint8[](assetIds.length);
        for (uint256 i = 0; i < assetIds.length; i++) {
            if (isAttestationValid(assetIds[i])) {
                tiers[i] = attestations[assetIds[i]].tier;
            } else {
                tiers[i] = TIER_UNVERIFIED;
            }
        }
        return tiers;
    }
}
