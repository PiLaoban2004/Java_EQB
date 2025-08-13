import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { questions } from '../../src/questions'; // Static import for the full question list

const app = new Hono().basePath('/api');

// Endpoint to get the full list of questions
app.get('/questions', (c) => {
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

  if (!questionId) {
    return c.json({ error: 'Question ID is required' }, 400);
  }

  try {
    await c.env.DB.prepare('INSERT OR IGNORE INTO Users (id) VALUES (?)').bind(userId).run();
    
    // Use INSERT OR REPLACE to either add a new wrong answer or update the existing one
    await c.env.DB.prepare(
      'INSERT OR REPLACE INTO WrongAnswers (userId, questionId, userAnswer) VALUES (?, ?, ?)'
    ).bind(userId, questionId, JSON.stringify(userAnswer)).run();
      
    return c.json({ success: true });
  } catch (e) {
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

export const onRequest = handle(app);
