
import React from 'react';

interface CustomIconProps {
  size?: number | string;
  className?: string;
  alt?: string;
}

// Custom Feather icon for Grey/Wise Points
export const Feather: React.FC<CustomIconProps> = ({ size = 24, className, alt = "Feather", ...props }) => {
  return (
    <img 
      src="/lovable-uploads/57b1e055-d783-4a64-8c25-14e963bc09d2.png" 
      alt={alt}
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
      {...props} 
    />
  );
};

// Custom Wing icon for Dark/Coins
export const Wing: React.FC<CustomIconProps> = ({ size = 24, className, alt = "Wing", ...props }) => {
  return (
    <img 
      src="/lovable-uploads/318ad001-14a0-4fe7-ae85-68f7ced56cc0.png" 
      alt={alt}
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
      {...props} 
    />
  );
};

// Custom Flame icon for Streak
export const Flame: React.FC<CustomIconProps> = ({ size = 24, className, alt = "Flame", ...props }) => {
  return (
    <img 
      src="/lovable-uploads/6e9d2236-e9a4-4be4-b9e7-de88802f68e7.png" 
      alt={alt}
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
      {...props} 
    />
  );
};

// Custom Bolt/Thunder icon for Flow
export const Bolt: React.FC<CustomIconProps> = ({ size = 24, className, alt = "Bolt", ...props }) => {
  return (
    <img 
      src="/lovable-uploads/55d4d534-752e-4b7b-ae58-656b7aef4a18.png" 
      alt={alt}
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
      {...props} 
    />
  );
};
