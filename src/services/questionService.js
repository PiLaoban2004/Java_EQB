import { questions as staticQuestions } from '../questions.js';

// Create a mutable copy of the questions for the current session.
let sessionQuestions = [...staticQuestions];

/**
 * Gets the current list of available questions.
 * @returns {Promise<Array>} A promise that resolves to the questions array.
 */
export const getQuestions = async () => {
  // Simulate an API call latency
  await new Promise(resolve => setTimeout(resolve, 50));
  return [...sessionQuestions]; // Return a copy to prevent direct mutation
};

/**
 * "Permanently" deletes a question from the current session's question pool.
 * @param {number} questionId - The ID of the question to delete.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const deleteQuestion = async (questionId) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const index = sessionQuestions.findIndex(q => q.id === questionId);
  if (index !== -1) {
    sessionQuestions.splice(index, 1);
    console.log(`Question with id ${questionId} was removed from the session pool.`);
    return { success: true };
  }
  return { success: false, message: "Question not found in session pool." };
};
