'use client';

import React, { forwardRef, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  fullWidth?: boolean;
  showCount?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      fullWidth = false,
      showCount = false,
      maxLength,
      className = '',
      id: providedId,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId(); // ID ổn định giữa server và client
    const textareaId = providedId || generatedId;

    const currentLength = value ? String(value).length : 0;

    const getStateStyles = () => {
      if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-200';
      if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-200';
      return 'border-gray-300 focus:border-red-500 focus:ring-red-100';
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={`
              w-full bg-gray-50 border rounded-xl px-4 py-3
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:bg-white
              placeholder-gray-400 text-gray-900
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              resize-none
              ${getStateStyles()}
              ${className}
            `}
            {...props}
          />

          {(error || success) && (
            <div className="absolute top-3 right-3">
              {error && <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />}
              {success && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <p
            className={`text-sm ${
              error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {error || success || helperText}
          </p>

          {showCount && maxLength && (
            <span
              className={`text-sm ${
                currentLength >= maxLength ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;