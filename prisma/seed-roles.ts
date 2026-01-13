/**
 * Seed script for RBAC roles and permissions
 * Run with: npx ts-node prisma/seed-roles.ts
 * Or add to package.json prisma.seed
 */

import { PrismaClient, RoleType, PermissionCode, UserTier } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Permission definitions with categories
const PERMISSIONS: Array<{
  code: PermissionCode;
  displayName: string;
  description: string;
  category: string;
}> = [
  // Project permissions
  { code: "READ_PROJECTS", displayName: "Read Projects", description: "View project details and listings", category: "projects" },
  { code: "WRITE_PROJECTS", displayName: "Write Projects", description: "Create and edit projects", category: "projects" },
  { code: "DELETE_PROJECTS", displayName: "Delete Projects", description: "Delete projects", category: "projects" },

  // Attestation permissions
  { code: "READ_ATTESTATIONS", displayName: "Read Attestations", description: "View attestations and verification status", category: "attestations" },
  { code: "CREATE_ATTESTATIONS", displayName: "Create Attestations", description: "Request and create attestations", category: "attestations" },
  { code: "UPDATE_ATTESTATIONS", displayName: "Update Attestations", description: "Update attestation details", category: "attestations" },

  // Collection permissions
  { code: "READ_COLLECTIONS", displayName: "Read Collections", description: "View collections", category: "collections" },
  { code: "WRITE_COLLECTIONS", displayName: "Write Collections", description: "Create and edit collections", category: "collections" },
  { code: "SHARE_COLLECTIONS", displayName: "Share Collections", description: "Generate share links for collections", category: "collections" },

  // API permissions
  { code: "API_READ", displayName: "API Read", description: "Read-only API access", category: "api" },
  { code: "API_WRITE", displayName: "API Write", description: "Write API access", category: "api" },
  { code: "API_ADMIN", displayName: "API Admin", description: "Full API administration", category: "api" },

  // Admin permissions
  { code: "ADMIN_USERS", displayName: "Manage Users", description: "Administer user accounts", category: "admin" },
  { code: "ADMIN_PROJECTS", displayName: "Manage Projects", description: "Administer all projects", category: "admin" },
  { code: "ADMIN_ATTESTATIONS", displayName: "Manage Attestations", description: "Administer all attestations", category: "admin" },
  { code: "ADMIN_BILLING", displayName: "Manage Billing", description: "Administer billing and subscriptions", category: "admin" },
];

