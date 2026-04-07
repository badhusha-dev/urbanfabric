import React from 'react';

const Logo = ({ variant = 'white', className = '' }) => {
  const logoSrc = variant === 'dark' ? '/logo.png' : '/logo-white.png';
  
  return (
    <div className={`flex items-center gap-2 group cursor-pointer ${className}`} onClick={() => window.location.href = '/'}>
      <img 
        src={logoSrc} 
        alt="URBAN FABRIC" 
        className="h-8 md:h-10 object-contain hover:scale-105 transition-transform duration-300"
      />
      {variant === 'text-only' && (
        <span className="text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-neon-green transition-colors">
          URBAN FABRIC
        </span>
      )}
    </div>
  );
};

export default Logo;
