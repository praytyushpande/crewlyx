#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping CrewlyX Development Servers...${NC}\n"

# Read PIDs from file
if [ -f logs/backend.pid ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Stopping Backend Server (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
    fi
    rm logs/backend.pid
fi

if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${RED}Stopping Frontend Server (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID
    fi
    rm logs/frontend.pid
fi

# Also kill any lingering node processes on ports 3000 and 5001
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null

echo -e "\n${BLUE}✅ Servers stopped successfully!${NC}"
