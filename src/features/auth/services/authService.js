import api from "../../../config/api";
import API from "../../../constants/apiEndpoints";

function extractErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

// Returns { user, token }. Callers are responsible for persisting both
// (see AuthProvider.login) — this function only talks to the API.
export async function login(email, password) {
  try {
    const { data } = await api.post(API.LOGIN, { email, password });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Invalid email or password."));
  }
}

// Best-effort — server-side this only records an audit-log entry (the JWT
// itself isn't revocable yet). The caller clears local session state
// regardless of whether this succeeds, so a network hiccup here should
// never block someone from logging out.
export async function logout() {
  try {
    await api.post(API.LOGOUT);
  } catch (error) {
    console.error("Logout request failed:", error);
  }
}

export async function getProfile() {
  const { data } = await api.get(API.PROFILE);
  return data.data;
}

export async function changePassword(currentPassword, newPassword) {
  try {
    await api.post(API.CHANGE_PASSWORD, { currentPassword, newPassword });
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update password."));
  }
}