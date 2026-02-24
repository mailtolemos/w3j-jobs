#!/bin/bash

# $W3J Quick Start Script
# This script helps you get started with the Web3 Jobs Aggregator

echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║         $W3J Quick Start Setup            ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH"
    echo "   You'll need MongoDB running. Options:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    echo "   3. Use Docker: docker run -d -p 27017:27017 mongo:7"
    echo ""
fi

# Setup backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit backend/.env with your settings!"
    echo ""
fi

if [ ! -d node_modules ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

cd ..

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..

# Summary
echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║           Setup Complete! ✅              ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your settings:"
echo "   • Edit backend/.env (MongoDB, Admin credentials, Telegram)"
echo ""
echo "2. Start the application:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "3. Access the admin panel:"
echo "   http://localhost:3000/admin"
echo ""
echo "4. Set up Telegram bot (optional but recommended):"
echo "   • Create bot with @BotFather"
echo "   • Add bot to your group as admin"
echo "   • Get chat ID and update .env"
echo ""
echo "📚 See README.md for detailed instructions"
echo ""
echo "Happy job hunting! 🚀"
