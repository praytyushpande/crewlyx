# Testing Guide - CrewlyX

Complete guide to test all features of CrewlyX.

## 🚀 Prerequisites

Make sure you have:

- ✅ MongoDB running
- ✅ Backend server running (`cd server && npm run dev`)
- ✅ Frontend running (`npm run dev`)
- ✅ Database seeded (`cd server && npm run seed`)

## 📝 Testing Checklist

### 1. Authentication System ✅

#### Test Registration

1. Go to landing page
2. Click "Get Started"
3. Fill in registration form:
    - Name: Your Name
    - Email: test@example.com
    - Password: Test123ABC (must have upper, lower, number)
    - Age: 25+
4. Complete profile setup steps
5. ✅ Should redirect to Discover page

#### Test Login

1. Go to landing page
2. Use test credentials:
    - Email: `alex@test.com`
    - Password: `Test123`
3. ✅ Should see Discover page with swipeable cards

#### Test Logout

1. Click on Profile tab
2. Click Logout button
3. ✅ Should redirect to landing page

#### Test Invalid Login

1. Try login with wrong password
2. ✅ Should show error message

### 2. Swipe System ✅

#### Test Swipe Right (Like)

1. Login as `alex@test.com`
2. Go to Discover tab
3. Swipe right or click ❤️ button
4. ✅ Card should animate out to the right
5. ✅ If mutual like, should see match notification

#### Test Swipe Left (Pass)

1. Go to Discover tab
2. Swipe left or click ✖️ button
3. ✅ Card should animate out to the left
4. ✅ Next card should appear

#### Test Match Creation

1. Login as `alex@test.com`
2. Swipe right on a user
3. Login as that user in another browser
4. Swipe right on Alex
5. ✅ Both should see match notification

### 3. Profile Management ✅

#### View Profile

1. Click Profile tab
2. ✅ Should see your profile with:
    - Name, age, location
    - Bio
    - Skills (as tags)
    - Interests
    - Stats (views, matches, likes)

#### Edit Profile

1. Click Edit Profile button
2. Update:
    - Bio
    - Skills (add/remove)
    - Location
    - Availability
3. Save changes
4. ✅ Changes should persist after refresh

### 4. Matches & Messaging ✅

#### View Matches

1. Go to Matches tab
2. ✅ Should see list of matched users
3. ✅ Should show last message preview

#### Send Message

1. Click on a match
2. Type a message
3. Send
4. ✅ Message should appear in chat

#### Test Real-time Messaging

1. Open two browsers with different accounts
2. Make them match each other
3. Send message from one
4. ✅ Message should appear in other browser instantly

### 5. User Discovery ✅

#### View Swipeable Users

1. Go to Discover tab
2. ✅ Should see cards with:
    - Profile photo
    - Name, age, location
    - Bio
    - Skills
    - Looking for
    - Availability

#### Test Empty State

1. Swipe through all available users
2. ✅ Should show "No more users" message
3. ✅ Should suggest checking back later

## 🧪 API Testing

### Using curl

#### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "newuser@test.com",
    "password": "Test123",
    "age": 25,
    "bio": "Test bio",
    "skills": ["JavaScript", "React"],
    "location": "San Francisco, CA",
    "lookingFor": "co-founder",
    "availability": "full-time"
  }'
```

Expected Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@test.com",
    "password": "Test123"
  }'
```

**Save the token from response!**

#### 3. Get Current User

```bash
TOKEN="your-token-here"

curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Get Users to Swipe

```bash
curl http://localhost:5000/api/users/discover \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Swipe on User

```bash
# Replace USER_ID with actual user ID from discover
curl -X POST http://localhost:5000/api/swipes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "USER_ID",
    "action": "like"
  }'
```

#### 6. Get Matches

```bash
curl http://localhost:5000/api/matches \
  -H "Authorization: Bearer $TOKEN"
```

#### 7. Send Message

```bash
# Replace MATCH_ID with actual match ID
curl -X POST http://localhost:5000/api/messages/MATCH_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello! Let'\''s collaborate!"
  }'
```

## 🔍 Testing Edge Cases

### Authentication Edge Cases

#### Weak Password

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak","name":"Test","age":25}'
```

✅ Should return: Password must contain uppercase, lowercase, and number

#### Duplicate Email

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@test.com","password":"Test123","name":"Test","age":25}'
```

✅ Should return: User with this email already exists

#### Invalid Token

```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer invalid-token"
```

✅ Should return: Invalid token (401)

#### Expired Token

```bash
# Wait 7 days or modify JWT_EXPIRES_IN in .env
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer expired-token"
```

✅ Should return: Token has expired (401)

