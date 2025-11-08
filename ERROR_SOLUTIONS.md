# 🔧 CrewlyX Error Solutions

## ✅ Fixed Issues

### 1. Type Mismatch Error
**Error**: `Cannot read property '_id' of undefined`
**Status**: ✅ **FIXED**
**What was done**: 
- Added `_id?: string` to User interface
- Updated SwipeCards to handle both `id` and `_id`
**Action**: Just refresh your browser (Cmd+R or F5)

---

## 🚀 Common Errors & Quick Fixes

### Error: "Failed to fetch" / "Network Error"
```
TypeError: Failed to fetch
```
**Cause**: Backend server not running  
**Fix**:
```bash
cd server
npm run dev
```
**Verify**: You should see "🚀 CrewlyX server running on port 5000"

---

### Error: CORS Policy Error
```
Access to fetch has been blocked by CORS policy
```
**Cause**: Backend not configured for frontend origin  
**Fix**:
1. Check `server/.env` contains:
   ```
   CORS_ORIGIN=http://localhost:3000
   ```
2. Restart backend:
   ```bash
   cd server
   npm run dev
   ```

---

### Error: MongoDB Connection Failed
```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
**Cause**: MongoDB not running  
**Fix**:
```bash
# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh --eval "db.version()"
```

---

### Error: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Cause**: Another process using the port  
**Fix**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or port 5000
lsof -ti:5000 | xargs kill -9

# Then restart
npm run dev
```

---

### Error: Cannot Find Module
```
Error: Cannot find module 'express'
```
**Cause**: Dependencies not installed  
**Fix**:
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

---

### Error: Invalid Email or Password
```
{
  "success": false,
  "message": "Invalid email or password"
}
```
**Cause**: Wrong credentials or database not seeded  
**Fix**:
```bash
cd server
npm run seed

# Then try login with:
# Email: alex@test.com
# Password: Test123
```

---

### Error: JWT Token Invalid
```
{
  "success": false,
  "message": "Invalid token"
}
```
**Cause**: Token expired or malformed  
**Fix**: Logout and login again to get fresh token

---

### Error: React Hooks Error
```
Error: Invalid hook call
```
**Cause**: Multiple React versions or improper hook usage  
**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 Debugging Steps

### Step 1: Check Services
```bash
# Run diagnostic
./check-errors.sh
```

### Step 2: Check Browser Console
1. Open browser (Chrome/Firefox)
2. Press F12 or Cmd+Option+I
3. Go to Console tab
4. Look for red errors

### Step 3: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for failed requests (red)
5. Click on failed request
6. Check Response tab

### Step 4: Check Backend Logs
Look at the terminal where backend is running for error messages

### Step 5: Check Database
```bash
# Connect to MongoDB
mongosh

# Switch to database
use crewlyx

# Check users exist
db.users.countDocuments()

# Should return 10
```

---

## 📋 Quick Diagnostic Checklist

Run through this checklist:

- [ ] MongoDB running: `mongosh --eval "db.version()"`
- [ ] Backend running: Check port 5000 → http://localhost:5000/api/health
- [ ] Frontend running: Check port 3000 → http://localhost:3000
- [ ] Dependencies installed: `node_modules` folders exist
- [ ] Database seeded: 10 users exist
- [ ] No port conflicts: Kill other processes
- [ ] Latest code: Types include _id field

---

## 🆘 Still Having Issues?

If none of the above work:

1. **Share the exact error message** from:
   - Browser console
   - Terminal output
   
2. **Tell me what you see** when you:
   - Visit http://localhost:3000
   - Try to login
   - Check browser network tab

3. **Run this** and share output:
   ```bash
   ./check-errors.sh
   ```

---

## ✅ Verification Steps

After fixing, verify everything works:

1. **Backend Health**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"OK",...}`

2. **Login Test**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alex@test.com","password":"Test123"}'
   ```
   Should return user object and token

3. **Frontend Test**:
   - Visit http://localhost:3000
   - Should see landing page
   - Click Login
   - Should see login form
   - Fill test credentials
   - Should redirect to /swipe

---

**Last Updated**: Just now
**Status**: Type errors fixed, diagnostic tool created

