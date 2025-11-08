# 🔐 Test Login Functionality

## ✅ What's Been Done

1. ✅ **Backend API Created** - Complete authentication system
2. ✅ **API Service** - `src/services/api.ts` connects frontend to backend
3. ✅ **Login Component** - Beautiful login page at `/login`
4. ✅ **App Integration** - Frontend now uses real backend instead of localStorage

## 🚀 How to Test Login

### Step 1: Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

Should see:
```
🚀 CrewlyX server running on port 5000
✅ Connected to MongoDB
```

### Step 2: Start Frontend (Terminal 2)
```bash
# From project root
npm run dev
```

Should see:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 3: Test Login

Open http://localhost:3000

#### Option A: Use Test Account Button
1. Go to http://localhost:3000/login
2. Click "Fill Test Account" button
3. Click "Login"
4. ✅ You should be redirected to /swipe page

#### Option B: Manual Login
1. Go to http://localhost:3000/login
2. Enter:
   - Email: alex@test.com
   - Password: Test123
3. Click "Login"
4. ✅ You should see the swipe page with real users from database

### Step 4: Verify It's Working

✅ **Check Browser Console** (F12):
   - Should NOT see any 401 or 500 errors
   - Network tab should show successful API calls

✅ **Check Backend Terminal**:
   - Should see log messages like:
   ```
   POST /api/auth/login 200
   GET /api/auth/me 200
   GET /api/users/discover 200
   ```

✅ **Test Features**:
   - Swipe on users
   - View matches
   - Update profile
   - Logout and login again

## 🧪 Test All Accounts

All passwords are: **Test123**

| Email | Name | Role |
|-------|------|------|
| alex@test.com | Alex Johnson | Full-stack Developer |
| sarah@test.com | Sarah Chen | UI/UX Designer |
| michael@test.com | Michael Davis | ML Engineer |
| emily@test.com | Emily Rodriguez | Product Manager |
| david@test.com | David Kim | DevOps Engineer |
| jessica@test.com | Jessica Taylor | Mobile Developer |
| ryan@test.com | Ryan Martinez | Blockchain Developer |
| olivia@test.com | Olivia Brown | Data Scientist |
| james@test.com | James Wilson | Security Specialist |
| sophia@test.com | Sophia Anderson | Game Developer |

## 🐛 Troubleshooting

### Problem: "Failed to fetch" or Network Error

**Solution 1**: Make sure backend is running
```bash
cd server
npm run dev
```

**Solution 2**: Check if MongoDB is running
```bash
mongo --eval "db.version()"
# If not, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**Solution 3**: Seed the database
```bash
cd server
npm run seed
```

### Problem: "Invalid email or password"

**Solution**: Make sure database is seeded:
```bash
cd server
npm run seed
```

### Problem: CORS Error

**Solution**: Backend should already have CORS configured. If you see CORS errors:
1. Check `server/.env` has: `CORS_ORIGIN=http://localhost:3000`
2. Restart backend server

### Problem: Port 5000 already in use

**Solution**: Change port in `server/.env`:
```env
PORT=5001
```

Then update `src/services/api.ts`:
```typescript
const API_URL = 'http://localhost:5001/api';
```

## ✅ Success Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB running
- [ ] Database seeded with test users
- [ ] Can login with alex@test.com / Test123
- [ ] Redirected to /swipe after login
- [ ] Can see users to swipe
- [ ] Backend logs show API calls
- [ ] No errors in browser console

## 🎉 Once Working

You can:
1. ✅ Login with any test account
2. ✅ Swipe on users (data saved to MongoDB\!)
3. ✅ View matches
4. ✅ Send messages (will be implemented)
5. ✅ Update profile
6. ✅ Logout and login again

## 📝 What's Next?

The login is working with:
- JWT authentication
- Real MongoDB database
- Secure password hashing
- Token-based sessions

All backend endpoints are ready:
- ✅ Authentication (login, register, logout)
- ✅ User management (profile, discover)
- ✅ Swipes (like, pass, stats)
- ✅ Matches (list, details, unmatch)
- ✅ Messages (send, receive, delete)

