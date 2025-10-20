#!/bin/bash

# LinguaFr Setup Script
echo "🧠 Setting up LinguaFr - AI-Powered Language Learning System"
echo "=============================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "✅ Ollama installed successfully!"
else
    echo "✅ Ollama is already installed"
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   Visit: https://www.postgresql.org/download/"
    exit 1
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "🤖 Setting up Ollama model..."
ollama pull llama3.2

echo ""
echo "🗄️ Setting up database..."
cd ../backend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/linguafr"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Ollama Configuration
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="llama3.2"

# Server Configuration
PORT=3001
NODE_ENV="development"
EOL
    echo "⚠️  Please edit backend/.env with your actual database credentials"
fi

echo ""
echo "🚀 Running database migrations..."
npx prisma migrate dev --name init
npx prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Start Ollama: ollama serve"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access the application at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001"
echo ""
echo "📚 Read README.md for detailed documentation"
