import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { sign, verify } from 'hono/jwt'; // Import JWT functions
import { v4 as uuidv4 } from 'uuid'; // For generating user IDs
// import bcrypt from 'bcryptjs'; // bcryptjs is not fully compatible with Cloudflare Workers, switching to Web Crypto API

const app = new Hono().basePath('/api');

// --- Web Crypto API Helpers for Password Hashing ---
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordData = new TextEncoder().encode(password);
  const saltData = new TextEncoder().encode(new TextDecoder("utf-8").decode(salt));

  const key = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const passwordData = new TextEncoder().encode(password);

  const key = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256
  );

  const newHashArray = Array.from(new Uint8Array(derivedBits));
  const newHashHex = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return newHashHex === hashHex;
}

// Middleware to verify JWT
async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    // Use c.env.JWT_SECRET directly as it should be available from wrangler.toml or Cloudflare env
    const payload = await verify(token, c.env.JWT_SECRET_1); // Use JWT_SECRET_1
    c.set('userId', payload.userId); // Store userId in context
    await next();
  } catch (e) {
    return c.json({ error: 'Unauthorized: Invalid token', details: e.message }, 401);
  }
}

// This function is now designed to always fetch the latest version, bypassing any cache.
async function getQuestions(c) {
  const url = new URL(c.req.url);
  // Add cache-busting parameter to the internal fetch
  const questionsUrl = `${url.protocol}//${url.host}/questions.json?t=${new Date().getTime()}`;

  try {
    const response = await fetch(questionsUrl, { headers: { 'Cache-Control': 'no-cache' } });
    if (!response.ok) {
      throw new Error(`Failed to fetch questions.json: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions.json:", error);
    return [];
  }
}


// Endpoint to get the full list of questions
app.get('/questions', async (c) => {
  const questions = await getQuestions(c);
  return c.json(questions);
});

// --- User Authentication ---
// Register a new user
app.post('/register', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  try {
    const hashedPassword = await hashPassword(password); // Use Web Crypto
    const userId = uuidv4(); // Generate a unique ID for the user

    await c.env.DB.prepare('INSERT INTO Users (id, username, password_hash) VALUES (?, ?, ?)')
      .bind(userId, username, hashedPassword)
      .run();

    const token = await sign({ userId, username }, c.env.JWT_SECRET_1); // Use JWT_SECRET_1
    return c.json({ success: true, userId, username, token });
  } catch (e) {
    if (e.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Username already exists' }, 409);
    }
    return c.json({ error: 'Failed to register user', details: e.message }, 500);
  }
});

// Login user
app.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  try {
    const { results } = await c.env.DB.prepare('SELECT id, username, password_hash FROM Users WHERE username = ?')
      .bind(username)
      .all();

    const user = results[0];

    if (!user || !(await verifyPassword(password, user.password_hash))) { // Use Web Crypto
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    const token = await sign({ userId: user.id, username: user.username }, c.env.JWT_SECRET_1); // Use JWT_SECRET_1
    return c.json({ success: true, userId: user.id, username: user.username, token });
  } catch (e) {
    return c.json({ error: 'Failed to login', details: e.message }, 500);
  }
});


// --- Wrong Answer Book Management ---
// Get wrong answers for the authenticated user, including their incorrect answer
app.get('/wrong-questions', authMiddleware, async (c) => {
  const userId = c.get('userId'); // Get userId from context set by authMiddleware
  try {
    const questions = await getQuestions(c);
    const { results } = await c.env.DB.prepare(
      'SELECT questionId, userAnswer FROM WrongAnswers WHERE userId = ?'
    ).bind(userId).all();

    const wrongQuestionData = results.map(r => ({
      id: r.questionId,
      userAnswer: r.userAnswer
    }));

    // Join with full question details
    const wrongQuestions = wrongQuestionData.map(wq => {
      const questionDetails = questions.find(q => q.id === wq.id);
      return { ...questionDetails, userAnswer: wq.userAnswer };
    });

    return c.json(wrongQuestions);
  } catch (e) {
    return c.json({ error: 'Failed to fetch wrong questions', details: e.message }, 500);
  }
});

// Add or update a wrong answer for the authenticated user
app.post('/wrong-questions', authMiddleware, async (c) => {
  const userId = c.get('userId'); // Get userId from context set by authMiddleware
  const { questionId, userAnswer } = await c.req.json();

  if (!questionId) {
    return c.json({ error: 'Question ID is required' }, 400);
  }

  try {
    const stmt = c.env.DB.prepare(
      'INSERT OR REPLACE INTO WrongAnswers (userId, questionId, userAnswer) VALUES (?, ?, ?)'
    );
    await stmt.bind(userId, questionId, JSON.stringify(userAnswer)).run();
      
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Failed to add or update wrong question', details: e.message }, 500);
  }
});

// Remove a wrong answer for the authenticated user
app.delete('/wrong-questions/:questionId', authMiddleware, async (c) => {
  const userId = c.get('userId'); // Get userId from context set by authMiddleware
  const { questionId } = c.req.param();
  
  try {
    await c.env.DB.prepare('DELETE FROM WrongAnswers WHERE userId = ? AND questionId = ?')
      .bind(userId, parseInt(questionId, 10))
      .run();
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Failed to delete wrong question', details: e.message }, 500);
  }
});

// --- Question Mastery Management ---
// Update mastery for a question for the authenticated user
app.post('/mastery/:questionId', authMiddleware, async (c) => {
  const userId = c.get('userId'); // Get userId from context set by authMiddleware
  const { questionId } = c.req.param();
  const { correct } = await c.req.json();

  const qId = parseInt(questionId, 10);

  try {
    if (correct) {
      // Increment streak
      await c.env.DB.prepare(
        `INSERT INTO QuestionMastery (userId, questionId, correctStreak, lastAnsweredAt)
         VALUES (?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(userId, questionId) DO UPDATE SET
         correctStreak = correctStreak + 1,
         lastAnsweredAt = CURRENT_TIMESTAMP`
      ).bind(userId, qId).run();
    } else {
      // Reset streak
      await c.env.DB.prepare(
        `INSERT INTO QuestionMastery (userId, questionId, correctStreak, lastAnsweredAt)
         VALUES (?, ?, 0, CURRENT_TIMESTAMP)
         ON CONFLICT(userId, questionId) DO UPDATE SET
         correctStreak = 0,
         lastAnsweredAt = CURRENT_TIMESTAMP`
      ).bind(userId, qId).run();
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'Failed to update mastery', details: e.message }, 500);
  }
});

// Get mastered question IDs for the authenticated user
app.get('/mastered-questions', authMiddleware, async (c) => {
  const userId = c.get('userId'); // Get userId from context set by authMiddleware
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT questionId FROM QuestionMastery WHERE userId = ? AND correctStreak >= 3'
    ).bind(userId).all();
    const masteredIds = results.map(r => r.questionId);
    return c.json(masteredIds);
  } catch (e) {
    return c.json({ error: 'Failed to fetch mastered questions', details: e.message }, 500);
  }
});

// --- Materials ---
// Get list of available materials by fetching the manifest file, ensuring no cache is used.
app.get('/materials', async (c) => {
  const url = new URL(c.req.url);
  // Add cache-busting parameter to the internal fetch
  const materialsUrl = `${url.protocol}//${url.host}/materials.json?t=${new Date().getTime()}`;

  try {
    const response = await fetch(materialsUrl, { headers: { 'Cache-Control': 'no-cache' } });
    if (!response.ok) {
      throw new Error(`Failed to fetch materials.json: ${response.statusText}`);
    }
    const materials = await response.json();
    
    // Set headers on the final response to prevent client-side caching
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');
    
    return c.json(materials);
  } catch (error) {
    console.error("Error fetching materials.json:", error);
    return c.json([], 500); // Return empty array on error
  }
});

// Get mastery progress for the authenticated user
app.get('/mastery-progress', authMiddleware, async (c) => {
  const userId = c.get('userId'); // Get userId from context set by authMiddleware
  try {
    const allQuestions = await getQuestions(c);
    const totalQuestions = allQuestions.length;

    if (totalQuestions === 0) {
      return c.json({ masteredCount: 0, totalQuestions: 0, progress: 0 });
    }

    const { results } = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM QuestionMastery WHERE userId = ? AND correctStreak >= 3'
    ).bind(userId).all();
    
    const masteredCount = results[0]?.count || 0;
    const progress = Math.round((masteredCount / totalQuestions) * 100);

    return c.json({ masteredCount, totalQuestions, progress });
  } catch (e) {
    return c.json({ error: 'Failed to fetch mastery progress', details: e.message }, 500);
  }
});

// --- AI Proxy ---
// This endpoint will proxy requests to the AI service to avoid mixed-content issues.
app.post('/proxy/gemini', async (c) => {
  const GEMINI_API_KEY = c.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return c.json({ error: "GEMINI_API_KEY secret not found. Please configure it in Cloudflare dashboard." }, 500);
  }

  // Pointing the proxy to the user-provided endpoint.
  const GEMINI_API_ENDPOINT = 'https://pilaoban.dpdns.org';
  // Let's remove the model to use the server's default, in case of incompatibility.
  const apiUrl = `${GEMINI_API_ENDPOINT}/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const requestBody = await c.req.json();
    
    // Construct a new Request object to have more control over headers
    const request = new Request(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker-Proxy/1.0' // Set a user agent
      },
      body: JSON.stringify(requestBody),
    });

    // Use fetch with the Request object
    const response = await fetch(request);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`AI Proxy Error: ${response.status} ${response.statusText}`, errorBody);
      return c.json({ error: 'AI service proxy failed', details: errorBody }, response.status);
    }

    const data = await response.json();
    return c.json(data);

  } catch (error) {
    console.error('Error in AI proxy:', error);
    return c.json({ error: 'Failed to proxy AI request', details: error.message }, 500);
  }
});


export const onRequest = handle(app);
