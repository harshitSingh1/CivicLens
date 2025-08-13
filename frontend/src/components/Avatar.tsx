// src/components/Avatar.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`flex items-center justify-center rounded-full bg-blue-600 text-white ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt="Avatar" className="object-cover w-full h-full rounded-full" />
      ) : (
        <span>{name?.charAt(0).toUpperCase()}</span>
      )}
    </motion.div>
  );
};

export default Avatar;