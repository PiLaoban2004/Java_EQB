import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

const app = new Hono().basePath('/api');

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

// --- User Management ---
// Create a new user with a unique ID
app.post('/users', async (c) => {
  const { userId } = await c.req.json();
  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400);
  }
  try {
    await c.env.DB.prepare('INSERT INTO Users (id) VALUES (?)').bind(userId).run();
    return c.json({ success: true, userId });
  } catch (e) {
    if (e.message.includes('UNIQUE constraint failed')) {
      return c.json({ success: true, message: 'User already exists.', userId });
    }
    return c.json({ error: 'Failed to create user', details: e.message }, 500);
  }
});


// --- Wrong Answer Book Management ---
// Get wrong answers for a specific user, including their incorrect answer
app.get('/users/:userId/wrong-questions', async (c) => {
  const { userId } = c.req.param();
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

// Add or update a wrong answer for a user
app.post('/users/:userId/wrong-questions', async (c) => {
  const { userId } = c.req.param();
  const { questionId, userAnswer } = await c.req.json();

  console.log(`Received request to add wrong question: userId=${userId}, questionId=${questionId}`);

  if (!questionId) {
    console.error('Validation failed: Question ID is required.');
    return c.json({ error: 'Question ID is required' }, 400);
  }

  try {
    console.log('Ensuring user exists in DB...');
    await c.env.DB.prepare('INSERT OR IGNORE INTO Users (id) VALUES (?)').bind(userId).run();
    console.log('User ensured.');

    console.log('Adding/updating wrong answer...');
    const stmt = c.env.DB.prepare(
      'INSERT OR REPLACE INTO WrongAnswers (userId, questionId, userAnswer) VALUES (?, ?, ?)'
    );
    const result = await stmt.bind(userId, questionId, JSON.stringify(userAnswer)).run();
    
    console.log('Database operation result:', JSON.stringify(result));
      
    return c.json({ success: true });
  } catch (e) {
    console.error('Failed to add or update wrong question:', e.message);
    return c.json({ error: 'Failed to add or update wrong question', details: e.message }, 500);
  }
});

// Remove a wrong answer for a user
app.delete('/users/:userId/wrong-questions/:questionId', async (c) => {
  const { userId, questionId } = c.req.param();
  
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
// Update mastery for a question
app.post('/users/:userId/mastery/:questionId', async (c) => {
  const { userId, questionId } = c.req.param();
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

// Get mastered question IDs for a user
app.get('/users/:userId/mastered-questions', async (c) => {
  const { userId } = c.req.param();
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

// Get mastery progress for a user
app.get('/users/:userId/mastery-progress', async (c) => {
  const { userId } = c.req.param();
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
