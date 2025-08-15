import { getToken, isAuthenticated } from './userService';

/**
 * Retrieves the wrong questions for the current authenticated user from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of wrong question objects.
 */
export const getWrongQuestions = async () => {
  if (!isAuthenticated()) return [];

  try {
    const response = await fetch('/api/wrong-questions', {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
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
 * Adds a wrong question to the authenticated user's book on the backend.
 * @param {number} questionId - The ID of the question to add.
 * @param {any} userAnswer - The user's incorrect answer.
 * @returns {Promise<void>}
 */
export const addWrongQuestion = async (questionId, userAnswer) => {
  if (!isAuthenticated()) {
    console.error('Cannot add wrong question: User is not authenticated.');
    return;
  }

  try {
    const response = await fetch('/api/wrong-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ questionId, userAnswer }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to add wrong question. Server responded with:', errorData);
    }
  } catch (error) {
    console.error('Network error while adding wrong question:', error);
  }
};

/**
 * Removes a question from the authenticated user's wrong answer book on the backend.
 * @param {number} questionId - The ID of the question to remove.
 * @returns {Promise<void>}
 */
export const removeWrongQuestion = async (questionId) => {
  if (!isAuthenticated()) return;

  try {
    await fetch(`/api/wrong-questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error('Failed to remove wrong question:', error);
  }
};
