import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from './types';

// Components
import ProfileSetup from './components/ProfileSetup';
import SwipeCards from './components/SwipeCards';
import Matches from './components/Matches';
import Profile from './components/Profile';
import Navigation from './components/Navigation';
import Chat from './components/Chat';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user profile exists in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleProfileComplete = (userData: any) => {
    const user: User = {
      id: 'user-' + Date.now(),
      _id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email || 'user@crewlyx.com',
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

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
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
          {/* Profile Setup Route */}
          <Route 
            path="/setup" 
            element={
              currentUser ? 
                <Navigate to="/swipe" replace /> : 
                <ProfileSetup onComplete={handleProfileComplete} />
            } 
          />

          {/* Main App Routes */}
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
              <Route path="/" element={<Navigate to="/swipe" replace />} />
              <Route path="*" element={<Navigate to="/swipe" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/setup" replace />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;