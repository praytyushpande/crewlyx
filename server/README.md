# CrewlyX Server API

Backend API for CrewlyX - A Tinder-style app for finding co-founders and project collaborators.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Profile creation, updates, and account management
- **Swipe System**: Like/pass functionality with automatic match detection
- **Real-time Messaging**: Socket.IO powered chat between matches
- **Match Management**: View and manage your connections
- **Statistics**: User stats, swipe analytics, and match insights

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Install MongoDB Locally

#### macOS (using Homebrew):

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian:

```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows:

Download and install from: https://www.mongodb.com/try/download/community

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Environment Setup

The `.env` file is already configured for local development:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crewlyx
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-crewlyx-2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Important**: Change `JWT_SECRET` before deploying to production!

### 4. Seed Database with Test Users

```bash
npm run seed
```

This will create 10 test users with the following credentials:

- Email: `alex@test.com`, `sarah@test.com`, `michael@test.com`, etc.
- Password: `Test123` (for all test accounts)

## 🎯 Running the Server

### Development Mode (with auto-reload):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register a New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "age": 25,
  "bio": "Software developer looking for a co-founder",
  "skills": ["React", "Node.js", "MongoDB"],
  "location": "San Francisco, CA",
  "interests": ["AI", "SaaS", "Startups"],
  "lookingFor": "co-founder",
  "availability": "full-time"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@test.com",
  "password": "Test123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Test123",
  "newPassword": "NewSecure123"
}
```

### User Endpoints (Protected)

#### Get User Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Updated bio",
  "skills": ["React", "Vue", "Angular"],
  "location": "New York, NY"
}
```

#### Get Users to Swipe

```http
GET /api/users/discover?lookingFor=co-founder&location=San Francisco
Authorization: Bearer <token>
```

#### Get User by ID

```http
GET /api/users/:userId
Authorization: Bearer <token>
```

### Swipe Endpoints (Protected)

#### Swipe on a User

```http
POST /api/swipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetUserId": "507f1f77bcf86cd799439011",
  "action": "like"
}
```

**Response (if match occurs):**

```json
{
  "success": true,
  "message": "Successfully liked user",
  "data": {
    "action": "like",
    "targetUserId": "507f1f77bcf86cd799439011",
    "isMatch": true,
    "match": { ... }
  }
}
```

#### Get Swipe History

```http
GET /api/swipes/history?page=1&limit=20&action=like
Authorization: Bearer <token>
```

#### Get Swipe Statistics

```http
GET /api/swipes/stats
Authorization: Bearer <token>
```

### Match Endpoints (Protected)

#### Get All Matches

```http
GET /api/matches?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Match Details

```http
GET /api/matches/:matchId
Authorization: Bearer <token>
```

#### Unmatch

```http
DELETE /api/matches/:matchId
Authorization: Bearer <token>
```

### Message Endpoints (Protected)

#### Get Messages for a Match

```http
GET /api/messages/:matchId?page=1&limit=50
Authorization: Bearer <token>
```

#### Send a Message

```http
POST /api/messages/:matchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hey! Let's collaborate on a project!"
}
```

#### Delete a Message

```http
DELETE /api/messages/:messageId
Authorization: Bearer <token>
```

#### Get Unread Message Count

```http
GET /api/messages/unread/count
Authorization: Bearer <token>
```

## 🔌 Socket.IO Events

### Client Events to Emit

```javascript
// Join user room for notifications
socket.emit('join-user-room', userId);

// Join match room for real-time chat
socket.emit('join-match-room', matchId);

// Leave match room
socket.emit('leave-match-room', matchId);
```

### Server Events to Listen For

```javascript
// New match notification
socket.on('new-match', (data) => {
  console.log('New match!', data.match, data.matchedUser);
});

// New message in a match
socket.on('new-message', (data) => {
  console.log('New message:', data.message);
});

// Message notification
socket.on('message-notification', (data) => {
  console.log('You have a new message from:', data.sender);
});

// Message deleted
socket.on('message-deleted', (data) => {
  console.log('Message deleted:', data.messageId);
});
```

## 🗄️ Database Schema

### User Model

- name, email, password (hashed)
- age, bio, location
- skills, interests
- lookingFor, availability
- profilePhoto
- swipeActions (embedded)
- statistics (profileViews, totalLikes)

### Match Model

- users (2 user IDs)
- lastMessage reference
- timestamps

### Message Model

- match reference
- sender reference
- content
- read status
- timestamps

## 🧪 Testing with Postman/Thunder Client

1. **Register/Login** to get a JWT token
2. **Copy the token** from the response
3. **Add Authorization header**: `Bearer <your-token>`
4. **Make requests** to protected endpoints

### Example Request Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## 📊 Test Accounts

After running `npm run seed`, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| alex@test.com | Test123 | Full-stack Developer |
| sarah@test.com | Test123 | UI/UX Designer |
| michael@test.com | Test123 | ML Engineer |
| emily@test.com | Test123 | Product Manager |
| david@test.com | Test123 | DevOps Engineer |
| jessica@test.com | Test123 | Mobile Developer |
| ryan@test.com | Test123 | Blockchain Dev |
| olivia@test.com | Test123 | Data Scientist |
| james@test.com | Test123 | Security Specialist |
| sophia@test.com | Test123 | Game Developer |

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: 100 requests per 15 minutes
- **Helmet.js**: Security headers
- **CORS**: Configured for specific origins
- **Input Validation**: Express-validator for all inputs
- **NoSQL Injection Protection**: Mongoose sanitization

## 🚀 Deployment to Cloud

### MongoDB Atlas (Cloud Database)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crewlyx?retryWrites=true&w=majority
   ```

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=<your-atlas-connection-string>
JWT_SECRET=<generate-a-strong-random-secret>
CORS_ORIGIN=https://your-frontend-domain.com
PORT=5000
```

## 📝 Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm run seed` - Seed the database with test data

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions**:

1. Make sure MongoDB is running:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongod
   
   # Check status
   brew services list  # macOS
   sudo systemctl status mongod  # Ubuntu
   ```

2. Verify MongoDB is listening:
   ```bash
   mongo --eval "db.version()"
   ```

### Port Already in Use

**Problem**: Port 5000 is already in use

**Solution**: Change the port in `.env` file:

```env
PORT=5001
```

### JWT Token Errors

**Problem**: "Invalid token" or "Token has expired"

**Solutions**:

1. Make sure you're sending the token in the correct format:
   ```
   Authorization: Bearer <your-token-here>
   ```
2. Get a new token by logging in again

## 📄 License

MIT

## 👥 Support

For issues or questions, please create an issue in the repository.