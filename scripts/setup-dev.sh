#!/bin/bash

# Development setup script for Financial AI Agent

echo "🚀 Setting up Financial AI Agent development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Husky
echo "🪝 Setting up Git hooks..."
npx husky install

# Make Husky hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your actual configuration values"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if MongoDB is ready
echo "🔍 Checking MongoDB connection..."
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is ready"
else
    echo "⚠️  MongoDB might still be starting up. Check with: docker-compose logs mongodb"
fi

# Check if Redis is ready
echo "🔍 Checking Redis connection..."
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "⚠️  Redis might still be starting up. Check with: docker-compose logs redis"
fi

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see the application"
echo ""
echo "Useful commands:"
echo "- npm run dev          # Start development server"
echo "- npm run build        # Build for production"
echo "- npm run test         # Run tests"
echo "- npm run lint         # Run linter"
echo "- docker-compose logs  # View service logs"
echo ""