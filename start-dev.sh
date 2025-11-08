#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting CrewlyX Development Servers...${NC}\n"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${BLUE}📦 Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 2
fi

# Start backend server in background
echo -e "${BLUE}🔧 Starting Backend Server...${NC}"
cd server
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend server in background
echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ Servers started successfully!${NC}"
echo -e "${GREEN}📝 Backend running on: http://localhost:5001${NC}"
echo -e "${GREEN}🌐 Frontend running on: http://localhost:3000${NC}"
echo -e "\n${BLUE}📋 Test Credentials:${NC}"
echo -e "   Email: alex@test.com"
echo -e "   Password: Test123"
echo -e "\n${BLUE}📊 View logs:${NC}"
echo -e "   Backend: tail -f logs/backend.log"
echo -e "   Frontend: tail -f logs/frontend.log"
echo -e "\n${BLUE}🛑 To stop servers:${NC}"
echo -e "   kill $BACKEND_PID $FRONTEND_PID"
echo -e "   Or run: ./stop-dev.sh"
echo -e "\nBackend PID: $BACKEND_PID"
echo -e "Frontend PID: $FRONTEND_PID"

# Save PIDs to file for stop script
echo "$BACKEND_PID" > logs/backend.pid
echo "$FRONTEND_PID" > logs/frontend.pid
