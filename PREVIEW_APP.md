# 🎬 Preview CrewlyX App - Step by Step

## Current Status

✅ Frontend dependencies: **Installed**
❌ Backend dependencies: **Not installed**
❌ MongoDB: **Not installed**

---

## 🚀 Option 1: Full Preview (With Backend - Recommended)

This gives you the complete experience with login, database, and all features.

### Steps:

#### 1️⃣ Install MongoDB (One-time setup)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh --eval "db.version()" || mongo --eval "db.version()"
```

#### 2️⃣ Install Backend Dependencies & Seed Database

```bash
cd server
npm install
npm run seed
cd ..
```

Expected output from seed:
```
✅ Connected to MongoDB
✅ Created user: Alex Johnson (alex@test.com)
✅ Created user: Sarah Chen (sarah@test.com)
... (10 users total)
✅ Database seeding completed successfully\!
```

#### 3️⃣ Start Backend Server (Terminal 1)

```bash
cd server
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
🚀 CrewlyX server running on port 5000
```

**Keep this terminal running\!**

#### 4️⃣ Start Frontend (Terminal 2 - New Terminal)

```bash
npm run dev
```

Expected output:
```
VITE v4.4.5  ready in 500 ms
➜  Local:   http://localhost:3000/
```

#### 5️⃣ Open & Test App

1. Open: **http://localhost:3000**
2. Click **"Login"** button
3. Click **"Fill Test Account"** button
4. Click **"Login"**
5. ✅ You'll see the swipe interface with real users\!

**Test Login Credentials:**
- Email: alex@test.com
- Password: Test123

---

## 🎨 Option 2: Quick UI Preview (Frontend Only)

If you just want to see the UI without setting up MongoDB:

### Steps:

#### 1️⃣ Start Frontend

```bash
npm run dev
```

#### 2️⃣ Open Browser

Go to: **http://localhost:3000**

**What you'll see:**
- ✅ Beautiful landing page
- ✅ Navigation between pages
- ✅ UI components and animations
- ⚠️ Login will fail (no backend)

**Note:** This mode is just for UI preview. To test actual functionality, use Option 1.

---

## 📝 What You Can Test

### With Full Setup (Option 1):

✅ **Authentication**
- Login with test accounts
- JWT token authentication
- Logout functionality

✅ **User Discovery**
- Browse 10 pre-seeded users
- View detailed profiles
- Filter by preferences

✅ **Swipe System**
- Swipe right to like
- Swipe left to pass
- Automatic match detection

✅ **Profile Management**
- View your profile
- Edit bio, skills, location
- See stats (views, likes, matches)

✅ **Matches**
- View all matches
- See match history
- Unmatch functionality

✅ **Real-time Features**
- Match notifications
- Message sending (basic)

### With UI Preview Only (Option 2):

✅ Landing page design
✅ Navigation flow
✅ Component animations
✅ Responsive design
❌ Login/authentication
❌ Data persistence
❌ Real functionality

---

## 🐛 Troubleshooting

### Issue: MongoDB won't start

**macOS:**
```bash
brew services restart mongodb-community
```

**Check if it's running:**
```bash
brew services list | grep mongodb
```

### Issue: Port 5000 already in use

**Solution 1 - Kill the process:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Solution 2 - Change port:**
Edit `server/.env`:
```env
PORT=5001
```

Then edit `src/services/api.ts`:
```typescript
const API_URL = 'http://localhost:5001/api';
```

### Issue: Backend won't start

**Make sure dependencies are installed:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot find module"

**Reinstall all dependencies:**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

## 🎯 Quick Command Summary

**Full Setup (Copy & Paste):**

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community

# Setup backend
cd server && npm install && npm run seed && cd ..

# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend (run in new terminal)
npm run dev

# Open: http://localhost:3000
# Login: alex@test.com / Test123
```

**UI Preview Only:**

```bash
npm run dev
# Open: http://localhost:3000
```

---

## ✨ Demo Flow

Once everything is running:

1. **Landing Page** → Click "Login"
2. **Login Page** → Click "Fill Test Account" → Login
3. **Discover Page** → Swipe on users
4. **Get Matches** → When both users like each other
5. **Matches Page** → View all your matches
6. **Profile Page** → Edit your profile
7. **Logout** → Test logging in with different accounts

---

## 📸 What You Should See

### Landing Page
- Modern gradient background
- Animated floating particles
- "Find Your Perfect Team" headline
- CTA buttons (Get Started, Login)

### Login Page
- Clean login form
- Test account helper
- Error messages (if wrong credentials)
- Loading state during authentication

### Discover/Swipe Page
- Card-based interface
- User profiles with photos
- Skills tags
- Swipe buttons (❤️ and ✖️)
- Smooth animations

### Matches Page
- Grid of matched users
- Last message preview
- Click to chat

### Profile Page
- User info and stats
- Edit profile button
- Skills and interests
- Logout button

---

## 🎉 Success Criteria

Everything is working if:

- ✅ Backend shows: "Connected to MongoDB"
- ✅ Frontend opens at localhost:3000
- ✅ Can login with alex@test.com
- ✅ See 9 other users to swipe
- ✅ Swipes are saved to database
- ✅ Can logout and login again
- ✅ No errors in browser console

---

**Ready to preview? Run the commands above\!** 🚀

