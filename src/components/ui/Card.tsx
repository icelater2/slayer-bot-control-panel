import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  onClick,
  hoverable = false
}) => {
  return (
    <div 
      className={twMerge(
        'card p-6',
        hoverable && 'cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;