import { useState } from 'react';
import { Edit3, MapPin, Clock, User as UserIcon, LogOut, Settings, Heart } from 'lucide-react';
import { User as UserType } from '../types';
import { storage } from '../utils/storage';

interface Props {
  currentUser: UserType;
  onLogout: () => void;
}

const Profile = ({ currentUser, onLogout }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState(() => {
    const swipeActions = storage.getSwipeActions();
    const matches = storage.getMatches();
    
    const userSwipes = swipeActions.filter(action => action.userId === currentUser.id);
    const userMatches = matches.filter(match => match.users.includes(currentUser.id));
    const likes = userSwipes.filter(action => action.action === 'like').length;
    
    return {
      totalSwipes: userSwipes.length,
      likes,
      matches: userMatches.length
    };
  });

  const getLookingForLabel = (lookingFor?: string) => {
    switch (lookingFor) {
      case 'co-founder': return 'Co-founder';
      case 'hackathon-partner': return 'Hackathon Partner';
      case 'project-collaborator': return 'Project Collaborator';
      case 'mentor': return 'Mentor';
      default: return 'Open to Anything';
    }
  };

  const getAvailabilityLabel = (availability?: string) => {
    switch (availability) {
      case 'full-time': return 'Full-time';
      case 'part-time': return 'Part-time';
      case 'weekends': return 'Weekends';
      default: return 'Flexible';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400">Manage your information</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="card-glow bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={currentUser.profilePhoto}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
            />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mt-4 mb-1">{currentUser.name}</h2>
          <p className="text-gray-400">{currentUser.age} years old</p>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 mb-6">
          {currentUser.location && (
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{currentUser.location}</span>
            </div>
          )}
          
          {currentUser.experience && (
            <div className="flex items-center gap-3 text-gray-300">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{currentUser.experience} experience</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-300">
            <UserIcon className="w-5 h-5 text-gray-400" />
            <span>Looking for: {getLookingForLabel(currentUser.lookingFor)}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>Availability: {getAvailabilityLabel(currentUser.availability)}</span>
          </div>
        </div>

        {/* Bio */}
        {currentUser.bio && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">About</h3>
            <p className="text-gray-400 leading-relaxed">{currentUser.bio}</p>
          </div>
        )}

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        {currentUser.interests && currentUser.interests.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest) => (
                <span key={interest} className="skill-tag bg-accent-500/20 text-accent-300">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card-glow bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-primary-400">{stats.totalSwipes}</div>
          <div className="text-sm text-gray-400">Total Swipes</div>
        </div>
        <div className="card-glow bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.likes}</div>
          <div className="text-sm text-gray-400">Likes Given</div>
        </div>
        <div className="card-glow bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-400">{stats.matches}</div>
          <div className="text-sm text-gray-400">Matches</div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        <button className="w-full card-glow bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-left hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-white">Settings</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button className="w-full card-glow bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-left hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-white">Liked Profiles</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full card-glow bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between text-left hover:bg-red-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400">Sign Out</span>
          </div>
          <span className="text-red-400">→</span>
        </button>
      </div>

      {/* Edit Modal - Basic placeholder */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="card-glow bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
            <p className="text-gray-400 mb-6">Profile editing feature coming soon!</p>
            <button
              onClick={() => setIsEditing(false)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;