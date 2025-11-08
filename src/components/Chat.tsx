import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface Props {
  currentUser: User;
}

const Chat = ({ currentUser }: Props) => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load match details from localStorage
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const match = matches.find((m: any) => m.id === matchId);
    
    if (match) {
      setMatchedUser(match.user);
      
      // Load messages for this match
      const allMessages = JSON.parse(localStorage.getItem('messages') || '{}');
      const chatMessages = allMessages[matchId!] || [];
      setMessages(chatMessages);
    }
  }, [matchId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message: Message = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    // Update messages
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Save to localStorage
    const allMessages = JSON.parse(localStorage.getItem('messages') || '{}');
    allMessages[matchId!] = updatedMessages;
    localStorage.setItem('messages', JSON.stringify(allMessages));

    // Simulate response from matched user after 2 seconds
    setTimeout(() => {
      const responses = [
        "That sounds great! Let's discuss more about this.",
        "I'm really excited about this opportunity!",
        "When would be a good time to chat more?",
        "I'd love to collaborate on this project!",
        "That's exactly what I was thinking!",
        "Let's set up a call to discuss details.",
        "I'm available this week. What about you?",
        "This could be a game changer!",
      ];
      
      const autoReply: Message = {
        id: 'msg-' + Date.now(),
        senderId: matchedUser?.id || 'other',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      const withReply = [...updatedMessages, autoReply];
      setMessages(withReply);
      
      const allMessagesUpdated = JSON.parse(localStorage.getItem('messages') || '{}');
      allMessagesUpdated[matchId!] = withReply;
      localStorage.setItem('messages', JSON.stringify(allMessagesUpdated));
    }, 2000);

    setNewMessage('');
  };

  if (!matchedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Match not found</p>
          <button 
            onClick={() => navigate('/matches')}
            className="btn-primary mt-4"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/matches')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <img
              src={matchedUser.profilePhoto}
              alt={matchedUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
            />
            <div>
              <h1 className="text-xl font-bold text-white">{matchedUser.name}</h1>
              <p className="text-sm text-gray-400">{matchedUser.lookingFor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start the Conversation!</h3>
            <p className="text-gray-400">
              Say hi to {matchedUser.name} and start collaborating
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-black/30 backdrop-blur-sm border-t border-white/10 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold text-white"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
