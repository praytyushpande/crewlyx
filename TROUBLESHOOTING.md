# 🔧 CrewlyX Troubleshooting Guide

This guide will help you resolve common issues when running CrewlyX.

## Quick Start

### Starting the Application

```bash
# Easy way - start both servers with one command
./start-dev.sh

# Manual way - Terminal 1 (Backend)
cd server
npm run dev

# Manual way - Terminal 2 (Frontend)
npm run dev
```

### Stopping the Application

```bash
./stop-dev.sh
```

---

## Common Issues

### Issue 1: "Failed to fetch" on Login Page

**Symptoms:**

- Red error message saying "Failed to fetch" appears when trying to log in
- Cannot login even with correct credentials

**Cause:** Backend server is not running

**Solution:**

```bash
# Check if backend is running
lsof -i :5001

# If nothing shows up, start the backend
cd server
npm run dev
```

**Verify it's working:**

```bash
curl http://localhost:5001/api/health
# Should return: {"status":"OK",...}
```

---

### Issue 2: "Complete Profile" Button Not Working

**Symptoms:**

- Profile setup form doesn't submit
- No error messages or loading state

**Cause:** This was fixed in the latest update. Make sure you have the latest code.

**Solution:**

```bash
# Pull latest changes
git pull origin main

# Restart frontend
npm run dev
```

---

### Issue 3: No Users to Swipe On

**Symptoms:**

- Login works but shows "No More Profiles" message immediately
- Database is empty

**Cause:** Database hasn't been seeded with test users

**Solution:**

```bash
# Seed the database with 10 test users
cd server
npm run seed
```

**Verify:**
All test users use password: `Test123`

- alex@test.com
- sarah@test.com
- michael@test.com
- emily@test.com
- david@test.com
- jessica@test.com
- ryan@test.com
- olivia@test.com
- james@test.com
- sophia@test.com

---

### Issue 4: MongoDB Connection Error

**Symptoms:**

- Backend logs show: "MongoDB connection error"
- Server crashes on startup

**Cause:** MongoDB is not running

**Solution:**

**macOS:**

```bash
# Start MongoDB
brew services start mongodb-community

# Check if running
brew services list | grep mongodb
```

**Ubuntu/Linux:**

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**Windows:**

```powershell
# Start MongoDB service
net start MongoDB
```

---

### Issue 5: Port Already in Use

**Symptoms:**

- Error: "Port 3000 is already in use" or "Port 5001 is already in use"

**Cause:** Another process is using the port

**Solution:**

```bash
# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Or use the stop script
./stop-dev.sh
```

---

### Issue 6: CORS Errors in Browser Console

**Symptoms:**

- Browser console shows CORS policy errors
- API calls fail with CORS error

**Cause:** Frontend and backend CORS mismatch

**Solution:**

1. Check `server/.env` file:

```env
CORS_ORIGIN=http://localhost:3000
```

2. Make sure frontend is running on port 3000:

```bash
# Check vite.config.ts
server: {
  port: 3000,
  open: true
}
```

3. Restart both servers after making changes

---

### Issue 7: Cannot Create New Account

**Symptoms:**

- Password validation errors
- Registration fails

**Cause:** Password requirements not met

**Solution:**
Password must:

- Be at least 6 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number

**Example valid passwords:**

- `Test123`
- `MyPass456`
- `SecureP@ss1`

---

### Issue 8: Matches Not Showing Up

**Symptoms:**

- Swiped right on someone but no match notification
- Matches page is empty

**Cause:** Need mutual likes for a match

**Solution:**
Test with seeded users that have pre-existing matches:

```bash
# Login as Alex
Email: alex@test.com
Password: Test123

# Alex has pre-existing matches with Sarah and Emily
# Check the Matches page (heart icon in navigation)
```

---

### Issue 9: "Invalid token" or "Not authorized"

**Symptoms:**

- Logged in but getting authorization errors
- Redirected back to login unexpectedly

**Cause:** Token expired or corrupted

**Solution:**

```javascript
// Clear browser storage and login again
// Open browser console and run:
localStorage.clear()
// Then refresh the page and login again
```

---

### Issue 10: Swipe Animation Not Working

**Symptoms:**

- Cards not moving when dragging
- No visual feedback on swipe

**Cause:** React Spring/Gesture library issue

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear cache and restart
npm run dev
```

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/crewlyx
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-crewlyx-2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend

No environment variables needed for local development. API is configured to use
`http://localhost:5001/api` in `src/services/api.ts`.

---

## Logs and Debugging

### View Backend Logs

```bash
# If using start-dev.sh
tail -f logs/backend.log

# If running manually
# Logs will show in the terminal where you ran `npm run dev`
```

### View Frontend Logs

```bash
# If using start-dev.sh
tail -f logs/frontend.log

# If running manually
# Logs will show in the terminal where you ran `npm run dev`
```

### Browser Console

Open browser developer tools (F12 or Cmd+Opt+I on Mac) and check:

- **Console tab**: For JavaScript errors
- **Network tab**: For API call failures
- **Application/Storage tab**: To check localStorage for token

---

## Health Checks

### Backend Health Check

```bash
curl http://localhost:5001/api/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2025-01-15T...",
#   "uptime": 123.456,
#   "environment": "development"
# }
```

### Frontend Health Check

Open http://localhost:3000 in your browser. You should see the CrewlyX landing page.

### MongoDB Health Check

```bash
# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use CrewlyX database
use crewlyx

# Count users
db.users.countDocuments()
# Should return 10 if database is seeded
```

---

## Reset Everything

If all else fails, here's how to completely reset:

```bash
# 1. Stop all servers
./stop-dev.sh

# 2. Clear MongoDB database
mongosh crewlyx --eval "db.dropDatabase()"

# 3. Reinstall dependencies
rm -rf node_modules server/node_modules
rm package-lock.json server/package-lock.json
npm install
cd server && npm install && cd ..

# 4. Reseed database
cd server && npm run seed && cd ..

# 5. Start servers
./start-dev.sh
```

---

## Getting Help

If you're still experiencing issues:

1. **Check the logs** - Most errors will show up in server or browser console
2. **Search existing issues** - https://github.com/praytyushpande/crewlyx/issues
3. **Create a new issue** - Include:
    - Error message
    - Steps to reproduce
    - Your environment (OS, Node version, MongoDB version)
    - Logs from backend/frontend

### Useful Commands for Bug Reports

```bash
# System info
node --version
npm --version
mongod --version

# Check what's running
lsof -i :3000
lsof -i :5001
lsof -i :27017

# Git info
git log --oneline -5
git status
```

---

## Quick Reference

### Test Credentials

- **Email:** alex@test.com
- **Password:** Test123

### Ports

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5001
- **MongoDB:** localhost:27017

### Important Files

- Backend config: `server/.env`
- Frontend API: `src/services/api.ts`
- Database models: `server/models/`

---

**Last Updated:** 2025-01-15
