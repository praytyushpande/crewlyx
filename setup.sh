#!/bin/bash

# CrewlyX Setup Script
# This script will help you set up the CrewlyX project

echo "🚀 CrewlyX Setup Script"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if MongoDB is installed
if ! command -v mongo &> /dev/null && ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo ""
    echo "To install MongoDB:"
    echo "  macOS: brew install mongodb-community"
    echo "  Ubuntu: sudo apt-get install mongodb-org"
    echo "  Windows: Download from https://www.mongodb.com/try/download/community"
    echo ""
    read -p "Continue without MongoDB check? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB detected"
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Check if MongoDB is running
echo ""
echo "🔍 Checking MongoDB connection..."

if command -v mongosh &> /dev/null; then
    mongosh --eval "db.version()" --quiet > /dev/null 2>&1
    MONGO_STATUS=$?
elif command -v mongo &> /dev/null; then
    mongo --eval "db.version()" --quiet > /dev/null 2>&1
    MONGO_STATUS=$?
else
    MONGO_STATUS=1
fi

if [ $MONGO_STATUS -eq 0 ]; then
    echo "✅ MongoDB is running"
    
    # Seed database
    echo ""
    read -p "Would you like to seed the database with test users? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo ""
        echo "🌱 Seeding database..."
        npm run seed
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Database seeded successfully!"
        else
            echo "⚠️  Database seeding failed. You can run 'npm run seed' manually later."
        fi
    fi
else
    echo "⚠️  MongoDB is not running"
    echo ""
    echo "To start MongoDB:"
    echo "  macOS: brew services start mongodb-community"
    echo "  Ubuntu: sudo systemctl start mongod"
    echo "  Windows: net start MongoDB"
    echo ""
    echo "After starting MongoDB, run: cd server && npm run seed"
fi

cd ..

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start MongoDB (if not running):"
echo "   macOS: brew services start mongodb-community"
echo "   Ubuntu: sudo systemctl start mongod"
echo ""
echo "2. Start the backend server:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "4. Open your browser at: http://localhost:3000"
echo ""
echo "5. Login with test account:"
echo "   Email: alex@test.com"
echo "   Password: Test123"
echo ""
echo "🎉 Happy building with CrewlyX!"
echo ""