### Swipe Edge Cases

#### Swipe on Self

```bash
curl -X POST http://localhost:5000/api/swipes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"YOUR_OWN_USER_ID","action":"like"}'
```

✅ Should return: Cannot swipe on yourself

#### Duplicate Swipe

```bash
# Swipe on same user twice
curl -X POST http://localhost:5000/api/swipes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"USER_ID","action":"like"}'
```

✅ Should return: You have already swiped on this user

## 📊 Testing Statistics

### Swipe Stats

```bash
curl http://localhost:5000/api/swipes/stats \
  -H "Authorization: Bearer $TOKEN"
```

Expected Response:

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalSwipes": 10,
      "likes": 7,
      "passes": 3,
      "matchesCount": 2,
      "totalLikes": 5,
      "profileViews": 15,
      "likeRatio": "70.0",
      "matchRatio": "28.6"
    }
  }
}
```

## 🔄 Testing Real-time Features

### Setup

1. Open browser window 1: Login as `alex@test.com`
2. Open browser window 2: Login as `sarah@test.com`
3. Open browser console (F12) in both windows

### Test Match Notification

1. In window 1 (Alex): Swipe right on Sarah
2. In window 2 (Sarah): Swipe right on Alex
3. ✅ Both should receive instant match notification
4. ✅ Check console for Socket.IO event: `new-match`

### Test Real-time Messaging

1. In window 1: Go to Matches, click on Sarah
2. In window 2: Go to Matches, click on Alex
3. Send message from window 1
4. ✅ Message should appear in window 2 instantly
5. ✅ Check console for Socket.IO event: `new-message`

## 🧰 Testing Tools

### Postman Collection

Create a Postman collection with these endpoints:

**1. Auth Folder**

- POST Register
- POST Login
- GET Me
- POST Logout
- POST Change Password

**2. Users Folder**

- GET Profile
- PUT Update Profile
- GET Discover
- GET User by ID

**3. Swipes Folder**

- POST Swipe
- GET History
- GET Stats

**4. Matches Folder**

- GET All Matches
- GET Match Details
- DELETE Unmatch

**5. Messages Folder**

- GET Messages
- POST Send Message
- DELETE Delete Message
- GET Unread Count

### MongoDB Compass

1. Install MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. View database: `crewlyx`
4. Inspect collections:
    - users
    - matches
    - messages

## ✅ Complete Test Scenarios

### Scenario 1: New User Journey

1. Register new account ✅
2. Complete profile setup ✅
3. View discover page ✅
4. Swipe on 3 users (2 likes, 1 pass) ✅
5. Check swipe stats ✅
6. Update profile ✅

### Scenario 2: Matching Journey

1. Login as User A ✅
2. Like User B ✅
3. Login as User B ✅
4. Like User A ✅
5. Both see match notification ✅
6. Go to Matches ✅
7. Start conversation ✅

### Scenario 3: Complete Workflow

1. Register ✅
2. Setup profile ✅
3. Swipe on users ✅
4. Get matches ✅
5. Send messages ✅
6. View stats ✅
7. Update profile ✅
8. Logout ✅

## 🐛 Common Issues

### Issue: No users appear in Discover

**Solution**: Run `cd server && npm run seed`

### Issue: Match not created

**Solution**: Ensure both users liked each other

### Issue: Message not sending

**Solution**: Check if you're in a match conversation

### Issue: Real-time not working

**Solution**: Check Socket.IO connection in browser console

### Issue: 401 Unauthorized

**Solution**: Get a fresh token by logging in again

## 📈 Performance Testing

### Load Test Users

```bash
# Create 100 test users
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"User$i\",\"email\":\"user$i@test.com\",\"password\":\"Test123\",\"age\":25}" &
done
```

### Stress Test Swipes

```bash
# Rapid swipe testing (requires valid TOKEN and USER_IDs)
for id in {1..50}; do
  curl -X POST http://localhost:5000/api/swipes \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"targetUserId\":\"$id\",\"action\":\"like\"}" &
done
```

## ✨ Success Criteria

All tests pass if:

- ✅ Users can register and login
- ✅ JWT tokens are properly validated
- ✅ Users can swipe and create matches
- ✅ Real-time notifications work
- ✅ Messages are sent and received instantly
- ✅ Profile updates persist
- ✅ Statistics are accurate
- ✅ Error messages are clear
- ✅ No memory leaks
- ✅ Database operations are fast

## 🎯 Next Steps

After successful testing:

1. Fix any bugs found
2. Add more test users
3. Test with real network latency
4. Prepare for deployment
5. Set up monitoring
6. Configure production environment

---

**Happy Testing! 🚀**