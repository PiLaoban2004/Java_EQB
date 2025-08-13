const QUIZ_STATE_KEY = 'quizState';

/**
 * Saves the current state of the quiz to sessionStorage.
 * @param {Object} state - The quiz state object to save.
 */
export const saveQuizState = (state) => {
  sessionStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
};

/**
 * Loads the quiz state from sessionStorage.
 * @returns {Object | null} The saved quiz state, or null if none exists.
 */
export const loadQuizState = () => {
  const savedState = sessionStorage.getItem(QUIZ_STATE_KEY);
  return savedState ? JSON.parse(savedState) : null;
};

/**
 * Clears the saved quiz state from sessionStorage.
 */
export const clearQuizState = () => {
  sessionStorage.removeItem(QUIZ_STATE_KEY);
};
