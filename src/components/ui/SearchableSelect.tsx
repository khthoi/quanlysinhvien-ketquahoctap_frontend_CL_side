'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faChevronDown,
    faTimes,
    faCheck,
    faExclamationCircle,
    faCheckCircle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Types
export interface SearchableSelectOption {
    value: string | number;
    label: string;
    description?: string;
    icon?: IconDefinition;
    disabled?: boolean;
    group?: string;
}

export interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    helperText?: string;
    error?: string;
    success?: string;
    disabled?: boolean;
    loading?: boolean;
    clearable?: boolean;
    required?: boolean;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    maxDisplayOptions?: number;
    searchPlaceholder?: string;
    noResultsMessage?: string;
    name?: string;
    id?: string;
    className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
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
    clearable = true,
    required = false,
    size = 'md',
    fullWidth = false,
    maxDisplayOptions = 50,
    searchPlaceholder = 'Tìm kiếm...',
    noResultsMessage = 'Không tìm thấy kết quả',
    name,
    id,
    className = ''
}) => {
    // States
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const [isPositioned, setIsPositioned] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selectId = id || `searchable-select-${Math.random().toString(36).substr(2, 9)}`;

    // Check mounted for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Filtered options
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options;

        const lowerSearch = searchTerm.toLowerCase();
        return options.filter(
            option =>
                option.label.toLowerCase().includes(lowerSearch) ||
                option.description?.toLowerCase().includes(lowerSearch) ||
                String(option.value).toLowerCase().includes(lowerSearch)
        );
    }, [options, searchTerm]);

    // Grouped options
    const groupedOptions = useMemo(() => {
        const groups: Record<string, SearchableSelectOption[]> = {};

        filteredOptions.slice(0, maxDisplayOptions).forEach(option => {
            const group = option.group || '';
            if (!groups[group]) groups[group] = [];
            groups[group].push(option);
        });

        return groups;
    }, [filteredOptions, maxDisplayOptions]);

    // Get flat options for keyboard navigation
    const flatOptions = useMemo(() => {
        return Object.values(groupedOptions).flat();
    }, [groupedOptions]);

    // Has more options
    const hasMoreOptions = filteredOptions.length > maxDisplayOptions;

    // Get selected option
    const selectedOption = useMemo(() => {
        // Treat 0, null, undefined, empty string as no value
        if (value === 0 || value === null || value === undefined || value === '') {
            return undefined;
        }
        return options.find(opt => opt.value === value);
    }, [options, value]);

    // Calculate dropdown position
    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const dropdownHeight = 350; // Approximate max height
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top: number;
        let direction: 'down' | 'up' = 'down';

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            // Show above
            top = rect.top - 8;
            direction = 'up';
        } else {
            // Show below
            top = rect.bottom + 8;
            direction = 'down';
        }

        let left = rect.left;
        const width = rect.width;

        // Ensure not overflow horizontally
        if (left < 8) left = 8;
        if (left + width > window.innerWidth - 8) {
            left = window.innerWidth - width - 8;
        }

        setPosition({ top, left, width });
        setDropdownDirection(direction);
        setIsPositioned(true);
    }, []);

    // Update position when open
    useEffect(() => {
        if (isOpen && mounted) {
            const timer = requestAnimationFrame(() => {
                calculatePosition();

                // Recalculate after dropdown renders
                requestAnimationFrame(() => {
                    if (dropdownRef.current && triggerRef.current) {
                        const rect = triggerRef.current.getBoundingClientRect();
                        const dropdownRect = dropdownRef.current.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const spaceAbove = rect.top;

                        let top: number;
                        let direction: 'down' | 'up' = 'down';

                        if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
                            top = rect.top - dropdownRect.height - 8;
                            direction = 'up';
                        } else {
                            top = rect.bottom + 8;
                            direction = 'down';
                        }

                        setPosition(prev => prev ? { ...prev, top } : null);
                        setDropdownDirection(direction);
                    }
                });
            });

            return () => cancelAnimationFrame(timer);
        }
    }, [isOpen, mounted, calculatePosition]);

    // Reset states when closed
    useEffect(() => {
        if (!isOpen) {
            setPosition(null);
            setIsPositioned(false);
            setSearchTerm('');
            setHighlightedIndex(-1);
        }
    }, [isOpen]);

    // Click outside handler
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
            const isOutsideDropdown = !dropdownRef.current || !dropdownRef.current.contains(target);

            if (isOutsideContainer && isOutsideDropdown) {
                setIsOpen(false);
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Scroll handler - close dropdown
    useEffect(() => {
        if (!isOpen) return;

        const handleScroll = (e: Event) => {
            if (dropdownRef.current?.contains(e.target as Node)) return;
            setIsOpen(false);
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && isPositioned && inputRef.current) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isPositioned]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled || loading) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (isOpen && highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
                    const option = flatOptions[highlightedIndex];
                    if (!option.disabled) {
                        handleSelect(option.value);
                    }
                } else if (!isOpen) {
                    setIsOpen(true);
                }
                break;

            case 'Escape':
                setIsOpen(false);
                triggerRef.current?.focus();
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex(prev =>
                        prev < flatOptions.length - 1 ? prev + 1 : 0
                    );
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex(prev =>
                        prev > 0 ? prev - 1 : flatOptions.length - 1
                    );
                }
                break;

            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                }
                break;
        }
    };

    // Handle select
    const handleSelect = (optionValue: string | number) => {
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchTerm('');
        triggerRef.current?.focus();
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onChange?.('');
        setSearchTerm('');
    };

    // Handle toggle
    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !loading) {
            setIsOpen(prev => !prev);
        }
    };

    // Sizes
    const sizes = {
        sm: {
            trigger: 'h-9 text-sm',
            input: 'h-8 text-sm',
            option: 'px-3 py-2 text-sm',
            icon: 'text-sm'
        },
        md: {
            trigger: 'h-11 text-sm',
            input: 'h-9 text-sm',
            option: 'px-4 py-2.5 text-sm',
            icon: 'text-sm'
        },
        lg: {
            trigger: 'h-13 text-base',
            input: 'h-10 text-base',
            option: 'px-4 py-3 text-base',
            icon: 'text-base'
        }
    };

    // State styles
    const getStateStyles = () => {
        if (disabled) return 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60';
        if (error) return 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200';
        if (success) return 'border-green-500 focus-within:border-green-500 focus-within:ring-green-200';
        if (isOpen) return 'border-red-500 ring-2 ring-red-100';
        return 'border-gray-300 hover:border-gray-400 focus-within:border-red-500 focus-within:ring-red-100';
    };

    // Render dropdown
    const renderDropdown = () => {
        if (!isOpen || !mounted) return null;

        const dropdownStyle: React.CSSProperties = {
            position: 'fixed',
            top: dropdownDirection === 'up' ? 'auto' : position?.top ?? -9999,
            bottom: dropdownDirection === 'up' && position ? window.innerHeight - position.top : 'auto',
            left: position?.left ?? -9999,
            width: position?.width ?? 'auto',
            visibility: isPositioned ? 'visible' : 'hidden',
            opacity: isPositioned ? 1 : 0,
            zIndex: 99999
        };

        return createPortal(
            <div
                ref={dropdownRef}
                style={dropdownStyle}
                className={`
          bg-white border border-gray-200 rounded-xl shadow-xl
          transition-opacity duration-150
          ${dropdownDirection === 'up' ? 'origin-bottom' : 'origin-top'}
        `}
            >
                {/* Search Input */}
                <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setHighlightedIndex(-1);
                            }}
                            onKeyDown={handleKeyDown}
                            onMouseDown={(e) => e.stopPropagation()}
                            placeholder={searchPlaceholder}
                            className={`
                w-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg
                placeholder-gray-400 text-gray-900
                focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white
                transition-all duration-200
                ${sizes[size].input}
              `}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                onMouseDown={(e) => e.preventDefault()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-sm" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Options List */}
                <div
                    ref={listRef}
                    className="max-h-64 overflow-y-auto py-1 scroll-smooth"
                    role="listbox"
                >
                    {Object.keys(groupedOptions).length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <FontAwesomeIcon icon={faSearch} className="text-3xl text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm">{noResultsMessage}</p>
                        </div>
                    ) : (
                        <>
                            {Object.entries(groupedOptions).map(([group, groupOptions], groupIndex) => {
                                // Calculate starting index for this group
                                let startIndex = 0;
                                Object.entries(groupedOptions).slice(0, groupIndex).forEach(([, opts]) => {
                                    startIndex += opts.length;
                                });

                                return (
                                    <div key={group || 'default'}>
                                        {/* Group Header */}
                                        {group && (
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
                                                {group}
                                            </div>
                                        )}

                                        {/* Group Options */}
                                        {groupOptions.map((option, optionIndex) => {
                                            const flatIndex = startIndex + optionIndex;
                                            const isSelected = option.value === value;
                                            const isHighlighted = flatIndex === highlightedIndex;

                                            return (
                                                <div
                                                    key={option.value}
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => !option.disabled && handleSelect(option.value)}
                                                    onMouseEnter={() => !option.disabled && setHighlightedIndex(flatIndex)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    className={`
                            ${sizes[size].option}
                            flex items-center justify-between gap-3 cursor-pointer
                            transition-colors duration-100
                            ${option.disabled
                                                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                                            : isHighlighted
                                                                ? 'bg-red-50 text-red-700'
                                                                : isSelected
                                                                    ? 'bg-red-50/50'
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                        }
                          `}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        {option.icon && (
                                                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                ${isSelected || isHighlighted ? 'bg-red-100' : 'bg-gray-100'}
                              `}>
                                                                <FontAwesomeIcon
                                                                    icon={option.icon}
                                                                    className={`text-sm ${isSelected || isHighlighted ? 'text-red-700' : 'text-gray-500'}`}
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className={`
                                truncate font-medium
                                ${isSelected || isHighlighted ? 'text-red-700' : 'text-gray-900'}
                              `}>
                                                                {option.label}
                                                            </p>
                                                            {option.description && (
                                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                                    {option.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <FontAwesomeIcon
                                                            icon={faCheck}
                                                            className="text-red-700 flex-shrink-0"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}

                            {/* More options indicator */}
                            {hasMoreOptions && (
                                <div className="px-4 py-3 text-center border-t border-gray-100 bg-gray-50">
                                    <p className="text-sm text-gray-500">
                                        Còn {filteredOptions.length - maxDisplayOptions} kết quả khác
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Nhập thêm để thu hẹp kết quả
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Selected count */}
                {value && value !== 0 && value !== '' && selectedOption && (
                    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
                        Đã chọn: <span className="font-medium text-red-700">{selectedOption.label}</span>
                    </div>
                )}
            </div>,
            document.body
        );
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${fullWidth ? 'w-full' : 'w-72'} ${className}`}
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

            {/* Trigger Button */}
            <button
                ref={triggerRef}
                id={selectId}
                type="button"
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                disabled={disabled || loading}
                className={`
          relative w-full px-4 bg-white border rounded-xl text-left
          transition-all duration-200
          focus:outline-none focus:ring-2
          ${sizes[size].trigger}
          ${getStateStyles()}
        `}
            >
                {/* Selected Value Display */}
                <span className={`
          block truncate pr-8
          ${selectedOption ? 'text-gray-900' : 'text-gray-600'}
        `}>
                    {loading ? (
                        <span className="flex items-center">
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                            Đang tải...
                        </span>
                    ) : selectedOption ? (
                        <span className="flex items-center gap-2">
                            {selectedOption.icon && (
                                <FontAwesomeIcon icon={selectedOption.icon} className="text-gray-500" />
                            )}
                            <span className="truncate">{selectedOption.label}</span>
                        </span>
                    ) : (
                        <span className="text-gray-600">{placeholder}</span>
                    )}
                </span>

                {/* Right Icons */}
                <span className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                    {/* Clear Button */}
                    {clearable && value && value !== 0 && value !== '' && !disabled && !loading && (
                        <span
                            onClick={handleClear}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-sm" />
                        </span>
                    )}

                    {/* Status Icons */}
                    {error && !isOpen && (
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                    )}
                    {success && !error && !isOpen && (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    )}

                    {/* Chevron */}
                    {!loading && (
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`
                text-gray-400 transition-transform duration-200
                ${isOpen ? 'rotate-180' : ''}
              `}
                        />
                    )}
                </span>
            </button>

            {/* Dropdown Portal */}
            {renderDropdown()}

            {/* Helper/Error Text */}
            {(helperText || error || success) && (
                <p className={`mt-2 text-sm ${error ? 'text-red-600' :
                        success ? 'text-green-600' :
                            'text-gray-500'
                    }`}>
                    {error || success || helperText}
                </p>
            )}

            {/* Hidden Input for Forms */}
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={value ?? ''}
                />
            )}
        </div>
    );
};

export default SearchableSelect;