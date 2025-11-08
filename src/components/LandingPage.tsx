import { Link } from 'react-router-dom';
import { Users, Settings, Lightbulb, Zap, ArrowRight, LogIn } from 'lucide-react';
import CrewlyXLogo from './CrewlyXLogo';

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Find Your Team',
      description: 'Connect with creators who share your vision.',
      delay: '0ms'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Build Together',
      description: 'Collaborate on hackathons, projects, or startups.',
      delay: '100ms'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Smart Matching',
      description: 'AI-powered matches based on your skills & goals.',
      delay: '200ms'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Swipe Easy',
      description: 'Simple, fun interface that makes teaming up fast.',
      delay: '300ms'
    }
  ];

  const testimonialProfiles = [
    'https://images.unsplash.com/photo-1494790108755-2616b93a3dea?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Particles */}
      <div className="floating-particles" style={{ top: '20%', left: '10%' }}></div>
      <div className="floating-particles" style={{ top: '60%', right: '15%' }}></div>
      <div className="floating-particles" style={{ top: '80%', left: '80%' }}></div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
        <CrewlyXLogo size="md" />
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
          <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        </div>

        <Link to="/setup" className="btn-primary">
          Join Now
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="hero-glow text-center">
          {/* Main Headline */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-gradient leading-tight mb-6">
              Find Your Perfect Team —<br />
              <span className="inline-block">Swipe, Match, Build.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet co-founders, hackathon partners, and builders who vibe with your ideas.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Link 
              to="/setup"
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            >
              Get Started 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login"
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          </div>

          {/* Mock Swipe Card */}
          <div className="relative max-w-sm mx-auto animate-bounce-in" style={{ animationDelay: '400ms' }}>
            <div className="swipe-card p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="online-indicator -bottom-1 -right-1"></div>
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-semibold text-white">Alex Chen</h3>
                  <p className="text-sm text-gray-400">Full-stack Developer</p>
                </div>
                <div className="ml-auto">
                  <div className="text-2xl font-bold text-gradient">95%</div>
                  <div className="text-xs text-gray-400">Match</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="skill-tag">React</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">AI/ML</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card animate-fade-up"
              style={{ animationDelay: feature.delay }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="animate-fade-up">
          <p className="text-lg text-gray-300 mb-8">
            Join <span className="text-gradient font-bold">10,000+ creators</span> already matching on CrewlyX.
          </p>
          
          {/* Overlapping Avatars */}
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-2">
              {testimonialProfiles.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`User ${index + 1}`}
                  className="w-12 h-12 rounded-full border-2 border-navy-800 object-cover animate-bounce-gentle"
                  style={{ animationDelay: `${index * 300}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Partner Logos */}
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-semibold text-gray-400">IIT</div>
            <div className="text-sm font-semibold text-gray-400">NIT</div>
            <div className="text-sm font-semibold text-gray-400">MLH</div>
            <div className="text-sm font-semibold text-gray-400">DevFest</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-32 text-center">
        {/* Dark gradient background with radial glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900"></div>
        <div className="absolute inset-0 hero-glow"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-6">
              Ready to Build Something Great?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Find your next teammate or co-founder today.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                to="/setup"
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
              >
                Start Swiping 
                <div className="w-5 h-5 group-hover:animate-pulse">👆</div>
              </Link>
              <Link 
                to="/login"
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Already a Member? Login
              </Link>
            </div>

            <p className="text-sm text-gray-500">
              No credit card needed • Instant match setup
            </p>
          </div>
        </div>
      </section>

      {/* Live Counter */}
      <div className="fixed bottom-4 right-4 z-50 card-glow rounded-full px-4 py-2 animate-bounce-gentle">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white">🔥 12,485 builders matched this week</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;