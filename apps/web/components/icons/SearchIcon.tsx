'use client';

interface SearchIconProps {
  size?: number;
  className?: string;
}

/**
 * Search icon from Figma vector group
 */
export function SearchIcon({ size = 21, className = '' }: SearchIconProps) {
  const imgSearchIcon = "/assets/home/imgHeaderSearchIcon.svg";
  
  return (
    <img 
      alt="Search" 
      className={`block max-w-none ${className}`}
      src={imgSearchIcon}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}

