import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, 'interview_coach.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
        } else {
          console.log('Users table created/verified');
        }
      });

      // Interview sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS interview_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          domain TEXT NOT NULL,
          specialization TEXT NOT NULL,
          overall_feedback TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating interview_sessions table:', err.message);
          reject(err);
        } else {
          console.log('Interview sessions table created/verified');
        }
      });

      // Scores table (for individual metric scores)
      db.run(`
        CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id INTEGER NOT NULL,
          metric TEXT NOT NULL,
          score REAL NOT NULL,
          feedback TEXT NOT NULL,
          FOREIGN KEY (session_id) REFERENCES interview_sessions (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating scores table:', err.message);
          reject(err);
        } else {
          console.log('Scores table created/verified');
        }
      });

      // Answers table (for Q&A pairs)
      db.run(`
        CREATE TABLE IF NOT EXISTS answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id INTEGER NOT NULL,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          FOREIGN KEY (session_id) REFERENCES interview_sessions (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating answers table:', err.message);
          reject(err);
        } else {
          console.log('Answers table created/verified');
        }
      });

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_scores_session_id ON scores(session_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id)`);

      resolve();
    });
  });
};

// User operations
export const createUser = async (username, email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, username, email });
        }
      }
    );
  });
};

export const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Interview session operations
export const createInterviewSession = async (userId, sessionData) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO interview_sessions (user_id, date, domain, specialization, overall_feedback) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, sessionData.date, sessionData.domain, sessionData.specialization, sessionData.report.overallFeedback],
      function(err) {
        if (err) {
          reject(err);
        } else {
          const sessionId = this.lastID;
          
          // Insert scores
          const scorePromises = sessionData.report.scores.map(score => {
            return new Promise((resolveScore, rejectScore) => {
              db.run(
                'INSERT INTO scores (session_id, metric, score, feedback) VALUES (?, ?, ?, ?)',
                [sessionId, score.metric, score.score, score.feedback],
                function(err) {
                  if (err) rejectScore(err);
                  else resolveScore();
                }
              );
            });
          });

          // Insert answers
          const answerPromises = sessionData.report.answers.map(answer => {
            return new Promise((resolveAnswer, rejectAnswer) => {
              db.run(
                'INSERT INTO answers (session_id, question, answer) VALUES (?, ?, ?)',
                [sessionId, answer.question, answer.answer],
                function(err) {
                  if (err) rejectAnswer(err);
                  else resolveAnswer();
                }
              );
            });
          });

          Promise.all([...scorePromises, ...answerPromises])
            .then(() => {
              resolve({ id: sessionId, ...sessionData });
            })
            .catch(reject);
        }
      }
    );
  });
};

export const getSessionsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT s.*, 
              GROUP_CONCAT(sc.metric || ':' || sc.score || ':' || sc.feedback, '|') as scores_data,
              GROUP_CONCAT(a.question || ':' || a.answer, '|') as answers_data
       FROM interview_sessions s
       LEFT JOIN scores sc ON s.id = sc.session_id
       LEFT JOIN answers a ON s.id = a.session_id
       WHERE s.user_id = ?
       GROUP BY s.id
       ORDER BY s.created_at ASC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const sessions = rows.map(row => {
            const scores = row.scores_data ? row.scores_data.split('|').map(scoreStr => {
              const [metric, score, feedback] = scoreStr.split(':');
              return { metric, score: parseFloat(score), feedback };
            }) : [];

            const answers = row.answers_data ? row.answers_data.split('|').map(answerStr => {
              const [question, answer] = answerStr.split(':');
              return { question, answer };
            }) : [];

            return {
              id: row.id.toString(),
              date: row.date,
              domain: row.domain,
              specialization: row.specialization,
              report: {
                overallFeedback: row.overall_feedback,
                scores,
                answers
              }
            };
          });
          resolve(sessions);
        }
      }
    );
  });
};

export const getSessionById = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT s.*, 
              GROUP_CONCAT(sc.metric || ':' || sc.score || ':' || sc.feedback, '|') as scores_data,
              GROUP_CONCAT(a.question || ':' || a.answer, '|') as answers_data
       FROM interview_sessions s
       LEFT JOIN scores sc ON s.id = sc.session_id
       LEFT JOIN answers a ON s.id = a.session_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [sessionId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const scores = row.scores_data ? row.scores_data.split('|').map(scoreStr => {
            const [metric, score, feedback] = scoreStr.split(':');
            return { metric, score: parseFloat(score), feedback };
          }) : [];

          const answers = row.answers_data ? row.answers_data.split('|').map(answerStr => {
            const [question, answer] = answerStr.split(':');
            return { question, answer };
          }) : [];

          resolve({
            id: row.id.toString(),
            date: row.date,
            domain: row.domain,
            specialization: row.specialization,
            report: {
              overallFeedback: row.overall_feedback,
              scores,
              answers
            }
          });
        }
      }
    );
  });
};

// Close database connection
export const closeDatabase = () => {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
      resolve();
    });
  });
};

export default db;
