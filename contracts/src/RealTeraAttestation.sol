// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title RealTeraAttestation
 * @dev Multi-purpose token contract for RealTera Vietnamese Real Estate Platform
 *
 * Token Types:
 * - Verification Badges (ERC-1155): Token IDs 1-3 for Basic, Standard, Premium
 * - Property NFTs (ERC-721 style): Token IDs 1000+ for unique project profiles
 * - Developer SBTs: Token IDs 10000+ for non-transferable reputation tokens
 *
 * Deployed on Mantle Network for the Mantle Global Hackathon 2025
 */
contract RealTeraAttestation is ERC1155, Ownable {
    using Strings for uint256;

    // ============================================================================
    // TOKEN TYPE CONSTANTS
    // ============================================================================

    uint256 public constant BADGE_BASIC = 1;
    uint256 public constant BADGE_STANDARD = 2;
    uint256 public constant BADGE_PREMIUM = 3;
    uint256 public constant PROPERTY_NFT_START = 1000;
    uint256 public constant SBT_DEVELOPER_START = 10000;

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    uint256 private _propertyTokenId = PROPERTY_NFT_START;
    uint256 private _sbtTokenId = SBT_DEVELOPER_START;

    string public name = "RealTera Attestation";
    string public symbol = "REALTERA";
    string private _baseUri;

    // Mapping for SBT (non-transferable tokens)
    mapping(uint256 => bool) public isSoulbound;

    // ============================================================================
    // STRUCTS
    // ============================================================================

    struct VerificationData {
        string slug;           // Project or developer slug
        string tier;           // SSS, S+, S, A, B, C, D, F
        uint256 score;         // 0-100
        uint256 timestamp;     // When minted
        uint256 expiresAt;     // 0 for never expires
        bool isActive;         // Can be revoked
    }

    struct PropertyData {
        string projectSlug;
        string projectName;
        string district;
        string tier;
        uint256 score;
        uint256 pricePerSqm;   // In VND
        uint256 mintedAt;
    }

    // ============================================================================
    // MAPPINGS
    // ============================================================================

    mapping(uint256 => VerificationData) public verifications;
    mapping(uint256 => PropertyData) public properties;
    mapping(string => uint256) public projectSlugToTokenId;
    mapping(string => uint256) public developerSlugToSbtId;
    mapping(address => uint256[]) public userBadges;
    mapping(address => uint256[]) public userPropertyNfts;
    mapping(address => uint256) public developerSbt;

    // ============================================================================
    // EVENTS
    // ============================================================================

    event VerificationBadgeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string projectSlug,
        string tier,
        uint256 score,
        uint256 expiresAt
    );

    event PropertyNFTMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string projectSlug,
        string projectName,
        string tier,
        uint256 score
    );

    event DeveloperSBTMinted(
        uint256 indexed tokenId,
        address indexed developer,
        string developerSlug,
        string tier,
        uint256 score
    );

    event VerificationRevoked(
        uint256 indexed tokenId,
        string reason
    );

    event BaseURIUpdated(string newUri);

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor(string memory baseUri_) ERC1155(baseUri_) Ownable(msg.sender) {
        _baseUri = baseUri_;
    }

    // ============================================================================
    // MINTING FUNCTIONS
    // ============================================================================

    /**
     * @dev Mint a verification badge (Basic, Standard, or Premium)
     * @param to Recipient address
     * @param badgeType 1=Basic, 2=Standard, 3=Premium
     * @param projectSlug Unique project identifier
     * @param tier Rating tier (SSS, S+, S, A, B, C, D, F)
     * @param score Rating score (0-100)
     * @param validityDays How long the verification is valid (0 for never expires)
     */
    function mintVerificationBadge(
        address to,
        uint256 badgeType,
        string memory projectSlug,
        string memory tier,
        uint256 score,
        uint256 validityDays
    ) external onlyOwner returns (uint256) {
        require(badgeType >= BADGE_BASIC && badgeType <= BADGE_PREMIUM, "Invalid badge type");
        require(score <= 100, "Score must be 0-100");
        require(bytes(projectSlug).length > 0, "Project slug required");

        _mint(to, badgeType, 1, "");

        uint256 expiresAt = validityDays > 0
            ? block.timestamp + (validityDays * 1 days)
            : 0;

        verifications[badgeType] = VerificationData({
            slug: projectSlug,
            tier: tier,
            score: score,
            timestamp: block.timestamp,
            expiresAt: expiresAt,
            isActive: true
        });

        userBadges[to].push(badgeType);

        emit VerificationBadgeMinted(badgeType, to, projectSlug, tier, score, expiresAt);
        return badgeType;
    }

    /**
     * @dev Mint a unique Property NFT for a verified project
     * @param to Recipient address (usually the developer or platform)
     * @param projectSlug Unique project identifier
     * @param projectName Human readable project name
     * @param district Location district
     * @param tier Rating tier
     * @param score Rating score (0-100)
     * @param pricePerSqm Current price per square meter in VND
     */
    function mintPropertyNFT(
        address to,
        string memory projectSlug,
        string memory projectName,
        string memory district,
        string memory tier,
        uint256 score,
        uint256 pricePerSqm
    ) external onlyOwner returns (uint256) {
        require(projectSlugToTokenId[projectSlug] == 0, "Project already minted");
        require(score <= 100, "Score must be 0-100");

        uint256 tokenId = _propertyTokenId++;

        _mint(to, tokenId, 1, "");

        properties[tokenId] = PropertyData({
            projectSlug: projectSlug,
            projectName: projectName,
            district: district,
            tier: tier,
            score: score,
            pricePerSqm: pricePerSqm,
            mintedAt: block.timestamp
        });

        projectSlugToTokenId[projectSlug] = tokenId;
        userPropertyNfts[to].push(tokenId);

        emit PropertyNFTMinted(tokenId, to, projectSlug, projectName, tier, score);
        return tokenId;
    }

    /**
     * @dev Mint a Soul-Bound Token for developer reputation (non-transferable)
     * @param to Developer wallet address
     * @param developerSlug Unique developer identifier
     * @param tier Developer rating tier
     * @param score Developer rating score (0-100)
     */
    function mintDeveloperSBT(
        address to,
        string memory developerSlug,
        string memory tier,
        uint256 score
    ) external onlyOwner returns (uint256) {
        require(developerSbt[to] == 0, "Developer already has SBT");
        require(developerSlugToSbtId[developerSlug] == 0, "Developer slug already used");
        require(score <= 100, "Score must be 0-100");

        uint256 tokenId = _sbtTokenId++;

        _mint(to, tokenId, 1, "");
        isSoulbound[tokenId] = true;

        verifications[tokenId] = VerificationData({
            slug: developerSlug,
            tier: tier,
            score: score,
            timestamp: block.timestamp,
            expiresAt: 0, // SBTs don't expire
            isActive: true
        });

        developerSlugToSbtId[developerSlug] = tokenId;
        developerSbt[to] = tokenId;

        emit DeveloperSBTMinted(tokenId, to, developerSlug, tier, score);
        return tokenId;
    }

    // ============================================================================
    // ADMIN FUNCTIONS
    // ============================================================================

    /**
     * @dev Revoke a verification (badge or SBT)
     */
    function revokeVerification(
        address holder,
        uint256 tokenId,
        string memory reason
    ) external onlyOwner {
        require(balanceOf(holder, tokenId) > 0, "Holder does not own token");

        verifications[tokenId].isActive = false;
        _burn(holder, tokenId, 1);

        emit VerificationRevoked(tokenId, reason);
    }

    /**
     * @dev Update the base URI for metadata
     */
    function setBaseURI(string memory newUri) external onlyOwner {
        _baseUri = newUri;
        emit BaseURIUpdated(newUri);
    }

    /**
     * @dev Update verification data (e.g., when score changes)
     */
    function updateVerificationScore(
        uint256 tokenId,
        string memory newTier,
        uint256 newScore
    ) external onlyOwner {
        require(verifications[tokenId].isActive, "Verification not active");
        require(newScore <= 100, "Score must be 0-100");

        verifications[tokenId].tier = newTier;
        verifications[tokenId].score = newScore;
    }

    // ============================================================================
    // VIEW FUNCTIONS
    // ============================================================================

    /**
     * @dev Get token URI for metadata
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseUri, tokenId.toString(), ".json"));
    }

    /**
     * @dev Check if a verification is still valid
     */
    function isVerificationValid(uint256 tokenId) public view returns (bool) {
        VerificationData memory v = verifications[tokenId];
        if (!v.isActive) return false;
        if (v.expiresAt == 0) return true; // Never expires
        return block.timestamp < v.expiresAt;
    }

    /**
     * @dev Get all badges owned by an address
     */
    function getBadgesOf(address owner) external view returns (uint256[] memory) {
        return userBadges[owner];
    }

    /**
     * @dev Get all property NFTs owned by an address
     */
    function getPropertyNFTsOf(address owner) external view returns (uint256[] memory) {
        return userPropertyNfts[owner];
    }

    /**
     * @dev Get current property token counter
     */
    function getCurrentPropertyTokenId() external view returns (uint256) {
        return _propertyTokenId;
    }

    /**
     * @dev Get current SBT token counter
     */
    function getCurrentSbtTokenId() external view returns (uint256) {
        return _sbtTokenId;
    }

    // ============================================================================
    // TRANSFER RESTRICTIONS (SBT)
    // ============================================================================

    /**
     * @dev Override to prevent SBT transfers
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        for (uint256 i = 0; i < ids.length; i++) {
            // Block transfers of soulbound tokens (except minting and burning)
            if (isSoulbound[ids[i]] && from != address(0) && to != address(0)) {
                revert("SBT: Token is soulbound and cannot be transferred");
            }
        }
        super._update(from, to, ids, values);
    }

    // ============================================================================
    // BATCH OPERATIONS
    // ============================================================================

    /**
     * @dev Batch mint verification badges (gas efficient for multiple projects)
     */
    function batchMintVerificationBadges(
        address[] memory recipients,
        uint256[] memory badgeTypes,
        string[] memory projectSlugs,
        string[] memory tiers,
        uint256[] memory scores,
        uint256[] memory validityDays
    ) external onlyOwner {
        require(recipients.length == badgeTypes.length, "Array length mismatch");
        require(recipients.length == projectSlugs.length, "Array length mismatch");
        require(recipients.length == tiers.length, "Array length mismatch");
        require(recipients.length == scores.length, "Array length mismatch");
        require(recipients.length == validityDays.length, "Array length mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], badgeTypes[i], 1, "");

            uint256 expiresAt = validityDays[i] > 0
                ? block.timestamp + (validityDays[i] * 1 days)
                : 0;

            verifications[badgeTypes[i]] = VerificationData({
                slug: projectSlugs[i],
                tier: tiers[i],
                score: scores[i],
                timestamp: block.timestamp,
                expiresAt: expiresAt,
                isActive: true
            });

            userBadges[recipients[i]].push(badgeTypes[i]);

            emit VerificationBadgeMinted(
                badgeTypes[i],
                recipients[i],
                projectSlugs[i],
                tiers[i],
                scores[i],
                expiresAt
            );
        }
    }
}
