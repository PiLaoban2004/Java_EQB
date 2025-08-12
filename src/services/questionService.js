// A mock service for getting and updating questions.
// In a real application, this would make API calls to a backend.
import { questions as staticQuestions } from '../questions.js';

let questions = [...staticQuestions];

export const getQuestions = async () => {
  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return questions;
};

export const deleteQuestion = async (questionId) => {
  // Simulate an API call to delete a question
  await new Promise(resolve => setTimeout(resolve, 100));
  const index = questions.findIndex(q => q.id === questionId);
  if (index !== -1) {
    questions.splice(index, 1);
    console.log(`Question with id ${questionId} "deleted".`);
    return { success: true };
  }
  return { success: false, message: "Question not found." };
};
