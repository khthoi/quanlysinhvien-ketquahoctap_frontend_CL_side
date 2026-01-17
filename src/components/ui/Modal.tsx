'use client';

import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: IconDefinition;
  iconColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconColor = 'bg-red-100 text-red-700',
  size = 'md',
  closeOnOverlayClick = false,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  footer
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`
            relative w-full ${sizes[size]}
            bg-white rounded-2xl shadow-2xl
            transform transition-all duration-300
            animate-in fade-in zoom-in-95
          `}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-700 flex items-center justify-center transition-colors z-10"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          )}

          {/* Header */}
          {(title || icon) && (
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className={`w-10 h-10 ${iconColor} rounded-xl flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} className="text-lg" />
                  </div>
                )}

                {title && (
                  <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                    {title}
                  </h2>
                )}
              </div>

              {description && (
                <p className="mt-2 text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Body */}
          <div className={`px-6 ${title || icon ? 'pb-6' : 'py-6'}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;