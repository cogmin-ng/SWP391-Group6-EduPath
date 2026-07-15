import api from "./api";

export const userService = {
  async getMyMenteeProfile() {
    const { data } = await api.get("/users/me/profile");
    return data.data;
  },

  async updateUser(userId, payload) {
    const { data } = await api.put(`/users/${userId}`, payload);
    return data;
  },

  async updateAvatar(userId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.patch(`/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};
