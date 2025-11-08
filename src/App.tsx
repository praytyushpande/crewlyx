import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from './types';

// Components
import LandingPage from './components/LandingPage';
import ProfileSetup from './components/ProfileSetup';
import SwipeCards from './components/SwipeCards';
import Matches from './components/Matches';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import Chat from './components/Chat';

// Sample users that load automatically
const SAMPLE_USERS = [
  {
    name: 'Sarah Chen',
    age: 28,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'UI/UX Designer with 5 years of experience. Love creating beautiful and intuitive user experiences for mobile and web applications.',
    location: 'New York, NY',
    experience: '5 years',
    interests: ['Design Thinking', 'Product Design', 'Accessibility', 'Animation'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
  },
  {
    name: 'Michael Davis',
    age: 30,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Research'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Machine Learning Engineer specializing in NLP and computer vision. Published researcher with focus on practical AI applications.',
    location: 'Boston, MA',
    experience: '7 years',
    interests: ['Deep Learning', 'AI Ethics', 'Research', 'Education'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
  },
  {
    name: 'Emily Rodriguez',
    age: 26,
    skills: ['Product Strategy', 'Agile', 'SQL', 'Analytics', 'User Stories'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Product Manager with a technical background. Love working at the intersection of business and technology to build products people love.',
    location: 'Austin, TX',
    experience: '4 years',
    interests: ['Product Management', 'Startups', 'Growth Hacking', 'Customer Development'],
    lookingFor: 'co-founder',
    availability: 'flexible',
  },
  {
    name: 'David Kim',
    age: 27,
    skills: ['Kubernetes', 'CI/CD', 'Terraform', 'Python', 'Linux'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'DevOps Engineer passionate about automation and infrastructure. Building tools to make developers lives easier and deployments faster.',
    location: 'Seattle, WA',
    experience: '5 years',
    interests: ['Infrastructure', 'Automation', 'Open Source', 'Cloud Native'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
  },
  {
    name: 'Jessica Taylor',
    age: 24,
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    profilePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    bio: 'Mobile developer specializing in React Native and Flutter. Love building beautiful cross-platform apps that users enjoy.',
    location: 'Los Angeles, CA',
    experience: '3 years',
    interests: ['Mobile Apps', 'UI Animation', 'App Store Optimization', 'User Engagement'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
  },
  {
    name: 'Ryan Martinez',
    age: 29,
    skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'Ethereum', 'DeFi'],
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    bio: 'Blockchain developer and Web3 enthusiast. Building the decentralized future one smart contract at a time.',
    location: 'Miami, FL',
    experience: '4 years',
    interests: ['Blockchain', 'Cryptocurrency', 'DeFi', 'NFTs'],
    lookingFor: 'co-founder',
    availability: 'full-time',
  },
  {
    name: 'Olivia Brown',
    age: 31,
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Statistical Modeling'],
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    bio: 'Data Scientist with expertise in predictive analytics and visualization. Making data tell compelling stories.',
    location: 'Chicago, IL',
    experience: '8 years',
    interests: ['Data Visualization', 'Machine Learning', 'Business Intelligence', 'Statistics'],
    lookingFor: 'mentor',
    availability: 'flexible',
  },
  {
    name: 'James Wilson',
    age: 33,
    skills: ['Penetration Testing', 'Network Security', 'Cryptography', 'Security Audits', 'Python'],
    profilePhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face',
    bio: 'Cybersecurity specialist and ethical hacker. Helping companies secure their infrastructure and protect user data.',
    location: 'Washington, DC',
    experience: '10 years',
    interests: ['Cybersecurity', 'Ethical Hacking', 'Privacy', 'Security Research'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
  },
  {
    name: 'Sophia Anderson',
    age: 26,
    skills: ['Unity', 'C#', 'Unreal Engine', '3D Modeling', 'Game Design'],
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    bio: 'Game developer with a passion for creating immersive experiences. Love storytelling through interactive media.',
    location: 'Portland, OR',
    experience: '6 years',
    interests: ['Game Development', 'Virtual Reality', 'Storytelling', 'Interactive Media'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
  },
  {
    name: 'Alex Thompson',
    age: 25,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Full-stack developer passionate about building scalable applications. Looking for a technical co-founder to launch a SaaS startup.',
    location: 'San Francisco, CA',
    experience: '4 years',
    interests: ['Cloud Computing', 'Microservices', 'API Design', 'Startups'],
    lookingFor: 'co-founder',
    availability: 'full-time',
  },
  {
    name: 'Priya Patel',
    age: 27,
    skills: ['Marketing', 'Content Strategy', 'SEO', 'Analytics', 'Social Media'],
    profilePhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face',
    bio: 'Growth marketer with a data-driven approach. Love scaling startups from 0 to 1 and beyond.',
    location: 'Denver, CO',
    experience: '5 years',
    interests: ['Digital Marketing', 'Content Creation', 'Brand Building', 'Growth Hacking'],
    lookingFor: 'co-founder',
    availability: 'flexible',
  },
  {
    name: 'Marcus Johnson',
    age: 29,
    skills: ['Swift', 'SwiftUI', 'iOS Development', 'ARKit', 'Core ML'],
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces',
    bio: 'iOS developer creating next-gen mobile experiences with augmented reality. Love pushing the boundaries of mobile tech.',
    location: 'San Diego, CA',
    experience: '6 years',
    interests: ['Augmented Reality', 'Mobile UX', 'App Performance', 'Computer Vision'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
  },
  {
    name: 'Nina Kowalski',
    age: 24,
    skills: ['Go', 'Docker', 'Microservices', 'gRPC', 'PostgreSQL'],
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    bio: 'Backend engineer specializing in high-performance distributed systems. Building scalable infrastructure for the next billion users.',
    location: 'Berlin, Germany',
    experience: '3 years',
    interests: ['System Design', 'Performance Optimization', 'Scalability', 'Cloud Architecture'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
  },
  {
    name: 'Carlos Mendez',
    age: 32,
    skills: ['Vue.js', 'TypeScript', 'GraphQL', 'Firebase', 'Testing'],
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    bio: 'Frontend architect with a passion for clean code and beautiful interfaces. Love mentoring junior developers.',
    location: 'Barcelona, Spain',
    experience: '9 years',
    interests: ['Web Performance', 'Accessibility', 'Design Systems', 'Developer Experience'],
    lookingFor: 'mentor',
    availability: 'flexible',
  },
  {
    name: 'Aisha Khan',
    age: 28,
    skills: ['Rust', 'WebAssembly', 'System Programming', 'Performance', 'C++'],
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    bio: 'Systems programmer building the next generation of web applications with WebAssembly. Love low-level optimization.',
    location: 'Toronto, Canada',
    experience: '5 years',
    interests: ['Systems Programming', 'WebAssembly', 'Performance', 'Compilers'],
    lookingFor: 'co-founder',
    availability: 'full-time',
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample users on first load
    const initializeSampleUsers = () => {
      const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // Only add sample users if there are no users yet
      if (existingUsers.length === 0) {
        const sampleUsersWithIds = SAMPLE_USERS.map((user, index) => ({
          id: 'sample-' + Date.now() + '-' + index,
          _id: 'sample-' + Date.now() + '-' + index,
          email: user.name.toLowerCase().replace(' ', '.') + '@example.com',
          ...user,
          createdAt: new Date(),
        }));
        
        localStorage.setItem('allUsers', JSON.stringify(sampleUsersWithIds));
        console.log('✅ 15 sample users loaded automatically!');
      }
    };

    // Check if user profile exists in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
    
    // Initialize sample users
    initializeSampleUsers();
    
    setLoading(false);
  }, []);

  const handleProfileComplete = (userData: any) => {
    const user: User = {
      id: 'user-' + Date.now(),
      _id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email || '',
      age: Number(userData.age),
      skills: userData.skills || [],
      profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: userData.bio || '',
      location: userData.location || '',
      experience: userData.experience || '',
      interests: userData.interests || [],
      lookingFor: userData.lookingFor || 'any',
      availability: userData.availability || 'flexible',
      createdAt: new Date(),
    };

    // Save current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Add to all users list (so other users can see this profile)
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    allUsers.push(user);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading CrewlyX...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Landing Page - First screen */}
          <Route 
            path="/" 
            element={
              currentUser ? <Navigate to="/swipe" replace /> : <LandingPage />
            } 
          />
          
          {/* Profile Setup Route */}
          <Route 
            path="/setup" 
            element={
              currentUser ? 
                <Navigate to="/swipe" replace /> : 
                <ProfileSetup onComplete={handleProfileComplete} />
            } 
          />

          {/* Main App Routes - Protected */}
          {currentUser ? (
            <>
              <Route path="/swipe" element={
                <div className="pb-20">
                  <SwipeCards currentUser={currentUser} />
                  <Navigation />
                </div>
              } />
              <Route path="/matches" element={
                <div className="pb-20">
                  <Matches currentUser={currentUser} />
                  <Navigation />
                </div>
              } />
              <Route path="/profile" element={
                <div className="pb-20">
                  <Profile currentUser={currentUser} onLogout={handleLogout} />
                  <Navigation />
                </div>
              } />
              <Route path="/chat/:matchId" element={
                <div className="pb-20">
                  <Chat currentUser={currentUser} />
                  <Navigation />
                </div>
              } />
              <Route path="*" element={<Navigate to="/swipe" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;