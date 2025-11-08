import { useState, useEffect, useRef } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { MapPin, Clock, User, Sparkles, RotateCcw } from 'lucide-react';
import { User as UserType } from '../types';
import { usersAPI, swipesAPI } from '../services/api';
import CrewlyXLogo from './CrewlyXLogo';

interface Props {
  currentUser: UserType;
}

// Demo mode - matches App.tsx
const DEMO_MODE = true;

// Mock users for demo mode
const MOCK_USERS: UserType[] = [
  {
    id: '1',
    _id: '1',
    name: 'Sarah Chen',
    email: 'sarah@test.com',
    age: 28,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'UI/UX Designer with 5 years of experience. Love creating beautiful and intuitive user experiences.',
    location: 'New York, NY',
    experience: '5 years',
    interests: ['Design Thinking', 'Product Design', 'Accessibility', 'Animation'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
    createdAt: new Date(),
  },
  {
    id: '2',
    _id: '2',
    name: 'Michael Davis',
    email: 'michael@test.com',
    age: 30,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Research'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Machine Learning Engineer specializing in NLP and computer vision. Published researcher.',
    location: 'Boston, MA',
    experience: '7 years',
    interests: ['Deep Learning', 'AI Ethics', 'Research', 'Education'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
    createdAt: new Date(),
  },
  {
    id: '3',
    _id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@test.com',
    age: 26,
    skills: ['Product Strategy', 'Agile', 'SQL', 'Analytics', 'User Stories'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Product Manager with a technical background. Love working at the intersection of business and technology.',
    location: 'Austin, TX',
    experience: '4 years',
    interests: ['Product Management', 'Startups', 'Growth Hacking', 'Customer Development'],
    lookingFor: 'co-founder',
    availability: 'flexible',
    createdAt: new Date(),
  },
  {
    id: '4',
    _id: '4',
    name: 'David Kim',
    email: 'david@test.com',
    age: 27,
    skills: ['Kubernetes', 'CI/CD', 'Terraform', 'Python', 'Linux'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'DevOps Engineer passionate about automation and infrastructure. Building tools to make developers lives easier.',
    location: 'Seattle, WA',
    experience: '5 years',
    interests: ['Infrastructure', 'Automation', 'Open Source', 'Cloud Native'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
    createdAt: new Date(),
  },
  {
    id: '5',
    _id: '5',
    name: 'Jessica Taylor',
    email: 'jessica@test.com',
    age: 24,
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    profilePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    bio: 'Mobile developer specializing in React Native and Flutter. Love building cross-platform apps.',
    location: 'Los Angeles, CA',
    experience: '3 years',
    interests: ['Mobile Apps', 'UI Animation', 'App Store Optimization', 'User Engagement'],
    lookingFor: 'hackathon-partner',
    availability: 'weekends',
    createdAt: new Date(),
  },
  {
    id: '6',
    _id: '6',
    name: 'Ryan Martinez',
    email: 'ryan@test.com',
    age: 29,
    skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'Ethereum', 'DeFi'],
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    bio: 'Blockchain developer and Web3 enthusiast. Building the decentralized future.',
    location: 'Miami, FL',
    experience: '4 years',
    interests: ['Blockchain', 'Cryptocurrency', 'DeFi', 'NFTs'],
    lookingFor: 'co-founder',
    availability: 'full-time',
    createdAt: new Date(),
  },
  {
    id: '7',
    _id: '7',
    name: 'Olivia Brown',
    email: 'olivia@test.com',
    age: 31,
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Statistical Modeling'],
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    bio: 'Data Scientist with expertise in predictive analytics and visualization. Making data tell stories.',
    location: 'Chicago, IL',
    experience: '8 years',
    interests: ['Data Visualization', 'Machine Learning', 'Business Intelligence', 'Statistics'],
    lookingFor: 'mentor',
    availability: 'flexible',
    createdAt: new Date(),
  },
  {
    id: '8',
    _id: '8',
    name: 'James Wilson',
    email: 'james@test.com',
    age: 33,
    skills: ['Penetration Testing', 'Network Security', 'Cryptography', 'Security Audits', 'Python'],
    profilePhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face',
    bio: 'Cybersecurity specialist and ethical hacker. Helping companies secure their infrastructure.',
    location: 'Washington, DC',
    experience: '10 years',
    interests: ['Cybersecurity', 'Ethical Hacking', 'Privacy', 'Security Research'],
    lookingFor: 'project-collaborator',
    availability: 'part-time',
    createdAt: new Date(),
  },
];

const SwipeCards = ({ currentUser }: Props) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<'left' | 'right' | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAvailableUsers();
  }, [currentUser]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      
      if (DEMO_MODE) {
        // Use mock users in demo mode
        setUsers(MOCK_USERS);
        setCurrentIndex(0);
      } else {
        // Load from API
        const availableUsers = await usersAPI.discover();
        setUsers(availableUsers);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback to mock users if API fails
      setUsers(MOCK_USERS);
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  }));

  const bind = useDrag(({ 
    active, 
    movement: [mx, my], 
    direction: [xDir], 
    velocity: [vx],
    cancel
  }) => {
    const trigger = vx > 0.3 || Math.abs(mx) > 100;
    const dir = xDir < 0 ? -1 : 1;
    
    setIsDragging(active);
    
    if (active) {
      // Show swipe direction indicator
      if (Math.abs(mx) > 50) {
        setSwipeDirection(mx > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(null);
      }
    } else {
      setSwipeDirection(null);
    }
    
    if (!active && trigger) {
      // Card was swiped with enough velocity or distance
      const isLike = dir === 1;
      handleSwipe(isLike);
      if (cancel) cancel();
    } else {
      // Card is being dragged or released without enough velocity
      api.start({
        x: active ? mx : 0,
        y: active ? my * 0.1 : 0, // Reduced vertical movement
        rotate: active ? mx / 8 + (Math.random() - 0.5) * 2 : 0,
        scale: active ? 1.05 : 1,
        config: { tension: 200, friction: 30 }
      });
    }
  }, {
    axis: 'x', // Lock to horizontal movement
    bounds: { left: -300, right: 300 },
    rubberband: true
  });

  const handleSwipe = async (isLike: boolean) => {
    const currentUserData = users[currentIndex];
    if (!currentUserData) return;

    setLastDirection(isLike ? 'right' : 'left');

    // Animate card off screen
    api.start({
      x: isLike ? 1000 : -1000,
      rotate: isLike ? 30 : -30,
      scale: 1,
      config: { tension: 200, friction: 10 }
    });

    if (!DEMO_MODE) {
      try {
        // Send swipe to backend - use _id or id
        const userId = currentUserData._id || currentUserData.id;
        const response = await swipesAPI.swipe(userId, isLike ? 'like' : 'pass');
        
        // Check if it's a match
        if (response.isMatch && response.match) {
          setMatchedUser(currentUserData);
          setShowMatchModal(true);
        }
      } catch (error) {
        console.error('Failed to save swipe:', error);
      }
    } else {
      // Demo mode: randomly show match (20% chance on likes)
      if (isLike && Math.random() > 0.8) {
        setTimeout(() => {
          setMatchedUser(currentUserData);
          setShowMatchModal(true);
        }, 300);
      }
    }

    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      api.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      });
      setLastDirection(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Loading users...</p>
        </div>
      </div>
    );
  }

  const currentUserData = users[currentIndex];

  if (!currentUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        {/* Logo */}
        <div className="absolute top-6 left-6 z-50">
          <CrewlyXLogo size="md" />
        </div>
        
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No More Profiles</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            You've seen all available profiles! Check back later for new members, or adjust your preferences.
          </p>
          <button 
            onClick={loadAvailableUsers}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen px-6 py-8 relative">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <CrewlyXLogo size="md" />
      </div>

      {/* Header */}
      <div className="text-center mb-8 pt-16">
        <h1 className="text-2xl font-bold text-white mb-2">Discover</h1>
        <p className="text-gray-400">Find your perfect team member</p>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">
          Drag cards left to pass • Drag right to connect
        </p>
      </div>

      {/* Card Stack */}
      <div className="relative max-w-sm mx-auto mb-8" style={{ height: '600px' }}>
        {/* Background cards for depth */}
        {users.slice(currentIndex + 1, currentIndex + 3).map((user, index) => (
          <div
            key={user._id || user.id}
            className="absolute inset-0 card-glow rounded-2xl"
            style={{
              transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
              zIndex: 10 - index,
              opacity: 1 - (index + 1) * 0.2
            }}
          />
        ))}

        {/* Main card */}
        <animated.div
          ref={cardRef}
          {...bind()}
          style={{
            x,
            y,
            rotate,
            scale,
            zIndex: 20,
            touchAction: 'none'
          }}
          className="absolute inset-0 card-glow rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          {/* Swipe Direction Indicators */}
          {isDragging && swipeDirection && (
            <div className={`absolute inset-0 flex items-center justify-center z-30 rounded-2xl ${
              swipeDirection === 'right' ? 'swipe-indicator-like' : 'swipe-indicator-pass'
            }`}>
              <div className={`text-6xl font-bold ${
                swipeDirection === 'right' ? 'text-primary-400' : 'text-accent-400'
              }`}>
                {swipeDirection === 'right' ? '✓' : '✕'}
              </div>
            </div>
          )}

          {/* Profile Image */}
          <div className="relative h-80 overflow-hidden rounded-t-2xl">
            <img
              src={currentUserData.profilePhoto}
              alt={currentUserData.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="p-6 bg-black/90 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-white">{currentUserData.name}</h2>
              <span className="text-lg text-gray-300">{currentUserData.age}</span>
            </div>

            {/* Location & Experience */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              {currentUserData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUserData.location}</span>
                </div>
              )}
              {currentUserData.experience && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentUserData.experience}</span>
                </div>
              )}
            </div>

            {/* Looking for & Availability */}
            <div className="flex items-center gap-2 mb-4">
              <span className="skill-tag bg-primary-500/20 text-primary-300 border-primary-400/30">
                <User className="w-3 h-3 mr-1" />
                {getLookingForLabel(currentUserData.lookingFor)}
              </span>
              <span className="skill-tag bg-accent-500/20 text-accent-300 border-accent-400/30">
                <Clock className="w-3 h-3 mr-1" />
                {getAvailabilityLabel(currentUserData.availability)}
              </span>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentUserData.skills.slice(0, 6).map((skill, idx) => (
                  <span key={`${skill}-${idx}`} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {currentUserData.skills.length > 6 && (
                  <span className="skill-tag">
                    +{currentUserData.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {currentUserData.bio && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">About</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {currentUserData.bio}
                </p>
              </div>
            )}
          </div>
        </animated.div>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
          <div className="card-glow rounded-2xl p-8 text-center max-w-sm w-full animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-primary-400 mb-2">It's a Match!</h2>
            <p className="text-gray-400 mb-6">
              You and {matchedUser.name} liked each other!
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowMatchModal(false)}
                className="btn-secondary flex-1"
              >
                Keep Discovering
              </button>
              <button
                onClick={() => {
                  setShowMatchModal(false);
                  // Navigate to matches would go here
                }}
                className="btn-primary flex-1"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeCards;