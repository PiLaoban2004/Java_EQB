import { getUserId } from './userService';

/**
 * Retrieves the wrong questions for the current user from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of wrong question objects.
 */
export const getWrongQuestions = async () => {
  const userId = getUserId();
  if (!userId) return [];

  try {
    const response = await fetch(`/api/users/${userId}/wrong-questions`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch wrong questions:', error);
    return [];
  }
};

/**
 * Adds a wrong question to the user's book on the backend.
 * @param {number} questionId - The ID of the question to add.
 * @param {any} userAnswer - The user's incorrect answer.
 * @returns {Promise<void>}
 */
export const addWrongQuestion = async (questionId, userAnswer) => {
  const userId = getUserId();
  if (!userId) return;

  try {
    await fetch(`/api/users/${userId}/wrong-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, userAnswer }),
    });
  } catch (error) {
    console.error('Failed to add wrong question:', error);
  }
};

/**
 * Removes a question from the user's wrong answer book on the backend.
 * @param {number} questionId - The ID of the question to remove.
 * @returns {Promise<void>}
 */
export const removeWrongQuestion = async (questionId) => {
  const userId = getUserId();
  if (!userId) return;

  try {
    await fetch(`/api/users/${userId}/wrong-questions/${questionId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to remove wrong question:', error);
  }
};
