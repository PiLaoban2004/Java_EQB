import { getUserId } from './userService';

/**
 * Updates the mastery streak for a given question.
 * @param {number} questionId - The ID of the question.
 * @param {boolean} correct - Whether the user answered the question correctly.
 * @returns {Promise<void>}
 */
export const updateMastery = async (questionId, correct) => {
  const userId = getUserId();
  if (!userId) return;

  try {
    await fetch(`/api/users/${userId}/mastery/${questionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct }),
    });
  } catch (error) {
    console.error('Failed to update mastery:', error);
  }
};

/**
 * Fetches the list of mastered question IDs for the current user.
 * @returns {Promise<number[]>} A promise that resolves to an array of question IDs.
 */
export const getMasteredQuestionIds = async () => {
  const userId = getUserId();
  if (!userId) return [];

  try {
    const response = await fetch(`/api/users/${userId}/mastered-questions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch mastered questions:', error);
    return [];
  }
};

/**
 * Fetches the mastery progress for the current user.
 * @returns {Promise<Object>} A promise that resolves to the progress object.
 */
export const getMasteryProgress = async () => {
  const userId = getUserId();
  if (!userId) return { masteredCount: 0, totalQuestions: 0, progress: 0 };

  try {
    const response = await fetch(`/api/users/${userId}/mastery-progress`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch mastery progress:', error);
    return { masteredCount: 0, totalQuestions: 0, progress: 0 };
  }
};
