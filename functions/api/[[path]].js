import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { sign, verify } from 'hono/jwt'; // Import JWT functions
import { v4 as uuidv4 } from 'uuid'; // For generating user IDs
import bcrypt from 'bcryptjs'; // Import bcryptjs

const app = new Hono().basePath('/api');

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

let questionsCache = null;

async function getQuestions(c) {
  if (questionsCache) {
    return questionsCache;
  }

  // In Cloudflare Workers, we need to fetch assets from the deployed site.
  // We construct the URL based on the incoming request's URL.
  const url = new URL(c.req.url);
  const questionsUrl = `${url.protocol}//${url.host}/questions.json`;

  try {
    const response = await fetch(questionsUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions.json: ${response.statusText}`);
    }
    const data = await response.json();
    questionsCache = data;
    return questionsCache;
  } catch (error) {
    console.error("Error fetching questions.json:", error);
    // Return an empty array or handle the error as appropriate
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
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with bcrypt
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

    if (!user || !(await bcrypt.compare(password, user.password_hash))) { // Compare password with bcrypt
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
// Get list of available materials
app.get('/materials', (c) => {
  // In a real-world scenario, this might be dynamically generated.
  // For this project, we'll hardcode it based on the known files.
  const materials = [
    { id: 'java-collection', name: 'Java - Collection.md' },
  ];
  return c.json(materials);
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


export const onRequest = handle(app);
