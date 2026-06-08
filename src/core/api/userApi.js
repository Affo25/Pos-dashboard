import { apiRequest } from "./apiClient";

const unwrap = (response) => {
  if (response?.success === false) {
    throw new Error(response.message || "Request failed");
  }
  return response;
};

export const registerUser = (data) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUserApi = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getAllUsers = async () => unwrap(await apiRequest("/users"));

export const createUser = async (data) =>
  unwrap(
    await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  );

export const updateUser = async (id, data) =>
  unwrap(
    await apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  );

export const deleteUser = async (id) =>
  unwrap(
    await apiRequest(`/users/${id}`, {
      method: "DELETE",
    })
  );

const ROLE_LABELS = {
  superAdmin: "Super Admin",
  admin: "Admin",
  modertor: "Moderator",
  client: "Client",
  user: "User",
};

export const mapUserToListRow = (user) => {
  const created = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "-";
  const statusLabel = user.status
    ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
    : "Active";

  return {
    id: user.id,
    username: user.name || "-",
    phone: user.phone || "-",
    email: user.email || "-",
    role: ROLE_LABELS[user.user_type] || user.user_type || "-",
    createdon: created,
    status: statusLabel,
    img: "assets/img/users/user-01.jpg",
    _raw: user,
  };
};
