'use client';

import React from 'react';

interface ProductPageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'icon' | 'cancel';
}

/**
 * Reusable button component for product page
 * Matches the add to cart button styling
 */
export function ProductPageButton({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}: ProductPageButtonProps) {
  const baseStyles = 'transition-colors font-bold';
  
  const variantStyles = {
    primary: 'bg-[#00d1ff] text-white rounded-[34px] uppercase disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#00b8e6] px-6',
    secondary: 'bg-[#00d1ff] text-white rounded-[34px] uppercase disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#00b8e6] px-6',
    icon: 'bg-[#00d1ff] text-white rounded-full uppercase disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#00b8e6] flex items-center justify-center',
    cancel: 'bg-[#00d1ff] text-white rounded-[34px] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#00b8e6] h-[48px] px-6',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

