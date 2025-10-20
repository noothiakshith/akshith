# 🧠 LinguaFr - AI-Powered Adaptive Language Learning System

A comprehensive French language learning platform that uses AI (Ollama) to create personalized, adaptive learning experiences. The system continuously analyzes user performance and generates targeted content to optimize learning outcomes.

## 🌟 Key Features

### 🎯 Adaptive Learning Engine
- **Continuous Analysis**: Monitors user mistakes, accuracy, and learning patterns
- **AI-Generated Content**: Creates personalized lessons based on weak areas
- **Difficulty Adjustment**: Automatically adjusts content difficulty based on performance
- **Learning Path Optimization**: Unlocks new content based on XP and progress

### 📚 AI-Powered Content Generation
- **Dynamic Curriculum**: Generates chapters and lessons based on user level
- **Interactive Quests**: Creates multiple choice, fill-in-blank, and other question types
- **Vocabulary & Grammar**: AI-generated explanations and examples
- **Adaptive Lessons**: Targeted content for specific learning weaknesses

### 🎮 Gamification System
- **XP & Coins**: Reward system for completing lessons and quests
- **Streak Tracking**: Daily learning streaks with notifications
- **Achievements**: Unlockable badges for milestones
- **Progress Unlocking**: Chapters unlock based on XP requirements

### 🧠 Spaced Repetition System (SRS)
- **Smart Flashcards**: Generated from mistakes and vocabulary
- **Adaptive Scheduling**: AI-optimized review intervals
- **Mistake Recovery**: Focus on areas where users struggle

### 📊 Analytics & Insights
- **Learning Analytics**: Track progress, accuracy, and time spent
- **AI Generation Logs**: Monitor AI performance and costs
- **Personalized Insights**: Dashboard with learning recommendations
- **Performance Metrics**: Detailed analytics for continuous improvement

## 🏗️ System Architecture

### Backend (Node.js + Express + Prisma)
```
backend/
├── src/
│   ├── controllers/          # API controllers
│   ├── services/            # Business logic
│   │   ├── ai.service.js    # Ollama AI integration
│   │   ├── adaptive.service.js  # Adaptive learning engine
│   │   ├── progress.service.js  # Progress tracking
│   │   ├── srs.service.js   # Spaced repetition
│   │   ├── notification.service.js  # Notifications
│   │   └── analytics.service.js     # Analytics
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & validation
│   └── utils/               # Database connection
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── package.json
```

### Frontend (React + Vite + Tailwind)
```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout/          # Layout components
│   │   └── Notifications/   # Notification system
│   ├── pages/               # Page components
│   │   ├── Auth/            # Login/Signup
│   │   ├── AdaptiveLearning/ # AI dashboard
│   │   ├── Chapters/        # Chapter management
│   │   ├── Lessons/         # Lesson interface
│   │   └── Quests/          # Interactive quests
│   ├── services/            # API services
│   ├── store/               # State management
│   └── App.jsx              # Main app component
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Ollama installed and running locally

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd varshith
```

2. **Install Ollama**
```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai/download
```

3. **Pull AI model**
```bash
ollama pull llama3.2
# or
ollama pull mistral
```

4. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL and JWT secret
npx prisma migrate dev
npx prisma generate
npm run dev
```

5. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linguafr"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Ollama
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2"

# Server
PORT=3001
```

### Database Schema
The system uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User profiles with level, XP, coins, streak
- **Chapter**: AI-generated learning chapters
- **Lesson**: Individual lessons with content and vocabulary
- **Quest**: Interactive questions and exercises
- **Progress**: User progress tracking
- **Mistake**: Error tracking for adaptive learning
- **Flashcard**: SRS flashcards
- **Achievement**: Gamification system
- **Notification**: User notifications
- **AiGenerationLog**: AI usage analytics

## 🧩 System Flow

### 1. User Onboarding
1. User signs up and selects learning level (Beginner/Intermediate/Advanced)
2. AI generates initial curriculum based on level
3. First chapter is unlocked automatically
4. User profile and streak tracking initialized

### 2. Learning Session
1. User completes lessons and quests
2. System tracks answers, accuracy, and time spent
3. XP and coins awarded for correct answers
4. Mistakes logged with categories for analysis

### 3. Adaptive Learning Loop
1. After each session, AI analyzes user performance
2. Identifies weak areas and learning patterns
3. Generates targeted content for improvement
4. Adjusts difficulty based on accuracy trends
5. Creates flashcards from mistakes
6. Sends personalized notifications

### 4. Progression System
1. XP accumulates from completed lessons
2. Chapters unlock based on XP requirements
3. Achievements trigger based on milestones
4. Streak system encourages daily practice
5. SRS schedules review sessions

## 🤖 AI Integration

### Ollama Models
- **Primary**: llama3.2 (recommended)
- **Alternative**: mistral, codellama
- **Custom**: Can be configured for different models

### AI Generation Types
1. **Chapters**: Curriculum structure and descriptions
2. **Lessons**: Detailed content with vocabulary and grammar
3. **Quests**: Interactive questions and exercises
4. **Adaptive Content**: Targeted lessons for weak areas
5. **Flashcards**: Review materials from mistakes
6. **Review Summaries**: Personalized learning insights

### Prompt Engineering
The system uses carefully crafted prompts to ensure:
- Consistent JSON output format
- Appropriate difficulty levels
- Educational content quality
- French language accuracy

## 📊 Analytics & Monitoring

### User Analytics
- Learning progress tracking
- Accuracy trends over time
- Time spent per lesson
- Mistake pattern analysis
- Achievement unlock rates

### AI Performance
- Generation success rates
- Response times
- Model performance comparison
- Cost tracking (if applicable)
- Error logging and debugging

### System Metrics
- User engagement rates
- Content completion rates
- Feature usage statistics
- Performance bottlenecks

## 🔒 Security & Privacy

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Secure database connections

## 🚀 Deployment

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Install and configure Ollama
5. Deploy backend to your server
6. Deploy frontend to CDN/hosting
7. Set up monitoring and logging

### Docker Support (Optional)
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints in `/api/status`

## 🔮 Future Enhancements

- Multi-language support beyond French
- Voice recognition and pronunciation
- Mobile app development
- Advanced AI models integration
- Social learning features
- Teacher dashboard
- Advanced analytics dashboard
- Offline learning support

---

**Built with ❤️ using Ollama, React, Node.js, and Prisma**
