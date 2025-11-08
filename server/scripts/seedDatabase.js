const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Match = require('../models/Match');
const Message = require('../models/Message');

// Test users data
const testUsers = [
  {
    name: 'Alex Johnson',
    email: 'alex@test.com',
    password: 'Test123',
    age: 25,
    bio: 'Full-stack developer passionate about building scalable applications. Looking for a technical co-founder to launch a SaaS startup.',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    location: 'San Francisco, CA',
    interests: ['Artificial Intelligence', 'SaaS', 'Cloud Computing', 'Mobile Development'],
    lookingFor: 'co-founder',
    availability: 'full-time',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@test.com',
    password: 'Test123',
    age: 28,
    bio: 'UI/UX Designer with 5 years of experience. Love creating beautiful and intuitive user experiences.',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    location: 'New York, NY',
    interests: ['Design Thinking', 'Product Design', 'Accessibility', 'Animation'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Michael Davis',
    email: 'michael@test.com',
    password: 'Test123',
    age: 30,
    bio: 'Machine Learning Engineer specializing in NLP and computer vision. Published researcher.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Research'],
    location: 'Boston, MA',
    interests: ['Deep Learning', 'AI Ethics', 'Research', 'Education'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily@test.com',
    password: 'Test123',
    age: 26,
    bio: 'Product Manager with a technical background. Love working at the intersection of business and technology.',
    skills: ['Product Strategy', 'Agile', 'SQL', 'Analytics', 'User Stories'],
    location: 'Austin, TX',
    interests: ['Product Management', 'Startups', 'Growth Hacking', 'Customer Development'],
    lookingFor: 'co-founder',
    availability: 'flexible',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'David Kim',
    email: 'david@test.com',
    password: 'Test123',
    age: 27,
    bio: 'DevOps Engineer passionate about automation and infrastructure. Building tools to make developers lives easier.',
    skills: ['Kubernetes', 'CI/CD', 'Terraform', 'Python', 'Linux'],
    location: 'Seattle, WA',
    interests: ['Infrastructure', 'Automation', 'Open Source', 'Cloud Native'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Jessica Taylor',
    email: 'jessica@test.com',
    password: 'Test123',
    age: 24,
    bio: 'Mobile developer specializing in React Native and Flutter. Love building cross-platform apps.',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    location: 'Los Angeles, CA',
    interests: ['Mobile Apps', 'UI Animation', 'App Store Optimization', 'User Engagement'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
    profilePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Ryan Martinez',
    email: 'ryan@test.com',
    password: 'Test123',
    age: 29,
    bio: 'Blockchain developer and Web3 enthusiast. Building the decentralized future.',
    skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'Ethereum', 'DeFi'],
    location: 'Miami, FL',
    interests: ['Blockchain', 'Cryptocurrency', 'DeFi', 'NFTs'],
    lookingFor: 'co-founder',
    availability: 'full-time',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Olivia Brown',
    email: 'olivia@test.com',
    password: 'Test123',
    age: 31,
    bio: 'Data Scientist with expertise in predictive analytics and visualization. Making data tell stories.',
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Statistical Modeling'],
    location: 'Chicago, IL',
    interests: ['Data Visualization', 'Machine Learning', 'Business Intelligence', 'Statistics'],
    lookingFor: 'mentor',
    availability: 'flexible',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'James Wilson',
    email: 'james@test.com',
    password: 'Test123',
    age: 33,
    bio: 'Cybersecurity specialist and ethical hacker. Helping companies secure their infrastructure.',
    skills: ['Penetration Testing', 'Network Security', 'Cryptography', 'Security Audits', 'Python'],
    location: 'Washington, DC',
    interests: ['Cybersecurity', 'Ethical Hacking', 'Privacy', 'Security Research'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
    profilePhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Sophia Anderson',
    email: 'sophia@test.com',
    password: 'Test123',
    age: 26,
    bio: 'Game developer with a passion for immersive experiences. Creating worlds that people love to explore.',
    skills: ['Unity', 'C#', 'Unreal Engine', '3D Modeling', 'Game Design'],
    location: 'Portland, OR',
    interests: ['Game Development', 'Virtual Reality', 'Storytelling', 'Interactive Media'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crewlyx', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Match.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Create some sample matches (optional)
const seedMatches = async (users) => {
  try {
    // Create a few sample matches
    const match1 = new Match({
      users: [users[0]._id, users[1]._id], // Alex and Sarah
      createdAt: new Date()
    });
    await match1.save();
    console.log(`✅ Created match between ${users[0].name} and ${users[1].name}`);

    const match2 = new Match({
      users: [users[0]._id, users[3]._id], // Alex and Emily
      createdAt: new Date()
    });
    await match2.save();
    console.log(`✅ Created match between ${users[0].name} and ${users[3].name}`);

    const match3 = new Match({
      users: [users[2]._id, users[5]._id], // Michael and Jessica
      createdAt: new Date()
    });
    await match3.save();
    console.log(`✅ Created match between ${users[2].name} and ${users[5].name}`);

    return [match1, match2, match3];
  } catch (error) {
    console.error('Error seeding matches:', error);
    throw error;
  }
};

// Create some sample messages (optional)
const seedMessages = async (matches, users) => {
  try {
    // Add a sample message in the first match
    const message1 = new Message({
      matchId: matches[0]._id,
      sender: users[0]._id,
      content: 'Hey Sarah! I saw your design portfolio and I\'m really impressed. Would love to collaborate!',
      createdAt: new Date()
    });
    await message1.save();

    matches[0].lastMessage = message1._id;
    await matches[0].save();

    console.log(`✅ Created sample messages`);
  } catch (error) {
    console.error('Error seeding messages:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await connectDB();
    await clearDatabase();
    
    console.log('\n📝 Creating test users...');
    const users = await seedUsers();
    
    console.log('\n💑 Creating sample matches...');
    const matches = await seedMatches(users);
    
    console.log('\n💬 Creating sample messages...');
    await seedMessages(matches, users);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: alex@test.com');
    console.log('   Password: Test123\n');
    console.log('   You can use any of the following emails with password "Test123":');
    testUsers.forEach(user => {
      console.log(`   - ${user.email}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();