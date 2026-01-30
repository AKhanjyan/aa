'use client';

interface LanguageIconProps {
  size?: number;
  className?: string;
}

/**
 * Language icon from Figma vector group
 */
export function LanguageIcon({ size = 20, className = '' }: LanguageIconProps) {
  const imgLanguageIcon = "/assets/home/imgHeaderLanguageIcon.svg";
  
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

