# Quick Start Guide - CrewlyX

Get up and running with CrewlyX in 5 minutes!

## ⚡ Fastest Setup (Using Setup Script)

```bash
# Make setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

The script will:

- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Check MongoDB connection
- ✅ Seed the database with test users

---

## 🔧 Manual Setup

### Step 1: Install MongoDB

#### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Linux

```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows

Download and install from: https://www.mongodb.com/try/download/community

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Step 3: Seed Database

```bash
# From the server directory
npm run seed
```

This creates 10 test users. All passwords are `Test123`

### Step 4: Start the Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
# From project root
npm run dev
```

Frontend runs on `http://localhost:3000`

### Step 5: Login

Open `http://localhost:3000` in your browser and login with:

- **Email**: `alex@test.com`
- **Password**: `Test123`

---

## 📱 What You Can Do

### 1. **Explore Profiles**

Swipe through 10 pre-created user profiles:

- Alex Johnson - Full-stack Developer
- Sarah Chen - UI/UX Designer
- Michael Davis - ML Engineer
- Emily Rodriguez - Product Manager
- And 6 more!

### 2. **Swipe System**

- ❤️ Swipe right (or click ❤️) to like
- ✖️ Swipe left (or click ✖️) to pass
- 🔥 Get instant match notifications

### 3. **View Matches**

Some users already have pre-created matches:

- Alex & Sarah
- Alex & Emily
- Michael & Jessica

### 4. **Send Messages**

Click on a match to start chatting!

### 5. **Update Your Profile**

- Add/edit skills
- Update bio and location
- Change availability
- Set collaboration preferences

---

## 🧪 Testing the API

### Using curl

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@test.com","password":"Test123"}'
```

**Get User Profile:**

```bash
# Replace <TOKEN> with the token from login response
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <TOKEN>"
```

**Swipe on a User:**

```bash
curl -X POST http://localhost:5000/api/swipes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"USER_ID_HERE","action":"like"}'
```

### Using Postman/Thunder Client

1. **Import the collection** (if you have one)
2. **Set Authorization**: Bearer Token
3. **Test endpoints** from [server/README.md](server/README.md)

---

## 🎯 Common Use Cases

### Create a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your@email.com",
    "password": "YourPass123",
    "age": 25,
    "bio": "Developer looking for co-founder",
    "skills": ["React", "Node.js"],
    "location": "San Francisco, CA",
    "lookingFor": "co-founder",
    "availability": "full-time"
  }'
```

### Get Users to Swipe

```bash
curl http://localhost:5000/api/users/discover \
  -H "Authorization: Bearer <TOKEN>"
```

### Get Your Matches

```bash
curl http://localhost:5000/api/matches \
  -H "Authorization: Bearer <TOKEN>"
```

### Send a Message

```bash
curl -X POST http://localhost:5000/api/messages/MATCH_ID \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hey! Lets collaborate!"}'
```

---

## 🐛 Troubleshooting

### MongoDB Won't Start

```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# If not, start it:
# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

### Port 5000 Already in Use

Edit `server/.env`:

```env
PORT=5001
```

### "Cannot find module" Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

cd server
rm -rf node_modules package-lock.json
npm install
```

### Database Not Seeded

```bash
cd server
npm run seed
```

---

## 🚀 Next Steps

1. **Explore the Code**
    - Frontend: `src/components/`
    - Backend: `server/routes/`
    - Database Models: `server/models/`

2. **Customize**
    - Add new skills in `src/utils/mockData.ts`
    - Modify colors in `tailwind.config.js`
    - Update API endpoints in `server/routes/`

3. **Deploy**
    - Use MongoDB Atlas for cloud database
    - Deploy backend to Heroku/Railway/Render
    - Deploy frontend to Vercel/Netlify

4. **Enhance**
    - Add more profile fields
    - Implement video calls
    - Add project boards
    - Create team formation tools

---

## 📚 Resources

- **Main README**: [README.md](README.md)
- **API Documentation**: [server/README.md](server/README.md)
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com

---

## 💡 Tips

- **Use multiple test accounts** to see the full matching experience
- **Open two browser windows** to test real-time features
- **Check the browser console** for real-time Socket.IO events
- **Use MongoDB Compass** to view/edit database directly
- **Check server logs** for API request details

---

## 🎉 You're All Set!

Start building amazing teams with CrewlyX!

**Questions?** Check the full [README.md](README.md) or [server/README.md](server/README.md)