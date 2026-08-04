import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function getRoles() {
  try {
    const { data } = await api.get("/roles");
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load roles."));
  }
}

async function getRoleMatrix(roleId) {
  try {
    const { data } = await api.get(`/permissions/roles/${roleId}`);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load permissions."));
  }
}

async function updateRoleMatrix(roleId, matrix) {
  try {
    const { data } = await api.put(`/permissions/roles/${roleId}`, { matrix });
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to save permissions."));
  }
}

const permissionsService = {
  getRoles,
  getRoleMatrix,
  updateRoleMatrix,
};

export default permissionsService;