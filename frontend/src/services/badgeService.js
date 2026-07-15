import api from "./api";

export const badgeService = {
  async getMyBadges() {
    const { data } = await api.get("/badges");
    return data;
  },

  async unlockBadge(badgeId) {
    const { data } = await api.post(`/badges/${badgeId}/unlock`);
    return data;
  },
};
