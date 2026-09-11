import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel rounded-xl p-4 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};
