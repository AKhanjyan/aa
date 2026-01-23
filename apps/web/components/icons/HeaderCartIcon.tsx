'use client';

interface HeaderCartIconProps {
  size?: number;
  className?: string;
}

/**
 * Cart icon from Figma vector group for header
 */
export function HeaderCartIcon({ size = 20, className = '' }: HeaderCartIconProps) {
  const imgCartIcon = "https://www.figma.com/api/mcp/asset/d5cdbd3a-b125-45ac-bfc9-d8c8a0aa65dd";
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-[-5%_-4.99%]">
        <img 
          alt="Cart" 
          className="block max-w-none size-full"
          src={imgCartIcon}
        />
      </div>
    </div>
  );
}

