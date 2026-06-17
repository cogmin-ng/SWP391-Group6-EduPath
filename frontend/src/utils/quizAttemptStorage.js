const MAX_QUIZ_ATTEMPTS = 10;

export function getQuizAttemptHistory(storageKey) {
  if (!storageKey) return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read quiz attempt history:', error);
    return [];
  }
}

export function saveQuizAttempt(storageKey, attempt) {
  if (!storageKey || !attempt) return [];

  const nextHistory = [attempt, ...getQuizAttemptHistory(storageKey)].slice(0, MAX_QUIZ_ATTEMPTS);

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextHistory));
  } catch (error) {
    console.error('Failed to save quiz attempt history:', error);
  }

  return nextHistory;
}
