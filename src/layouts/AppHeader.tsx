"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faUser,
  faSignInAlt,
  faBars,
  faTimes,
  faSearch,
  faGlobe,
  faClock,
  faUserCircle,
  faIdCard,
  faTachometerAlt,
  faSignOutAlt,
  faChevronDown,
  faUserGraduate,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faYoutube,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import router from 'next/router';

// Interface cho thông tin sinh viên
interface SinhVienProfile {
  id: number;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  email: string;
  sdt: string;
  ngayNhapHoc: string;
  tinhTrang: string;
  lop: {
    id: number;
    maLop: string;
    tenLop: string;
    nganh: {
      id: number;
      maNganh:  string;
      tenNganh: string;
      moTa: string;
      khoa:  {
        id: number;
        maKhoa: string;
        tenKhoa: string;
        moTa: string;
        ngayThanhLap: string;
      };
    };
    nienKhoa: {
      id: number;
      maNienKhoa: string;
      tenNienKhoa: string;
      namBatDau: number;
      namKetThuc: number;
      moTa: string;
    };
  };
  khenThuongKyLuat: any[];
}

// Interface cho JWT payload
interface JWTPayload {
  sub: string;
  vaiTro: string;
  exp: number;
  iat: number;
}

const AppHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<SinhVienProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hàm lấy cookie theo tên
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  // Hàm xóa cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Hàm decode JWT token
  const decodeJWT = (token: string): JWTPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c. charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Hàm redirect đến login
  const redirectToLogin = () => {
    deleteCookie('access_token');
    setIsAuthenticated(false);
    setUserProfile(null);
    router.push('/login');
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    deleteCookie('access_token');
    setIsAuthenticated(false);
    setUserProfile(null);
    setIsDropdownOpen(false);
    router.push('/login');
  };

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      const accessToken = getCookie('access_token');
      
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Decode token
      const payload = decodeJWT(accessToken);
      
      if (!payload) {
        redirectToLogin();
        return;
      }

      // Kiểm tra token hết hạn
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        console.log('Token expired');
        redirectToLogin();
        return;
      }

      // Kiểm tra vai trò
      if (payload.vaiTro !== 'SINH_VIEN') {
        console.log('Invalid role:', payload.vaiTro);
        redirectToLogin();
        return;
      }

      // Fetch thông tin sinh viên
      try {
        const response = await fetch('http://localhost:3000/sinh-vien/me/my-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData:  SinhVienProfile = await response.json();
        setUserProfile(profileData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Không redirect, chỉ set authenticated = false
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event:  MouseEvent) => {
      if (dropdownRef.current && ! dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsDropdownOpen(false); // Đóng dropdown khi scroll
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Trang chủ', href: '/', active: true },
    { label:  'Giới thiệu', href: '#about' },
    { label: 'Đào tạo', href: '#programs' },
    { label: 'Tuyển sinh', href: '#admission' },
    { label: 'Lịch sử', href: '#history' },
    { label: 'Thành tựu', href: '#achievements' },
    { label: 'Liên hệ', href: '#contact' }
  ];

  // Component User Dropdown
  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full transition-all group"
      >
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faUserGraduate} className="text-red-700 text-sm" />
        </div>
        <span className="text-gray-700 font-medium text-sm max-w-32 truncate hidden sm:block">
          {userProfile?.hoTen || 'Sinh viên'}
        </span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' :  ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${
          isDropdownOpen
            ? 'opacity-100 scale-100 translate-y-0'
            :  'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUserGraduate} className="text-red-700 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate">{userProfile?.hoTen}</h4>
              <p className="text-sm text-gray-500 truncate">{userProfile?. maSinhVien}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-1.5" />
              Sinh viên
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <a
            href="/user-profile"
            className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors group"
            onClick={() => setIsDropdownOpen(false)}
          >
            <div className="w-9 h-9 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
              <FontAwesomeIcon icon={faIdCard} className="text-gray-500 group-hover:text-red-700 transition-colors" />
            </div>
            <div>
              <p className="font-medium text-sm">Thông tin cá nhân</p>
              <p className="text-xs text-gray-400">Xem và chỉnh sửa hồ sơ</p>
            </div>
          </a>

          <a
            href="/dashboard"
            className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors group"
            onClick={() => setIsDropdownOpen(false)}
          >
            <div className="w-9 h-9 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
              <FontAwesomeIcon icon={faTachometerAlt} className="text-gray-500 group-hover:text-red-700 transition-colors" />
            </div>
            <div>
              <p className="font-medium text-sm">Bảng điều khiển</p>
              <p className="text-xs text-gray-400">Quản lý học tập</p>
            </div>
          </a>

          <div className="my-2 border-t border-gray-100"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-5 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors group"
          >
            <div className="w-9 h-9 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
              <FontAwesomeIcon icon={faSignOutAlt} className="text-gray-500 group-hover:text-red-700 transition-colors" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Đăng xuất</p>
              <p className="text-xs text-gray-400">Thoát khỏi hệ thống</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Component Mobile User Menu
  const MobileUserMenu = () => (
    <div className="border-t border-gray-100 pt-4 mb-4">
      {/* User Info */}
      <div className="flex items-center space-x-3 px-2 mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faUserGraduate} className="text-red-700 text-xl" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{userProfile?.hoTen}</h4>
          <p className="text-sm text-gray-500">{userProfile?.maSinhVien}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-1" />
            Sinh viên
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <a
          href="/profile"
          className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FontAwesomeIcon icon={faIdCard} className="mr-3 w-5 text-gray-400" />
          <span className="font-medium">Thông tin cá nhân</span>
        </a>

        <a
          href="/dashboard"
          className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 w-5 text-gray-400" />
          <span className="font-medium">Bảng điều khiển</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5 text-gray-400" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top Bar */}
      <div className={`bg-gray-50 border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Left - Contact Info */}
            <div className="hidden md:flex items-center space-x-6 text-gray-600">
              <a href="tel:1900xxxx" className="flex items-center hover:text-red-700 transition-colors">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-red-700 text-xs" />
                <span>1900 xxxx</span>
              </a>
              <a href="mailto:info@hnmu.edu. vn" className="flex items-center hover:text-red-700 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-red-700 text-xs" />
                <span>info@hnmu.edu.vn</span>
              </a>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-red-700 text-xs" />
                <span>T2-T6: 7:30 - 17:00</span>
              </div>
            </div>
            
            {/* Right - Social & Language */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <a href="#" className="w-7 h-7 bg-gray-200 hover:bg-red-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
                </a>
                <a href="#" className="w-7 h-7 bg-gray-200 hover:bg-red-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <FontAwesomeIcon icon={faYoutube} className="text-xs" />
                </a>
                <a href="#" className="w-7 h-7 bg-gray-200 hover:bg-red-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <FontAwesomeIcon icon={faTiktok} className="text-xs" />
                </a>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <button className="flex items-center text-gray-600 hover:text-red-700 transition-colors text-sm">
                <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                <span>VI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-800 transition-colors">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg md:text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                  ĐẠI HỌC THỦ ĐÔ
                </h1>
                <p className="text-xs text-red-700 font-medium">HANOI METROPOLITAN UNIVERSITY</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    link.active
                      ? 'text-red-700 bg-red-50'
                      : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faSearch} />
              </button>

              {/* Auth Section - Desktop */}
              <div className="hidden md:block">
                {isLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-gray-400 animate-spin" />
                  </div>
                ) : isAuthenticated && userProfile ? (
                  <UserDropdown />
                ) : (
                  <div className="flex items-center space-x-3">
                    <a
                      href="/login"
                      className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-red-700 text-red-700 rounded-full font-medium hover:bg-red-700 hover:text-white transition-all"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} />
                      <span>Đăng nhập</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover: text-red-700 flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Nav Links */}
          <nav className="space-y-1 mb-4">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  link.active
                    ? 'text-red-700 bg-red-50'
                    : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <FontAwesomeIcon icon={faSpinner} className="text-gray-400 animate-spin text-2xl" />
            </div>
          ) : isAuthenticated && userProfile ? (
            <MobileUserMenu />
          ) : (
            <>
              {/* Mobile Contact Info */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="space-y-3 text-sm">
                  <a href="tel:1900xxxx" className="flex items-center text-gray-600 hover:text-red-700">
                    <FontAwesomeIcon icon={faPhone} className="mr-3 text-red-700 w-4" />
                    <span>1900 xxxx</span>
                  </a>
                  <a href="mailto:info@hnmu.edu.vn" className="flex items-center text-gray-600 hover:text-red-700">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-red-700 w-4" />
                    <span>info@hnmu.edu.vn</span>
                  </a>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-red-700 w-4" />
                    <span>98 Dương Quảng Hàm, Hà Nội</span>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="space-y-3">
                <a
                  href="/login"
                  className="flex items-center justify-center space-x-2 w-full px-5 py-3 bg-white border-2 border-red-700 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Đăng nhập</span>
                </a>
                <a
                  href="#register"
                  className="flex items-center justify-center space-x-2 w-full px-5 py-3 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Đăng ký xét tuyển</span>
                </a>
              </div>
            </>
          )}

          {/* Mobile Social Links */}
          <div className="flex items-center justify-center space-x-3 mt-4 pt-4 border-t border-gray-100">
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-red-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-red-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-red-700 hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-colors">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;