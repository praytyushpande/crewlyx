import { NavLink } from 'react-router-dom';
import { Heart, MessageCircle, User, Zap } from 'lucide-react';
import CrewlyXLogo from './CrewlyXLogo';

const Navigation = () => {
  const navItems = [
    {
      to: '/swipe',
      icon: <Zap className="w-6 h-6" />,
      label: 'Discover'
    },
    {
      to: '/matches',
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'Matches'
    },
    {
      to: '/profile',
      icon: <User className="w-6 h-6" />,
      label: 'Profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800/50">
      <div className="flex items-center justify-between py-3 px-6 max-w-md mx-auto">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <CrewlyXLogo size="sm" />
        </div>
        
        {/* Navigation items */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;