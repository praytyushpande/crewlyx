#!/bin/bash

echo "🔧 CrewlyX - Complete System Check & Start"
echo "=========================================="
echo ""

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
killall node 2>/dev/null
sleep 2

# Check MongoDB
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB not running. Starting..."
    brew services start mongodb-community
    sleep 3
fi

if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start. Please start it manually:"
    echo "   brew services start mongodb-community"
    exit 1
fi

# Check if database is seeded
echo ""
echo "🌱 Checking database..."
USER_COUNT=$(mongosh crewlyx --quiet --eval "db.users.countDocuments()" 2>/dev/null)
if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "⚠️  Database empty. Seeding..."
    cd server && npm run seed > /dev/null 2>&1 && cd ..
    echo "✅ Database seeded"
else
    echo "✅ Database has $USER_COUNT users"
fi

# Start backend
echo ""
echo "🔧 Starting backend server..."
cd server
npm run dev > server.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 4

# Check if backend started
if lsof -i :5001 | grep LISTEN > /dev/null; then
    echo "✅ Backend running on port 5001"
else
    echo "❌ Backend failed to start. Check server/server.log"
    exit 1
fi

# Test backend
echo ""
echo "🧪 Testing backend..."
HEALTH_CHECK=$(curl -s http://localhost:5001/api/health | grep -o '"status":"OK"')
if [ "$HEALTH_CHECK" = '"status":"OK"' ]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Test login endpoint
echo ""
echo "🔐 Testing login endpoint..."
LOGIN_TEST=$(curl -s -X POST http://localhost:5001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alex@test.com","password":"Test123"}' | grep -o '"success":true')

if [ "$LOGIN_TEST" = '"success":true' ]; then
    echo "✅ Login endpoint working"
else
    echo "❌ Login endpoint failed"
    cat server/server.log | tail -10
    exit 1
fi

# Start frontend
echo ""
echo "🎨 Starting frontend server..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend started
if lsof -i :3000 | grep LISTEN > /dev/null; then
    echo "✅ Frontend running on port 3000"
else
    echo "❌ Frontend failed to start. Check logs/frontend.log"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ ALL SYSTEMS OPERATIONAL!"
echo "=========================================="
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo ""
echo "🔑 Test Credentials:"
echo "   Email:    alex@test.com"
echo "   Password: Test123"
echo ""
echo "📊 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop:"
echo "   ./stop-dev.sh"
echo "   or: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f server/server.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
