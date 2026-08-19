import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

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

  async deactivateUser(id) {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to deactivate user."));
    }
  },

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