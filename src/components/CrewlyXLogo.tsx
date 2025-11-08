import { Sparkles } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIcon?: boolean;
}

const CrewlyXLogo = ({ size = 'md', className = '', showIcon = true }: Props) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <div className={`${className} relative flex items-center gap-2`}>
      {/* Logo Text */}
      <div className={`${sizeClasses[size]} flex items-center`}>
        <h1 className={`${textSizes[size]} font-heading font-bold text-gradient tracking-tight`}>
          CrewlyX
        </h1>
        
        {/* Sparkle Icon */}
        {showIcon && (
          <Sparkles 
            className={`${iconSizes[size]} text-gold-400 sparkle ml-1`} 
            fill="currentColor"
          />
        )}
      </div>

      {/* Glow Effect */}
      <div 
        className="absolute inset-0 blur-lg opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #FF6A00 0%, #FF3366 100%)',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default CrewlyXLogo;