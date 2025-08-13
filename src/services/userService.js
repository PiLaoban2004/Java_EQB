import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'quizAppUserId';

let currentUserId = null;

/**
 * Initializes the user service. Checks for an existing user ID in localStorage,
 * creates one if it doesn't exist, and ensures the user exists on the backend.
 */
export const initUserService = async () => {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  currentUserId = userId;

  // Ensure the user exists in the backend database.
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      console.error('Failed to ensure user exists on the backend.');
    }
  } catch (error) {
    console.error('Error contacting backend to ensure user exists:', error);
  }
};

/**
 * Gets the current user's ID.
 * @returns {string | null} The current user ID.
 */
export const getUserId = () => {
  return currentUserId;
};
