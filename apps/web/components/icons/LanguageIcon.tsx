'use client';

interface LanguageIconProps {
  size?: number;
  className?: string;
}

/**
 * Language icon from Figma vector group
 */
export function LanguageIcon({ size = 20, className = '' }: LanguageIconProps) {
  const imgLanguageIcon = "https://www.figma.com/api/mcp/asset/f043a5f6-c07b-40fc-bd7c-95ed387b0490";
  
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

