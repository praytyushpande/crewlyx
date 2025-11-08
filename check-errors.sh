#\!/bin/bash

echo "🔍 Checking for common errors..."
echo ""

# Check if MongoDB is running
echo "1. Checking MongoDB..."
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1 || mongo --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo "   ✅ MongoDB is running"
else
    echo "   ❌ MongoDB is NOT running"
    echo "   Fix: brew services start mongodb-community"
fi

# Check if backend dependencies exist
echo ""
echo "2. Checking backend dependencies..."
if [ -d "server/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Backend dependencies missing"
    echo "   Fix: cd server && npm install"
fi

# Check if frontend dependencies exist
echo ""
echo "3. Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ❌ Frontend dependencies missing"
    echo "   Fix: npm install"
fi

# Check if backend is running
echo ""
echo "4. Checking if backend is running on port 5000..."
if lsof -i:5000 > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5000"
else
    echo "   ❌ Backend is NOT running"
    echo "   Fix: cd server && npm run dev"
fi

# Check if frontend is running
echo ""
echo "5. Checking if frontend is running on port 3000..."
if lsof -i:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
else
    echo "   ❌ Frontend is NOT running"
    echo "   Fix: npm run dev"
fi

# Check if .env exists
echo ""
echo "6. Checking server configuration..."
if [ -f "server/.env" ]; then
    echo "   ✅ server/.env exists"
else
    echo "   ❌ server/.env missing"
    echo "   Fix: Create server/.env file"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Common Error Solutions:"
echo ""
echo "Error: 'Failed to fetch' or Network Error"
echo "→ Backend not running. Run: cd server && npm run dev"
echo ""
echo "Error: CORS Error"
echo "→ Check server/.env has: CORS_ORIGIN=http://localhost:3000"
echo ""
echo "Error: Cannot read property '_id'"
echo "→ Fixed\! Just save and refresh browser"
echo ""
echo "Error: MongoDB connection failed"
echo "→ Run: brew services start mongodb-community"
echo ""

