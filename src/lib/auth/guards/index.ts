// Auth guards
export { requireAuth, isAuthenticated, AuthError } from "./require-auth";
export { requireLinkedWallet, hasLinkedWallet } from "./require-wallet";

// RBAC guards
export {
  requireRole,
  hasRole,
  getUserRoles,
  RoleError,
  type RoleRequirement,
} from "./require-role";

export {
  requirePermission,
  hasPermission,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  PermissionError,
} from "./require-permission";
