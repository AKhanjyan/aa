'use client';

interface SearchIconProps {
  size?: number;
  className?: string;
}

/**
 * Search icon from Figma vector group
 */
export function SearchIcon({ size = 21, className = '' }: SearchIconProps) {
  const imgSearchIcon = "https://www.figma.com/api/mcp/asset/e4a0ab91-ecc2-4970-9d02-54165dfb7e01";
  
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

