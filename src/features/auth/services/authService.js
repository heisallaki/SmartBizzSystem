import api from "../../../config/api";
import API from "../../../constants/apiEndpoints";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

export async function login(email, password) {
  try {
    const { data } = await api.post(API.LOGIN, { email, password });
    return data.data;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Invalid email or password."),
      { cause: error }
    );
  }
}

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
    throw new Error(
      extractErrorMessage(error, "Failed to change password."),
      { cause: error }
    );
  }
} 