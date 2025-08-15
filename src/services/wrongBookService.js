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
  if (!userId) {
    console.error('Cannot add wrong question: User ID is not available.');
    return;
  }

  console.log(`Adding wrong question for userId: ${userId}, questionId: ${questionId}`);

  try {
    const response = await fetch(`/api/users/${userId}/wrong-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to add wrong question. Server responded with:', errorData);
    } else {
      console.log('Successfully added wrong question.');
    }
  } catch (error) {
    console.error('Network error while adding wrong question:', error);
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
