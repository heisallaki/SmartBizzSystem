import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function createBackup() {
  try {
    const { data } = await api.post("/backups");
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create backup."));
  }
}

async function getBackups(limit = 10) {
  try {
    const { data } = await api.get("/backups", { params: { limit } });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load backup history."));
  }
}

const backupsService = {
  createBackup,
  getBackups,
};

export default backupsService;