// Role definitions with their permissions
const ROLES: Array<{
  type: RoleType;
  displayName: string;
  description: string;
  tier: UserTier;
  isDefault: boolean;
  permissions: PermissionCode[];
}> = [
  // Investor roles
  {
    type: "INVESTOR",
    displayName: "Investor",
    description: "Basic investor with read access",
    tier: "FREE",
    isDefault: true,
    permissions: ["READ_PROJECTS", "READ_ATTESTATIONS", "READ_COLLECTIONS"],
  },
  {
    type: "INVESTOR_PRO",
    displayName: "Investor Pro",
    description: "Pro investor with collection management",
    tier: "PRO",
    isDefault: false,
    permissions: ["READ_PROJECTS", "READ_ATTESTATIONS", "READ_COLLECTIONS", "WRITE_COLLECTIONS", "SHARE_COLLECTIONS"],
  },

  // Agency roles
  {
    type: "AGENCY_OWNER",
    displayName: "Agency Owner",
    description: "Agency owner with full agency access",
    tier: "AGENCY",
    isDefault: false,
    permissions: ["READ_PROJECTS", "READ_ATTESTATIONS", "READ_COLLECTIONS", "WRITE_COLLECTIONS", "SHARE_COLLECTIONS"],
  },
  {
    type: "AGENCY_ADMIN",
    displayName: "Agency Admin",
    description: "Agency administrator",
    tier: "AGENCY",
    isDefault: false,
    permissions: ["READ_PROJECTS", "READ_ATTESTATIONS", "READ_COLLECTIONS", "WRITE_COLLECTIONS", "SHARE_COLLECTIONS"],
  },
  {
    type: "AGENCY_AGENT",
    displayName: "Agency Agent",
    description: "Agency agent with limited access",
    tier: "AGENCY",
    isDefault: false,
    permissions: ["READ_PROJECTS", "READ_ATTESTATIONS", "READ_COLLECTIONS"],
  },

  // Developer roles
  {
    type: "DEVELOPER_OWNER",
    displayName: "Developer Owner",
    description: "Property developer with full project access",
    tier: "DEVELOPER",
    isDefault: false,
    permissions: ["READ_PROJECTS", "WRITE_PROJECTS", "READ_ATTESTATIONS", "CREATE_ATTESTATIONS", "UPDATE_ATTESTATIONS"],
  },
  {
    type: "DEVELOPER_ADMIN",
    displayName: "Developer Admin",
    description: "Developer organization administrator",
    tier: "DEVELOPER",
    isDefault: false,
    permissions: ["READ_PROJECTS", "WRITE_PROJECTS", "READ_ATTESTATIONS", "CREATE_ATTESTATIONS"],
  },
  {
    type: "DEVELOPER_STAFF",
    displayName: "Developer Staff",
    description: "Developer staff with limited access",
    tier: "DEVELOPER",
    isDefault: false,
    permissions: ["READ_PROJECTS", "READ_ATTESTATIONS"],
  },

  // API roles
  {
    type: "API_READONLY",
    displayName: "API Read-Only",
    description: "API access with read-only permissions",
    tier: "API_USER",
    isDefault: false,
    permissions: ["API_READ"],
  },
  {
    type: "API_FULL",
    displayName: "API Full Access",
    description: "API access with read and write permissions",
    tier: "API_USER",
    isDefault: false,
    permissions: ["API_READ", "API_WRITE"],
  },

  // Platform roles
  {
    type: "PLATFORM_ADMIN",
    displayName: "Platform Admin",
    description: "Full platform administrator",
    tier: "ADMIN",
    isDefault: false,
    permissions: ["ADMIN_USERS", "ADMIN_PROJECTS", "ADMIN_ATTESTATIONS", "ADMIN_BILLING", "READ_PROJECTS", "WRITE_PROJECTS", "DELETE_PROJECTS", "READ_ATTESTATIONS", "CREATE_ATTESTATIONS", "UPDATE_ATTESTATIONS", "API_READ", "API_WRITE", "API_ADMIN"],
  },
  {
    type: "PLATFORM_SUPPORT",
    displayName: "Platform Support",
    description: "Platform support staff",
    tier: "ADMIN",
    isDefault: false,
    permissions: ["ADMIN_USERS", "ADMIN_PROJECTS", "READ_PROJECTS", "READ_ATTESTATIONS"],
  },
];

async function main() {
  console.log("🌱 Seeding RBAC roles and permissions...\n");

  // Create permissions
  console.log("📝 Creating permissions...");
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {
        displayName: perm.displayName,
        description: perm.description,
        category: perm.category,
      },
      create: {
        code: perm.code,
        displayName: perm.displayName,
        description: perm.description,
        category: perm.category,
      },
    });
    console.log(`  ✓ ${perm.code}`);
  }

  // Create roles and their permission mappings
  console.log("\n👤 Creating roles...");
  for (const role of ROLES) {
    // Create or update role
    const createdRole = await prisma.role.upsert({
      where: { type: role.type },
      update: {
        displayName: role.displayName,
        description: role.description,
        tier: role.tier,
        isDefault: role.isDefault,
      },
      create: {
        type: role.type,
        displayName: role.displayName,
        description: role.description,
        tier: role.tier,
        isDefault: role.isDefault,
      },
    });

    // Link permissions to role
    for (const permCode of role.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { code: permCode },
      });

      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: createdRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: createdRole.id,
            permissionId: permission.id,
          },
        });
      }
    }

    console.log(`  ✓ ${role.type} (${role.permissions.length} permissions)`);
  }

  console.log("\n✅ RBAC seeding complete!");
  console.log(`   - ${PERMISSIONS.length} permissions created`);
  console.log(`   - ${ROLES.length} roles created`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
