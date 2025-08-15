const TOKEN_KEY = 'quizAppAuthToken';

/**
 * Registers a new user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} User data including token if successful.
 */
export const registerUser = async (username, password) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem(TOKEN_KEY, data.token);
      return { success: true, user: { id: data.userId, username: data.username } };
    } else {
      return { success: false, error: data.error || 'Registration failed' };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, error: 'Network error or server unavailable' };
  }
};

/**
 * Logs in an existing user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} User data including token if successful.
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem(TOKEN_KEY, data.token);
      return { success: true, user: { id: data.userId, username: data.username } };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, error: 'Network error or server unavailable' };
  }
};

/**
 * Logs out the current user by removing the token.
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Gets the authentication token from local storage.
 * @returns {string | null} The JWT token.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Checks if the user is authenticated.
 * @returns {boolean} True if a token exists, false otherwise.
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Decodes the JWT token to get current user information.
 * NOTE: This is a client-side decode and should not be used for sensitive authorization.
 * The server-side authMiddleware performs the actual verification.
 * @returns {object | null} Decoded user payload or null if not authenticated/invalid token.
 */
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    // Basic JWT decode (not verifying signature here, just parsing payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};
