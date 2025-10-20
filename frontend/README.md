# LinguaFr Frontend

A modern React frontend for the LinguaFr French learning application.

## Features

- 🔐 **Authentication**: Password-based signup and signin
- 📚 **Chapters & Lessons**: Structured learning path
- 🧠 **Flashcards**: Spaced repetition system for vocabulary
- 🎯 **Quests**: Interactive exercises and challenges
- 🏆 **Achievements**: Gamified learning experience
- 📊 **Progress Tracking**: Dashboard with stats and progress
- 🥇 **Leaderboard**: Compete with other learners
- ⚙️ **Settings**: Customizable preferences and goals
- 🔄 **Review System**: Practice mistakes and previous content

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend URL:
```
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Header, Sidebar, etc.)
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard page
│   ├── Chapters/       # Chapter-related pages
│   ├── Lessons/        # Lesson pages
│   ├── Flashcards/     # Flashcard review
│   ├── Achievements/   # Achievements page
│   ├── Leaderboard/    # Leaderboard page
│   ├── Settings/       # Settings page
│   └── Review/         # Review system
├── services/           # API services
├── store/              # Zustand stores
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## API Integration

The frontend integrates with the backend through a RESTful API:

- **Authentication**: `/api/auth/*`
- **Dashboard**: `/api/dashboard`
- **Chapters**: `/api/chapters/*`
- **Lessons**: `/api/lessons/*`
- **Quests**: `/api/quests/*`
- **Flashcards**: `/api/flashcards/*`
- **Achievements**: `/api/achievements`
- **Leaderboard**: `/api/leaderboard`
- **Settings**: `/api/settings`
- **Review**: `/api/review/*`

## State Management

The app uses Zustand for state management with two main stores:

- **authStore**: User authentication and profile data
- **gameStore**: Learning progress, chapters, lessons, and game data

## Styling

The app uses Tailwind CSS for styling with a custom design system:

- **Primary Colors**: Blue theme for branding
- **Components**: Reusable button, input, and card classes
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Support for dark theme (configurable in settings)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS classes for styling
- Keep components small and focused
- Use proper TypeScript types (if migrating to TS)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.