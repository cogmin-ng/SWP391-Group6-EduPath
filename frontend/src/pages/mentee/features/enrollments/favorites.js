const FAVORITES_KEY = 'favoritedRoadmaps';

export function getFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorited(roadmapSlug) {
  return getFavorites().includes(roadmapSlug);
}

export function toggleFavorite(roadmapSlug) {
  const favorites = getFavorites();
  const next = favorites.includes(roadmapSlug)
    ? favorites.filter((slug) => slug !== roadmapSlug)
    : [...favorites, roadmapSlug];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}
