import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function getNotificationPreferences() {
  try {
    const { data } = await api.get("/settings/notifications");
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load notification preferences."));
  }
}

async function updateNotificationPreferences(payload) {
  try {
    const { data } = await api.patch("/settings/notifications", payload);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to save notification preferences."));
  }
}

const notificationPreferencesService = {
  getNotificationPreferences,
  updateNotificationPreferences,
};

export default notificationPreferencesService;