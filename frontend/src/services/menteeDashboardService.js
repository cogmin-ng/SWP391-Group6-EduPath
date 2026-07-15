import api from "./api";

const CACHE_TTL_MS = 2 * 60 * 1000;
let inFlightRequest = null;

function getCacheKey() {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    return user?.id ? `edupath:mentee-dashboard:${user.id}` : null;
  } catch {
    return null;
  }
}

export const getCachedMenteeDashboard = () => {
  const cacheKey = getCacheKey();
  if (!cacheKey) return null;

  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
    if (!cached?.data || Date.now() - cached.cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return cached.data;
  } catch {
    sessionStorage.removeItem(cacheKey);
    return null;
  }
};

export const getMenteeDashboard = async () => {
  if (inFlightRequest) return inFlightRequest;

  inFlightRequest = api
    .get("/mentee-dashboard")
    .then((response) => {
      const data = response.data.data;
      const cacheKey = getCacheKey();
      if (cacheKey) {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ data, cachedAt: Date.now() }),
        );
      }
      return data;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
};
