import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

// Backend nests role as { id, name }. Flattened to roleId alongside the
// object so UserDialog's Select can bind to a plain value while the table
// still has row.role.name to display directly.
function mapUser(user) {
  if (!user) return user;
  return {
    ...user,
    roleId: user.role?.id ?? user.roleId ?? null,
  };
}

const userService = {
  async getUsers() {
    const { data } = await api.get("/users", { params: { limit: 500 } });
    return data.data.map(mapUser);
  },

  async getRoles() {
    const { data } = await api.get("/roles");
    return data.data;
  },

  // Returns { user, temporaryPassword }. temporaryPassword is only ever
  // present in this one response — the caller must surface it immediately,
  // it can't be retrieved again afterward.
  async createUser(user) {
    try {
      const { data } = await api.post("/users", user);
      return {
        user: mapUser(data.data.user),
        temporaryPassword: data.data.temporaryPassword,
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to create user."));
    }
  },

  async updateUser(user) {
    try {
      const { id, ...rest } = user;
      const { data } = await api.patch(`/users/${id}`, rest);
      return mapUser(data.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to update user."));
    }
  },

  // Soft-deletes on the backend (suspends + hides from the active list),
  // not a hard delete — "deactivate" in the UI reflects that accurately.
  async deactivateUser(id) {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to deactivate user."));
    }
  },

  // Always lets the backend auto-generate the new password — returns
  // { temporaryPassword } once, same one-time-reveal contract as create.
  async resetPassword(id) {
    try {
      const { data } = await api.post(`/users/${id}/reset-password`, {});
      return data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to reset password."));
    }
  },
};

export default userService;