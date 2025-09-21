import React from 'react';

const VibezyGeometricLogo = ({ size = "w-64 h-20" }) => {
  // Myntra color palette
  const colors = {
    magenta: '#FF3F6C',
    dark: '#282C3F'
  };

  return (
    <div className={`${size} flex items-center justify-center`}>
      <h1 className="text-3xl font-light tracking-wide">
        <span style={{ color: colors.dark, fontWeight: '600' }}>Vibe</span>
        <span style={{ color: colors.magenta, fontWeight: '300' }}>zy</span>
      </h1>
    </div>
  );
};

export default VibezyGeometricLogo;
