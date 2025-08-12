const WRONG_BOOK_KEY = 'wrongAnswerBook';

/**
 * Retrieves the wrong questions from localStorage.
 * @returns {Array} An array of wrong question objects.
 */
export const getWrongQuestions = () => {
  const data = localStorage.getItem(WRONG_BOOK_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Adds a wrong question to the book.
 * It avoids duplicates based on question ID.
 * @param {Object} question - The question object to add.
 */
export const addWrongQuestion = (question) => {
  const questions = getWrongQuestions();
  const isAlreadyInBook = questions.some(q => q.id === question.id);
  if (!isAlreadyInBook) {
    questions.push(question);
    localStorage.setItem(WRONG_BOOK_KEY, JSON.stringify(questions));
  }
};

/**
 * Removes a question from the wrong answer book by its ID.
 * @param {number} questionId - The ID of the question to remove.
 */
export const removeWrongQuestion = (questionId) => {
  let questions = getWrongQuestions();
  questions = questions.filter(q => q.id !== questionId);
  localStorage.setItem(WRONG_BOOK_KEY, JSON.stringify(questions));
};
