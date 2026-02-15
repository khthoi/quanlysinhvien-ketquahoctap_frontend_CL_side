'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  fullWidth?: boolean;
  children:  React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    outline-none
  `;

  const variants = {
    primary: `
      bg-red-700 text-white
      hover:bg-red-800 active:bg-red-900
      focus:ring-red-500
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200 active:bg-gray-300
      focus:ring-gray-400
    `,
    outline: `
      bg-transparent text-red-700 border-2 border-red-700
      hover:bg-red-50 active:bg-red-100
      focus:ring-red-500
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-400
    `,
    danger: `
      bg-red-600 text-white
      hover: bg-red-700 active: bg-red-800
      focus:ring-red-500
      shadow-md hover:shadow-lg
    `,
    success: `
      bg-green-600 text-white
      hover: bg-green-700 active: bg-green-800
      focus:ring-green-500
      shadow-md hover:shadow-lg
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2. 5'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' :  ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ?  (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
      ) : leftIcon ?  (
        <FontAwesomeIcon icon={leftIcon} className="text-sm" />
      ) : null}
      
      <span>{children}</span>
      
      {! isLoading && rightIcon && (
        <FontAwesomeIcon icon={rightIcon} className="text-sm" />
      )}
    </button>
  );
};

export default Button;