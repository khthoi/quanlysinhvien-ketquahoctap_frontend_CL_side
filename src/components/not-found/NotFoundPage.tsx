'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faHome,
  faSearch,
  faArrowLeft,
  faBook,
  faUserGraduate,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faCompass,
  faLightbulb,
  faQuestionCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y:  0 });

  // Hiệu ứng parallax nhẹ cho background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = (e: React. FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page or home with query
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const quickLinks = [
    {
      icon: faHome,
      title:  'Trang chủ',
      description: 'Quay về trang chủ HNMU',
      href: '/'
    },
    {
      icon: faUserGraduate,
      title: 'Tuyển sinh',
      description:  'Thông tin tuyển sinh 2026',
      href: '/tuyen-sinh'
    },
    {
      icon: faBook,
      title: 'Chương trình đào tạo',
      description: 'Xem các ngành học',
      href: '/dao-tao'
    },
    {
      icon: faQuestionCircle,
      title:  'Hỗ trợ',
      description: 'Liên hệ hỗ trợ',
      href:  '/lien-he'
    }
  ];

  const suggestions = [
    'Kiểm tra lại đường dẫn URL',
    'Trang có thể đã được di chuyển hoặc xóa',
    'Sử dụng thanh tìm kiếm bên dưới',
    'Quay lại trang chủ và điều hướng lại'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mini */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center space-x-3 group w-fit">
            <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-800 transition-colors">
              <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                ĐẠI HỌC THỦ ĐÔ HÀ NỘI
              </h1>
              <p className="text-xs text-red-700 font-medium">HANOI METROPOLITAN UNIVERSITY</p>
            </div>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 Illustration */}
          <div className="relative mb-8">
            {/* Background Decorations */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
              }}
            >
              <div className="w-64 h-64 md:w-80 md:h-80 bg-red-100 rounded-full opacity-50 blur-3xl"></div>
            </div>
            
            {/* 404 Number */}
            <div className="relative">
              <div className="flex items-center justify-center space-x-2 md:space-x-4">
                <span className="text-8xl md:text-9xl font-bold text-gray-200">4</span>
                <div 
                  className="relative"
                  style={{
                    transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
                  }}
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-200">
                    <FontAwesomeIcon 
                      icon={faCompass} 
                      className="text-red-700 text-4xl md:text-5xl animate-pulse" 
                    />
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xs" />
                  </div>
                </div>
                <span className="text-8xl md:text-9xl font-bold text-gray-200">4</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Oops! Trang không tồn tại
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-10">
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm trên website..."
                  className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none text-gray-900 placeholder-gray-400 shadow-sm"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" 
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="/"
              className="flex items-center space-x-2 px-6 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors shadow-lg hover:shadow-xl"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Về trang chủ</span>
            </a>
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-red-700 hover:text-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Quay lại</span>
            </button>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-12 text-left max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Gợi ý cho bạn</h3>
            </div>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-600">
                  <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Truy cập nhanh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover: border-red-200 hover:shadow-lg transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-red-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <FontAwesomeIcon 
                      icon={link.icon} 
                      className="text-gray-500 group-hover:text-red-700 text-xl transition-colors" 
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 group-hover:text-red-700 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mini */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-600">
              <a href="tel:1900xxxx" className="flex items-center hover:text-red-700 transition-colors">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-red-700" />
                <span>1900 xxxx</span>
              </a>
              <a href="mailto:info@hnmu. edu.vn" className="flex items-center hover:text-red-700 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-red-700" />
                <span>info@hnmu.edu. vn</span>
              </a>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-700" />
                <span>98 Dương Quảng Hàm, Hà Nội</span>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2026 Đại học Thủ Đô Hà Nội. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;