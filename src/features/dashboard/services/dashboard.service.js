import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function getDashboard() {
  try {
    const { data } = await api.get("/dashboard");
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load dashboard."));
  }
}

const dashboardService = {
  getDashboard,
};

export default dashboardService;