// This service now fetches questions from a JSON file.
import { getMasteredQuestionIds } from './masteryService';

let sessionQuestions = []; // In-memory cache for the questions

/**
 * Fetches questions from the JSON file if the cache is empty.
 * @returns {Promise<Array>} A promise that resolves to the questions array.
 */
export const getQuestions = async () => {
  if (sessionQuestions.length === 0) {
    try {
      // The JSON file is in the public folder, so it can be fetched directly.
      const response = await fetch('/questions.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      sessionQuestions = data;
      console.log('Questions loaded from JSON file.');
    } catch (error) {
      console.error("Could not fetch questions:", error);
      return []; // Return empty array on error
    }
  }
  // Return a copy to prevent direct mutation of the cache
  const masteredIds = await getMasteredQuestionIds();
  const filteredQuestions = sessionQuestions.filter(q => !masteredIds.includes(q.id));
  return [...filteredQuestions];
};

/**
 * Resets the session questions cache, forcing a reload from the JSON file on next getQuestions call.
 */
export const resetQuestions = () => {
  sessionQuestions = [];
  console.log('Question cache has been cleared. Will reload from JSON on next request.');
};

/**
 * "Permanently" deletes a question from the current session's question pool.
 * @param {number} questionId - The ID of the question to delete.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const deleteQuestion = async (questionId) => {
  // Ensure questions are loaded before trying to delete
  if (sessionQuestions.length === 0) {
    await getQuestions();
  }
  
  const index = sessionQuestions.findIndex(q => q.id === questionId);
  if (index !== -1) {
    sessionQuestions.splice(index, 1);
    console.log(`Question with id ${questionId} was removed from the session pool.`);
    return { success: true };
  }
  return { success: false, message: "Question not found in session pool." };
};
