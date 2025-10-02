import express from 'express';
import cors from 'cors';
import ollama from 'ollama';
import jwt from 'jsonwebtoken';
import { 
  initDatabase, 
  createUser, 
  getUserByUsername, 
  getUserById, 
  verifyPassword,
  createInterviewSession,
  getSessionsByUserId,
  getSessionById
} from './database.js';

const app = express();
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

const OLLAMA_MODEL = 'llama3'; // Or whichever model you have pulled in Ollama

// Initialize database on startup
initDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper to interact with Ollama and parse JSON
const generateJsonResponse = async (prompt) => {
    try {
        const response = await ollama.generate({
            model: OLLAMA_MODEL,
            prompt: `${prompt}\n\nIMPORTANT: Respond with only the JSON object, without any surrounding text, comments, or code blocks.`,
            format: 'json',
            stream: false,
        });
        
        // The 'ollama' library with format: 'json' should return a parsed object in response.response
        // but sometimes it's a string, so we parse it just in case.
        if (typeof response.response === 'string') {
             return JSON.parse(response.response);
        }
        return response.response;
    } catch (error) {
        console.error('Error communicating with Ollama:', error);
        throw new Error('Failed to get a valid JSON response from the AI model.');
    }
};

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Create new user
    const user = await createUser(username, email, password);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user from database
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Interview session endpoints
app.post('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const sessionData = req.body;
    const session = await createInterviewSession(req.user.userId, sessionData);
    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to save interview session' });
  }
});

app.get('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await getSessionsByUserId(req.user.userId);
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/api/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const session = await getSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.post('/api/questions', async (req, res) => {
    const { domain, specialization } = req.body;
    const prompt = `You are a senior hiring manager. Your task is to generate a list of interview questions.
    The list must contain exactly 10 unique, insightful, and relevant interview questions for a '${specialization}' role in the '${domain}' field.
    Provide the response as a JSON object with a single key "questions" which is an array of 10 strings.
    Example format: {"questions": ["Question 1?", "Question 2?"]}`;

    try {
        const jsonResponse = await generateJsonResponse(prompt);
        res.json(jsonResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/analyze', async (req, res) => {
    const { answers } = req.body;
    const prompt = `You are an expert interview coach. Analyze the following interview questions and answers: ${JSON.stringify(answers)}.
    IMPORTANT:give 0 in all metrics if the candidate does not answer
    
    Provide a concise overall feedback summary and score the user's performance on these specific metrics (1-10 scale):
    
    1. Technical Knowledge - Understanding of technical concepts and domain expertise
    2. Problem Solving - Ability to approach and solve complex problems systematically
    3. Communication - Clarity, structure, and effectiveness of communication
    4. Code Quality - Quality of code examples, explanations, and technical implementation (if applicable)
    5. Industry Awareness - Knowledge of current trends, best practices, and industry standards
    6. Confidence - Poise, confidence, and professional demeanor in responses
    
    Provide the response as a JSON object with two keys: "overallFeedback" (string) and "scores" (an array of objects, each with "metric", "score" (1-10), and "feedback").
    
    IMPORTANT: Use exactly these metric names: "Technical Knowledge", "Problem Solving", "Communication", "Code Quality", "Industry Awareness", "Confidence"
    
    Example format: {"overallFeedback": "Good job!", "scores": [{"metric": "Technical Knowledge", "score": 8, "feedback": "Strong understanding of core concepts."}]}`;

    try {
        const jsonResponse = await generateJsonResponse(prompt);
        res.json(jsonResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/hint', async (req, res) => {
    const { question } = req.body;
    const prompt = `You are an expert interview coach. A user is stuck on the following interview question: "${question}".
    Provide a single, concise hint to guide them. The hint should be 1-2 sentences and suggest a key concept or a direction to think about, without giving away the full answer.
    Provide the response as a JSON object with a single key "hint" which is a string.
    Example format: {"hint": "Consider the trade-offs between..."}`;

    try {
        const jsonResponse = await generateJsonResponse(prompt);
        res.json(jsonResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`AI Coach server listening at http://localhost:${port}`);
    console.log('Ensure you have Ollama running with a model like Llama 3.');
});
