import { getToken, isAuthenticated } from './userService';

/**
 * Updates the mastery streak for a given question for the authenticated user.
 * @param {number} questionId - The ID of the question.
 * @param {boolean} correct - Whether the user answered the question correctly.
 * @returns {Promise<void>}
 */
export const updateMastery = async (questionId, correct) => {
  if (!isAuthenticated()) return;

  try {
    await fetch(`/api/mastery/${questionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ correct }),
    });
  } catch (error) {
    console.error('Failed to update mastery:', error);
  }
};

/**
 * Fetches the list of mastered question IDs for the authenticated user.
 * @returns {Promise<number[]>} A promise that resolves to an array of question IDs.
 */
export const getMasteredQuestionIds = async () => {
  if (!isAuthenticated()) return [];

  try {
    const response = await fetch('/api/mastered-questions', {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
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
 * Fetches the mastery progress for the authenticated user.
 * @returns {Promise<Object>} A promise that resolves to the progress object.
 */
export const getMasteryProgress = async () => {
  if (!isAuthenticated()) return { masteredCount: 0, totalQuestions: 0, progress: 0 };

  try {
    const response = await fetch('/api/mastery-progress', {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch mastery progress:', error);
    return { masteredCount: 0, totalQuestions: 0, progress: 0 };
  }
};
