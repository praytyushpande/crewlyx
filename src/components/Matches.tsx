import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, Clock } from 'lucide-react';
import { User as UserType } from '../types';

interface Props {
  currentUser: UserType;
}

const Matches = ({ currentUser }: Props) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    const storedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    setMatches(storedMatches);
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

  return (
    <div className="min-h-screen px-6 py-8">
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
            Keep swiping to find people who share your interests\!
          </p>
          <button 
            onClick={() => navigate('/swipe')}
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
              onClick={() => navigate(`/chat/${match.id}`)}
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
                    {match.user.skills.slice(0, 3).map((skill: string) => (
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
