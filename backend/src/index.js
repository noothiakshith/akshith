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
// ...existing middleware and routes



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(json());

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
// ... other app.use calls
app.use('/api/review', reviewRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
