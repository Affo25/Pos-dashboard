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
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data.message || data.error || "Invalid credentials";
      dispatch(setAuthError(message));
      return { success: false, message };
    }

    const { token, ...userData } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data));

    dispatch(setAuthSuccess({ user: data, token }));
    return { success: true, data };
  } catch (error) {
    const message = error.message || "Unable to connect to server";
    dispatch(setAuthError(message));
    return { success: false, message };
  }
};

const clearAuthSession = (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch(authLogout());
};

export const logoutUser = () => async (dispatch, getState) => {
  const token = getState().auth_token || localStorage.getItem("token");

  try {
    await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    clearAuthSession(dispatch);
  }

  return { success: true };
};
