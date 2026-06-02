export const ROLE_DASHBOARD_MAP = Object.freeze({
  ADMIN: "/admin/dashboard",
  MENTEE: "/mentee/homepage",
  MENTOR: "/mentor/dashboard",
});

export const normalizeRole = (role) => {
  const low = String(role || "").toLowerCase();
  if (low === "admin") return "ADMIN";
  if (low === "mentee" || low === "learner") return "MENTEE";
  if (low === "mentor") return "MENTOR";
  return String(role || "").toUpperCase();
};

export const normalizeRoles = (roles = []) => {
  if (!Array.isArray(roles)) return [];
  return roles.map(normalizeRole).filter(Boolean);
};

export const getDashboardByRole = (roles = []) => {
  const normalizedRoles = normalizeRoles(roles);
  if (normalizedRoles.includes("ADMIN")) return ROLE_DASHBOARD_MAP.ADMIN;
  if (normalizedRoles.includes("MENTOR")) return ROLE_DASHBOARD_MAP.MENTOR;
  return ROLE_DASHBOARD_MAP.MENTEE;
};
