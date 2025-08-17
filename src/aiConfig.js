// The API key is now managed server-side for better security.
// export const GEMINI_API_KEY = '...'; 

// The endpoint now points to our own backend proxy.
export const GEMINI_API_ENDPOINT = '/api/proxy/gemini'; 

// Model is still needed to be referenced, but the actual model is set on the server.
export const GEMINI_MODEL = 'gemini-2.5-flash';
