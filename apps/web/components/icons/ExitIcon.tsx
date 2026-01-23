'use client';

interface ExitIconProps {
  size?: number;
  className?: string;
}

/**
 * Exit/Logout icon from Figma vector group
 */
export function ExitIcon({ size = 20, className = '' }: ExitIconProps) {
  const imgExitIcon = "https://www.figma.com/api/mcp/asset/e7ddaef4-2914-4de9-8b97-16e46e60bdb5";
  
  return (
    <img 
      alt="Exit" 
      className={`block max-w-none ${className}`}
      src={imgExitIcon}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}

