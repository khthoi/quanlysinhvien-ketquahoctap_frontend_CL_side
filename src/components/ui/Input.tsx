'use client';

import React, { useState, forwardRef, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faExclamationCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = false,
      type = 'text',
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId(); // Tạo ID ổn định, nhất quán giữa server & client
    const inputId = providedId || generatedId;

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const sizes = {
      sm: 'py-2 text-sm',
      md: 'py-3 text-sm',
      lg: 'py-3.5 text-base',
    };

    const getStateStyles = () => {
      if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-200';
      if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-200';
      return 'border-gray-300 focus:border-red-500 focus:ring-red-100';
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={leftIcon} className="text-gray-400" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`
              w-full bg-gray-50 border rounded-xl
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:bg-white
              placeholder-gray-400 text-gray-900
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              ${sizes[size]}
              ${leftIcon ? 'pl-11' : 'pl-4'}
              ${isPassword || rightIcon || error || success ? 'pr-11' : 'pr-4'}
              ${getStateStyles()}
              ${className}
            `}
            {...props}
          />

          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            )}

            {!isPassword && error && (
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
            )}

            {!isPassword && success && (
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            )}

            {!isPassword && !error && !success && rightIcon && (
              <FontAwesomeIcon icon={rightIcon} className="text-gray-400" />
            )}
          </div>
        </div>

        {(helperText || error || success) && (
          <p
            className={`mt-2 text-sm ${
              error
                ? 'text-red-600'
                : success
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;