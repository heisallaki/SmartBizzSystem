import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function getRecent(limit = 8) {
  try {
    const { data } = await api.get("/notifications", { params: { limit } });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load notifications."));
  }
}

async function getUnreadCount() {
  try {
    const { data } = await api.get("/notifications/unread-count");
    return data.data.count;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load unread count."));
  }
}

async function markAsRead(id) {
  try {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to mark notification as read."));
  }
}

async function markAllAsRead() {
  try {
    await api.post("/notifications/read-all");
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to mark all as read."));
  }
}

const notificationService = {
  getRecent,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};

export default notificationService;