import { API_BASE_URL } from "../api/config";

export const authLoginRequest = () => ({ type: "AUTH_LOGIN_REQUEST" });

export const setAuthSuccess = (payload) => ({
  type: "AUTH_LOGIN_SUCCESS",
  payload,
});

export const setAuthError = (payload) => ({
  type: "AUTH_LOGIN_FAILURE",
  payload,
});

export const authLogout = () => ({ type: "AUTH_LOGOUT" });

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(authLoginRequest());
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const message =
        data.message || data.detail || data.error || "Invalid credentials";
      dispatch(setAuthError(message));
      return { success: false, message };
    }

    const token = data.data.access_token;
    const user = data.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(setAuthSuccess({ user, token }));
    return { success: true, data: user };
  } catch (error) {
    const message = error.message || "Unable to connect to server";
    dispatch(setAuthError(message));
    return { success: false, message };
  }
};

export const logoutUser = () => async (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(authLogout());
  return { success: true };
};
