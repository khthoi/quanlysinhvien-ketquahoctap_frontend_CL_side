'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  labelPosition = 'right'
}) => {
  const sizes = {
    sm: {
      track: 'w-8 h-5',
      thumb: 'w-3. 5 h-3.5',
      translate: 'translate-x-3.5'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate:  'translate-x-5'
    },
    lg:  {
      track: 'w-14 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-7'
    }
  };

  const handleClick = () => {
    if (! disabled) {
      onChange(!checked);
    }
  };

  const toggleButton = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex flex-shrink-0 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        ${sizes[size].track}
        ${checked ? 'bg-red-700' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-md
          transform transition-transform duration-200 ease-in-out
          ${sizes[size].thumb}
          ${checked ? sizes[size].translate : 'translate-x-1'}
        `}
      />
    </button>
  );

  if (! label) {
    return toggleButton;
  }

  return (
    <label className={`
      flex items-start gap-3 cursor-pointer
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${labelPosition === 'left' ? 'flex-row-reverse justify-end' : ''}
    `}>
      {toggleButton}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <span className="text-sm text-gray-500 mt-0.5">{description}</span>
        )}
      </div>
    </label>
  );
};

export default Toggle;