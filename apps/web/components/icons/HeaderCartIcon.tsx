'use client';

interface HeaderCartIconProps {
  size?: number;
  className?: string;
}

/**
 * Cart icon from Figma vector group for header
 */
export function HeaderCartIcon({ size = 20, className = '' }: HeaderCartIconProps) {
  const imgCartIcon = "/assets/home/imgHeaderCartIcon.svg";
  
  return (
    <img 
      alt="Cart" 
      className={`block max-w-none ${className}`}
      src={imgCartIcon}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}

