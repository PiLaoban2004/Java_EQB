// This service now fetches questions from a JSON file and supports session-persistent additions.
import { getMasteredQuestionIds } from './masteryService';
import baseQuestions from '@/questions.json';

let sessionQuestions = []; // In-memory cache for the questions
const ADDED_QUESTIONS_KEY = 'addedQuestions';

/**
 * Fetches questions from the JSON file and merges them with questions added during the session.
 * @returns {Promise<Array>} A promise that resolves to the questions array.
 */
export const getQuestions = async () => {
  if (sessionQuestions.length === 0) {
    try {
      // const response = await fetch('/questions.json');
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const baseQuestions = await response.json();
      
      // Load added questions from sessionStorage
      const addedQuestionsStr = sessionStorage.getItem(ADDED_QUESTIONS_KEY);
      const addedQuestions = addedQuestionsStr ? JSON.parse(addedQuestionsStr) : [];

      // Combine and filter out duplicates, giving precedence to added questions
      const allQuestions = [...addedQuestions, ...baseQuestions];
      const uniqueQuestions = allQuestions.filter((q, index, self) => 
        index === self.findIndex((t) => t.id === q.id)
      );

      sessionQuestions = uniqueQuestions;
      console.log(`Questions loaded. ${baseQuestions.length} from JSON, ${addedQuestions.length} from session.`);
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
 * Resets the session questions cache and clears session-added questions.
 */
export const resetQuestions = () => {
  sessionQuestions = [];
  sessionStorage.removeItem(ADDED_QUESTIONS_KEY);
  console.log('Question cache and session storage have been cleared.');
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

/**
 * Adds a new question to the in-memory session cache.
 * This does not persist the question to the JSON file.
 * @param {object} newQuestion - The question object to add.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const addQuestion = async (newQuestion) => {
  // Ensure the cache is loaded
  if (sessionQuestions.length === 0) {
    await getQuestions();
  }

  // Basic validation
  if (!newQuestion || !newQuestion.id || !newQuestion.question) {
    return { success: false, message: "Invalid question object provided." };
  }

  // Check if question with the same ID already exists in the main cache
  const exists = sessionQuestions.some(q => q.id === newQuestion.id);
  if (exists) {
    return { success: false, message: `Question with id ${newQuestion.id} already exists.` };
  }

  // Add to the in-memory cache
  sessionQuestions.unshift(newQuestion); // Add to the beginning

  // Add to sessionStorage for persistence across reloads
  const addedQuestionsStr = sessionStorage.getItem(ADDED_QUESTIONS_KEY);
  const addedQuestions = addedQuestionsStr ? JSON.parse(addedQuestionsStr) : [];
  addedQuestions.unshift(newQuestion); // Add to the beginning
  sessionStorage.setItem(ADDED_QUESTIONS_KEY, JSON.stringify(addedQuestions));

  console.log(`New question with id ${newQuestion.id} added to session and sessionStorage.`);
  return { success: true };
};
