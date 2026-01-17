'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCheck,
  faSearch,
  faTimes,
  faExclamationCircle,
  faCheckCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Types
export interface SelectOption {
  value: string | number;
  label: string;
  icon?: IconDefinition;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  maxHeight?: number;
  noOptionsMessage?: string;
  searchPlaceholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn một tùy chọn.. .',
  label,
  helperText,
  error,
  success,
  disabled = false,
  loading = false,
  searchable = false,
  clearable = false,
  multiple = false,
  size = 'md',
  fullWidth = false,
  maxHeight = 280,
  noOptionsMessage = 'Không có tùy chọn nào',
  searchPlaceholder = 'Tìm kiếm...',
  required = false,
  name,
  id,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Lọc options theo search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchQuery. toLowerCase())
  );

  // Nhóm options theo group
  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  // Lấy selected options
  const getSelectedOptions = useCallback(() => {
    if (multiple && Array.isArray(value)) {
      return options.filter(opt => value.includes(opt.value));
    }
    return options.filter(opt => opt.value === value);
  }, [options, value, multiple]);

  const selectedOptions = getSelectedOptions();

  // Kiểm tra option có được chọn không
  const isSelected = (optionValue: string | number) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Xử lý chọn option
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = isSelected(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // Xử lý clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
    setSearchQuery('');
  };

  // Xử lý remove tag (multiple)
  const handleRemoveTag = (e: React.MouseEvent, optionValue: string | number) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter(v => v !== optionValue));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const flatOptions = Object.values(groupedOptions).flat();
          const option = flatOptions[highlightedIndex];
          if (option && !option.disabled) {
            handleSelect(option);
          }
        } else {
          setIsOpen(true);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (! isOpen) {
          setIsOpen(true);
        } else {
          const flatOptions = Object.values(groupedOptions).flat();
          setHighlightedIndex(prev => 
            prev < flatOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      
      case 'ArrowUp':
        e. preventDefault();
        if (isOpen) {
          const flatOptions = Object.values(groupedOptions).flat();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : flatOptions.length - 1
          );
        }
        break;
      
      case 'Backspace':
        if (multiple && searchQuery === '' && Array.isArray(value) && value.length > 0) {
          onChange?.(value. slice(0, -1));
        }
        break;
    }
  };

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto scroll to highlighted option
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Focus input when open
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Sizes
  const sizes = {
    sm: {
      trigger: 'min-h-9 py-1.5 text-sm',
      tag: 'text-xs px-2 py-0.5',
      option: 'px-3 py-2 text-sm min-h-9',
      icon: 'text-sm'
    },
    md: {
      trigger: 'min-h-11 py-2.5 text-sm',
      tag: 'text-sm px-2.5 py-1',
      option: 'px-4 py-2.5 text-sm min-h-9',
      icon: 'text-sm'
    },
    lg: {
      trigger: 'min-h-13 py-3 text-base',
      tag: 'text-sm px-3 py-1.5',
      option: 'px-4 py-3 text-base min-h-9',
      icon: 'text-base'
    }
  };

  // State styles
  const getStateStyles = () => {
    if (disabled) return 'border-gray-200 bg-gray-100 cursor-not-allowed';
    if (error) return 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200';
    if (success) return 'border-green-500 focus-within:border-green-500 focus-within:ring-green-200';
    if (isOpen) return 'border-red-500 ring-2 ring-red-100';
    return 'border-gray-300 hover:border-gray-400 focus-within:border-red-500 focus-within:ring-red-100';
  };

  // Render selected value display
  const renderSelectedValue = () => {
    if (loading) {
      return (
        <div className="flex items-center text-gray-400">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          <span>Đang tải... </span>
        </div>
      );
    }

    if (multiple && selectedOptions.length > 0) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions. map(option => (
            <span
              key={option.value}
              className={`
                inline-flex items-center gap-1 bg-red-100 text-red-700 rounded-lg
                ${sizes[size].tag}
              `}
            >
              {option.icon && <FontAwesomeIcon icon={option.icon} className="text-xs" />}
              <span className="truncate max-w-24">{option.label}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveTag(e, option.value)}
                className="ml-0.5 hover:text-red-900 focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      );
    }

    if (! multiple && selectedOptions.length > 0) {
      const option = selectedOptions[0];
      return (
        <div className="flex items-center gap-2 text-gray-900">
          {option.icon && (
            <FontAwesomeIcon icon={option.icon} className="text-gray-500" />
          )}
          <span className="truncate">{option.label}</span>
        </div>
      );
    }

    return <span className="text-gray-400">{placeholder}</span>;
  };

  // Render option
  const renderOption = (option:  SelectOption, index: number) => {
    const selected = isSelected(option.value);
    const highlighted = index === highlightedIndex;

    return (
      <li
        key={option.value}
        role="option"
        aria-selected={selected}
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
        className={`
          ${sizes[size].option}
          flex items-center justify-between gap-3 cursor-pointer
          transition-colors duration-150
          ${option.disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-50' 
            : highlighted
              ? 'bg-red-50 text-red-700'
              : selected
                ? 'bg-red-50/50'
                : 'hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          {option.icon && (
            <FontAwesomeIcon 
              icon={option.icon} 
              className={`flex-shrink-0 ${selected ? 'text-red-700' : 'text-gray-400'}`}
            />
          )}
          <div className="min-w-0">
            <div className={`truncate font-medium ${selected ? 'text-red-700' : 'text-gray-900'}`}>
              {option.label}
            </div>
            {option.description && (
              <div className="text-xs text-gray-500 truncate mt-0.5">
                {option. description}
              </div>
            )}
          </div>
        </div>
        
        {selected && (
          <FontAwesomeIcon 
            icon={faCheck} 
            className="flex-shrink-0 text-red-700" 
          />
        )}
      </li>
    );
  };

  // Render dropdown content
  const renderDropdownContent = () => {
    let optionIndex = -1;

    return (
      <>
        {/* Search input */}
        {searchable && (
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus: border-red-500 focus:ring-1 focus:ring-red-100 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Options list */}
        <ul
          ref={listRef}
          role="listbox"
          aria-multiselectable={multiple}
          className="overflow-y-auto"
          style={{ maxHeight }}
        >
          {Object. keys(groupedOptions).length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">
              <FontAwesomeIcon icon={faSearch} className="text-2xl text-gray-300 mb-2 block" />
              {noOptionsMessage}
            </li>
          ) : (
            Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <React.Fragment key={group || 'default'}>
                {group && (
                  <li className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
                    {group}
                  </li>
                )}
                {groupOptions.map(option => {
                  optionIndex++;
                  return renderOption(option, optionIndex);
                })}
              </React.Fragment>
            ))
          )}
        </ul>

        {/* Selected count for multiple */}
        {multiple && selectedOptions.length > 0 && (
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <span>Đã chọn {selectedOptions.length} mục</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div 
      className={`relative ${fullWidth ? 'w-full' : 'w-72'} ${className}`}
      ref={containerRef}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${selectId}-listbox`}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && ! loading && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          relative w-full px-4 bg-white border rounded-xl cursor-pointer
          transition-all duration-200
          focus:outline-none focus:ring-2
          ${sizes[size].trigger}
          ${getStateStyles()}
          ${className}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {renderSelectedValue()}
          </div>

          <div className="flex items-center gap-1. 5 flex-shrink-0">
            {/* Clear button */}
            {clearable && ! disabled && ! loading && (
              (multiple ?  (Array.isArray(value) && value.length > 0) : value) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover: text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              )
            )}

            {/* Status icon */}
            {error && ! isOpen && (
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
            )}
            {success && !isOpen && ! error && (
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            )}

            {/* Dropdown icon */}
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`
                text-gray-400 transition-transform duration-200
                ${isOpen ? 'rotate-180' :  ''}
              `}
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <div
        id={`${selectId}-listbox`}
        className={`
          absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg
          transition-all duration-200 origin-top
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            :  'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        {renderDropdownContent()}
      </div>

      {/* Helper/Error text */}
      {(helperText || error || success) && (
        <p className={`mt-2 text-sm ${
          error ? 'text-red-600' : 
          success ? 'text-green-600' :
          'text-gray-500'
        }`}>
          {error || success || helperText}
        </p>
      )}

      {/* Hidden input for form */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={multiple && Array.isArray(value) ? value.join(',') : String(value || '')}
        />
      )}
    </div>
  );
};

export default Select;