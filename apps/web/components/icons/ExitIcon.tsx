'use client';

interface ExitIconProps {
  size?: number;
  className?: string;
}

/**
 * Exit/Logout icon from Figma vector group
 */
export function ExitIcon({ size = 20, className = '' }: ExitIconProps) {
  const imgExitIcon = "/assets/home/imgHeaderExitIcon.svg";
  
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

