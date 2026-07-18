import api from "./api";

export const leaderboardService = {
  async getMenteeLeaderboard(period = "week", limit = 10) {
    const { data } = await api.get("/mentee-dashboard/leaderboard", {
      params: { period, limit },
    });
    return data.data;
  },
};
