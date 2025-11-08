import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Clock, Send } from 'lucide-react';
import { User as UserType, Match } from '../types';
import { storage } from '../utils/storage';

interface Props {
  currentUser: UserType;
}

const Matches = ({ currentUser }: Props) => {
  const [matches, setMatches] = useState<Array<Match & { user: UserType }>>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match & { user: UserType } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [currentUser]);

  const loadMatches = () => {
    const allMatches = storage.getMatches();
    const allUsers = storage.getUsers();
    
    const userMatches = allMatches
      .filter(match => match.users.includes(currentUser.id))
      .map(match => {
        const otherUserId = match.users.find(id => id !== currentUser.id);
        const otherUser = allUsers.find(user => user.id === otherUserId);
        return {
          ...match,
          user: otherUser!
        };
      })
      .filter(match => match.user) // Filter out matches where user wasn't found
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setMatches(userMatches);
    setLoading(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (selectedMatch) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Chat Header */}
        <div className="card-glow bg-white/5 border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMatch(null)}
              className="text-gray-400 hover:text-white"
            >
              ←
            </button>
            <img
              src={selectedMatch.user.profilePhoto}
              alt={selectedMatch.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-white">{selectedMatch.user.name}</h2>
              <p className="text-sm text-gray-400">
                Matched {formatDate(selectedMatch.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-3">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">It's a Match!</h3>
            <p className="text-gray-400 text-sm">
              Start a conversation with {selectedMatch.user.name}
            </p>
          </div>

          {/* Sample starter messages */}
          <div className="space-y-3 mb-6">
            <div className="card-glow bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white text-sm mb-2">👋 Hey! I see you're into {selectedMatch.user.skills[0]}. I'd love to chat about potential collaboration!</p>
              <button className="text-primary-400 text-xs hover:text-primary-300">Send this message</button>
            </div>
            <div className="card-glow bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white text-sm mb-2">🚀 Hi {selectedMatch.user.name}! Your profile caught my attention. Want to discuss some project ideas?</p>
              <button className="text-primary-400 text-xs hover:text-primary-300">Send this message</button>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 mb-4">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Matches</h1>
        <p className="text-gray-400">People who liked you back</p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">No Matches Yet</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Keep swiping to find people who share your interests and want to build something amazing together!
          </p>
          <button 
            onClick={() => window.location.href = '/swipe'}
            className="btn-primary"
          >
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="card-glow bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={match.user.profilePhoto}
                    alt={match.user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{match.user.name}</h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(match.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-2">
                    {match.user.bio?.slice(0, 80)}...
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {match.user.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {match.user.skills.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-white/10 text-gray-400 rounded-full">
                        +{match.user.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;