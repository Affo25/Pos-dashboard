const ROLE_LABELS = {
  superAdmin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export const getDisplayName = (user) => user?.name || "User";

export const getUserRoleLabel = (user) =>
  ROLE_LABELS[user?.user_type] || user?.user_type || "";

export const isAdminRole = (userType) =>
  ["admin", "superAdmin", "modertor"].includes(userType);

export const splitFullName = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
};
