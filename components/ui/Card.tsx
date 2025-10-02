
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative p-1 rounded-xl bg-gradient-to-br from-purple-600 via-black to-cyan-500 ${className}`}>
        <div className="bg-gray-900 rounded-lg p-6 h-full">
            {children}
        </div>
    </div>
  );
};

export default Card;
