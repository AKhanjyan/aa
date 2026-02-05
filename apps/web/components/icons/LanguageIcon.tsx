'use client';

interface LanguageIconProps {
  size?: number;
  className?: string;
}

export function LanguageIcon({ size = 20, className = '' }: LanguageIconProps) {
  // Local language icon SVG stored in public/assets/home
  const imgLanguageIcon = "/assets/home/Vector.svg";
  
  return (
    <img 
      alt="Language" 
      className={`block max-w-none ${className}`}
      src={imgLanguageIcon}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}

