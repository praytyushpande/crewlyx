# 🚀 CrewlyX - Quick Start Guide

Welcome to CrewlyX! This guide will get you up and running in 5 minutes.

## ✅ Prerequisites Check

Run these commands to verify you have everything installed:

```bash
node --version    # Should be v14 or higher
npm --version     # Should be v6 or higher  
mongod --version  # Should be v4.4 or higher
```

If any are missing, install them first (see main README.md).

---

## 🎯 Three Ways to Start

### Option 1: Automated Script (Easiest) ⭐

```bash
# Make scripts executable (first time only)
chmod +x start-dev.sh stop-dev.sh

# Start everything
./start-dev.sh

# When done, stop everything
./stop-dev.sh
```

### Option 2: Manual Start

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend  
npm run dev
```

### Option 3: Test Backend First

```bash
# Start backend
cd server
npm run dev

# Open test page in browser
open test-login.html
# or visit: http://localhost:5001/test-login.html
```

---

## 📝 First Time Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Start MongoDB

**macOS:**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

**Windows:**

```powershell
net start MongoDB
```

### 3. Setup Environment

Backend `.env` file is already configured for local development in `server/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/crewlyx
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-crewlyx-2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Seed Database

```bash
cd server
npm run seed
```

This creates 10 test users. All use password: `Test123`

---

## 🧪 Verify Everything Works

### Test 1: Backend Health Check

```bash
curl http://localhost:5001/api/health
```

**Expected output:**

```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": 123.456,
  "environment": "development"
}
```

### Test 2: Test Login

Open `test-login.html` in your browser and click "Test Login"

**Or use curl:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@test.com","password":"Test123"}'
```

### Test 3: Open Application

Visit http://localhost:3000 in your browser.

You should see the CrewlyX landing page.

---

## 🎮 Test Credentials

| Email | Password | Role |
|-------|----------|------|
| alex@test.com | Test123 | Full-stack Developer |
| sarah@test.com | Test123 | UI/UX Designer |
| michael@test.com | Test123 | ML Engineer |
| emily@test.com | Test123 | Product Manager |
| david@test.com | Test123 | DevOps Engineer |

**All test accounts use password:** `Test123`

---

## 🔍 Common Issues & Quick Fixes

### "Failed to fetch" Error

**Problem:** Backend not running

**Fix:**

```bash
cd server
npm run dev
```

### "Port already in use"

**Problem:** Old process still running

**Fix:**

```bash
# Kill processes on ports
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Or use the stop script
./stop-dev.sh
```

### "No users to swipe"

**Problem:** Database not seeded

**Fix:**

```bash
cd server
npm run seed
```

### MongoDB not connecting

**Problem:** MongoDB not running

**Fix:**

```bash
# macOS
brew services start mongodb-community

# Linux  
sudo systemctl start mongod
```

---

## 📂 Project Structure

```
crewlyx/
├── src/                    # Frontend React app
│   ├── components/        # React components
│   ├── services/         # API services
│   └── types/            # TypeScript types
│
├── server/                # Backend Node/Express
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   └── scripts/          # Database scripts
│
├── start-dev.sh          # Start both servers
├── stop-dev.sh           # Stop both servers  
├── test-login.html       # Backend testing page
└── TROUBLESHOOTING.md    # Detailed troubleshooting
```

---

## 🎯 What to Do After Starting

### 1. Test Login

- Go to http://localhost:3000
- Click "Login"
- Use: alex@test.com / Test123
- You should be logged in!

### 2. Browse Profiles

- After login, you'll see the swipe interface
- Swipe right to like, left to pass
- Try swiping on a few profiles

### 3. Check Matches

- Click the heart icon in navigation
- You should see pre-existing matches for Alex

### 4. Create New Account

- Click "Sign Up" from landing page
- Fill out the multi-step form
- Password must have: uppercase, lowercase, and number
- Example: `MyPass123`

---

## 📊 Monitoring & Logs

### View Backend Logs

```bash
# If using start-dev.sh
tail -f logs/backend.log

# If running manually
# Logs show in terminal where you ran npm run dev
```

### View Frontend Logs

```bash
# If using start-dev.sh
tail -f logs/frontend.log

# Browser console (F12 or Cmd+Opt+I)
# Check Console tab for errors
```

### Check Database

```bash
mongosh crewlyx
db.users.countDocuments()     # Should show 10
db.matches.countDocuments()   # Should show 3
db.users.find().pretty()      # View all users
```

---

## 🛠️ Development Tips

### Hot Reload

Both frontend and backend support hot reload:

- **Frontend:** Edit files in `src/` - browser auto-refreshes
- **Backend:** Edit files in `server/` - nodemon auto-restarts

### API Testing

- Use `test-login.html` for quick API tests
- Or use Postman/Insomnia with base URL: `http://localhost:5001/api`

### Database Reset

```bash
# Clear everything and start fresh
mongosh crewlyx --eval "db.dropDatabase()"
cd server && npm run seed
```

---

## 📖 Additional Resources

- **Full Documentation:** README.md
- **API Reference:** server/README.md
- **Troubleshooting:** TROUBLESHOOTING.md
- **Testing Guide:** TESTING_GUIDE.md

---

## ✨ Quick Commands Reference

```bash
# Start servers
./start-dev.sh

# Stop servers
./stop-dev.sh

# Reset database
cd server && npm run seed

# View backend logs
tail -f server/server.log

# View what's running
lsof -i :5001  # Backend
lsof -i :3000  # Frontend
lsof -i :27017 # MongoDB

# Kill specific port
lsof -ti:5001 | xargs kill -9
```

---

## 🐛 Still Having Issues?

1. Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions
2. Check [GitHub Issues](https://github.com/praytyushpande/crewlyx/issues)
3. Make sure all prerequisites are installed
4. Try the "Reset Everything" section in TROUBLESHOOTING.md

---

## 🎉 You're Ready!

Once both servers are running and you can login:

**You're all set!** Start swiping and building your team! 🚀

---

**Made with ❤️ by the CrewlyX team**

**Questions?** Open an issue on GitHub or check the documentation.
