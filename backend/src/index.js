import express, { json } from 'express';
import dotenv from 'dotenv';
import settingsRoutes from './routes/setting.routes.js';
import authRoutes from './routes/auth.routes.js';
import chapterRoutes from './routes/chapter.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import questRoutes from './routes/quest.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import flashcardRoutes from './routes/flashcard.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import reviewRoutes from './routes/review.routes.js';
import achievementRoutes from './routes/achievement.routes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is up and running!' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/achievements', achievementRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
