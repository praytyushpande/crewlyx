# 🚀 CrewlyX - Tinder for Team Building

<div align="center">

**Find your perfect co-founder or project collaborator with a swipe!**

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Docs](#-api-documentation)

</div>

---

## 📖 Overview

CrewlyX is a modern web application that makes finding team members as easy as dating apps. Swipe
right to connect with potential co-founders, hackathon partners, and project collaborators who share
your vision and skills.

### 🎯 Perfect For

- 👥 Finding co-founders for startups
- 💻 Hackathon team formation
- 🚀 Project collaboration
- 🎓 Learning partners
- 🏢 Networking events

---

## ✨ Features

### Core Functionality

- 🎴 **Tinder-Style Swiping** - Intuitive swipe interface for browsing profiles
- 🤝 **Smart Matching** - Automatic match detection when both users like each other
- 💬 **Real-time Messaging** - Socket.IO powered chat between matches
- 👤 **Rich Profiles** - Detailed user profiles with skills, interests, and goals
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing

### Profile Features

- Detailed profiles with bio, location, skills, and experience
- Collaboration preferences (co-founder, hackathon partner, etc.)
- Availability settings (full-time, part-time, weekends, flexible)
- Skill tags and interests display
- Profile photos with support for custom uploads

### User Experience

- 🎨 Modern UI with glassmorphism effects
- 📱 Fully responsive design (desktop & mobile)
- ✨ Smooth animations with Framer Motion & React Spring
- 🌙 Dark theme for better visibility
- ⚡ Fast and optimized performance

---

## 🎬 Demo

### Landing Page

Beautiful gradient design with animated particles and clear call-to-action buttons.

### Discover/Swipe Interface

Tinder-style card interface with smooth animations and real-time feedback.

### Match System

Instant match notifications when mutual likes are detected.

### Profile Management

Comprehensive profile editing with stats tracking.

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **React Spring** - Physics-based animations
- **Socket.IO Client** - Real-time features

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Elegant MongoDB ODM
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication
- **Express Validator** - Input validation

---

## 🚀 Installation

### Prerequisites

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MongoDB** 4.4+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn**

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crewlyx.git
cd crewlyx
```

#### 2. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Linux:**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
Download and install from [MongoDB Downloads](https://www.mongodb.com/try/download/community)

#### 3. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

#### 4. Seed Database

```bash
# From the server directory
npm run seed
```

This creates 10 test users. All passwords are `Test123`

#### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### 6. Open Your Browser

Visit **http://localhost:3000**

**Test Login:**

- Email: `alex@test.com`
- Password: `Test123`

---

## 📁 Project Structure

```
crewlyx/
├── server/                    # Backend API
│   ├── models/               # MongoDB models
│   │   ├── User.js          # User schema
│   │   ├── Match.js         # Match schema
│   │   └── Message.js       # Message schema
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication
│   │   ├── users.js         # User management
│   │   ├── swipes.js        # Swipe functionality
│   │   ├── matches.js       # Match management
│   │   └── messages.js      # Messaging
│   ├── middleware/          # Middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js # Error handling
│   ├── scripts/            # Utility scripts
│   │   └── seedDatabase.js # Database seeding
│   ├── .env                # Environment variables
│   ├── server.js           # Server entry point
│   └── package.json        # Dependencies
│
├── src/                     # Frontend source
│   ├── components/         # React components
│   │   ├── Login.tsx       # Login page
│   │   ├── SwipeCards.tsx  # Swipe interface
│   │   ├── LandingPage.tsx # Landing page
│   │   ├── Matches.tsx     # Matches view
│   │   ├── Profile.tsx     # Profile page
│   │   └── ...
│   ├── services/          # API services
│   │   └── api.ts         # Backend API calls
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilities
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
│
└── public/               # Static assets
```

---

## 🔌 API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "age": 25,
  "skills": ["React", "Node.js"],
  "location": "San Francisco, CA",
  "lookingFor": "co-founder",
  "availability": "full-time"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Users

#### Get Users to Swipe

```http
GET /api/users/discover
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Updated bio",
  "skills": ["React", "Vue", "Angular"]
}
```

### Swipes

#### Swipe on User

```http
POST /api/swipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetUserId": "507f1f77bcf86cd799439011",
  "action": "like"
}
```

### Matches

#### Get All Matches

```http
GET /api/matches
Authorization: Bearer <token>
```

### Messages

#### Send Message

```http
POST /api/messages/:matchId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hey! Let's collaborate!"
}
```

For complete API documentation, see [server/README.md](server/README.md)

---

## 🔒 Security Features

- ✅ **Password Hashing** - Bcrypt with 12 salt rounds
- ✅ **JWT Authentication** - Secure token-based auth (7-day expiry)
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Input Validation** - Express-validator for all inputs
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Configured for specific origins
- ✅ **NoSQL Injection Protection** - Mongoose sanitization

---

## 🧪 Testing

### Test Accounts

All test accounts use password: `Test123`

| Email            | Name            | Role                 |
|------------------|-----------------|----------------------|
| alex@test.com    | Alex Johnson    | Full-stack Developer |
| sarah@test.com   | Sarah Chen      | UI/UX Designer       |
| michael@test.com | Michael Davis   | ML Engineer          |
| emily@test.com   | Emily Rodriguez | Product Manager      |
| david@test.com   | David Kim       | DevOps Engineer      |

### Running Tests

```bash
# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@test.com","password":"Test123"}'

# Check backend health
curl http://localhost:5001/api/health
```

---

## 🌍 Deployment

### MongoDB Atlas (Cloud Database)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster (512MB)
3. Get connection string
4. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crewlyx
   NODE_ENV=production
   ```

### Environment Variables

**Development (`server/.env`):**

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/crewlyx
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Production:**

- Use strong JWT secret (32+ characters)
- Set secure CORS origin
- Use MongoDB Atlas connection string
- Enable HTTPS

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by Tinder's swipe interface
- Icons from [Lucide React](https://lucide.dev/)
- Profile photos from [Unsplash](https://unsplash.com/)
- Built with ❤️ for the builder community

---

## 📧 Contact

**Project Link:** [https://github.com/yourusername/crewlyx](https://github.com/yourusername/crewlyx)

**Issues:
** [https://github.com/yourusername/crewlyx/issues](https://github.com/yourusername/crewlyx/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

*CrewlyX - Where great teams begin*

</div>