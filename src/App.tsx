import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from './types';
import { authAPI } from './services/api';

// Components
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import ProfileSetup from './components/ProfileSetup';
import SwipeCards from './components/SwipeCards';
import Matches from './components/Matches';
import Profile from './components/Profile';
import Navigation from './components/Navigation';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const initializeApp = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const user = await authAPI.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    initializeApp();
  }, []);

  const handleLoginSuccess = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to get current user after login:', error);
    }
  };

  const handleUserRegistration = async (userData: any) => {
    try {
      const result = await authAPI.register(userData);
      // After successful registration, get the current user
      const user = await authAPI.getCurrentUser();
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
    }
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
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              currentUser ? <Navigate to="/swipe" replace /> : <LandingPage />
            } 
          />
          <Route 
            path="/login" 
            element={
              currentUser ? 
                <Navigate to="/swipe" replace /> : 
                <Login onLoginSuccess={handleLoginSuccess} />
            } 
          />
          <Route 
            path="/setup" 
            element={
              currentUser ? 
                <Navigate to="/swipe" replace /> : 
                <ProfileSetup onComplete={handleUserRegistration} />
            } 
          />

          {/* Protected routes */}
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