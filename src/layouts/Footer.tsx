'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faChevronRight,
  faGlobe,
  faHeart,
  faArrowUp,
  faPaperPlane,
  faUniversity,
  faBook,
  faUsers,
  faNewspaper,
  faAward,
  faHandshake,
  faShieldAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faYoutube,
  faTiktok,
  faInstagram,
  faLinkedinIn,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle newsletter submit
  const handleNewsletterSubmit = (e:  React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  // Quick links
  const quickLinks = [
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Tuyển sinh', href: '/tuyen-sinh' },
    { label: 'Đào tạo', href: '/dao-tao' },
    { label: 'Nghiên cứu khoa học', href: '/nghien-cuu' },
    { label: 'Tin tức & Sự kiện', href: '/tin-tuc' },
    { label: 'Liên hệ', href: '/lien-he' }
  ];

  // Student links
  const studentLinks = [
    { label:  'Cổng sinh viên', href: '/dashboard' },
    { label: 'Tra cứu điểm', href: '/ket-qua' },
    { label:  'Đăng ký học phần', href: '/dang-ky-hoc-phan' },
    { label: 'Thời khóa biểu', href:  '/lich-hoc' },
    { label: 'Thư viện điện tử', href: '/thu-vien' },
    { label: 'Học bổng & Hỗ trợ', href: '/hoc-bong' }
  ];

  // Resources
  const resourceLinks = [
    { label: 'Biểu mẫu sinh viên', href: '/bieu-mau' },
    { label: 'Quy chế đào tạo', href: '/quy-che' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label:  'Hỗ trợ trực tuyến', href: '/ho-tro' },
    { label: 'Cơ hội việc làm', href: '/viec-lam' },
    { label: 'Hợp tác doanh nghiệp', href: '/doi-tac' }
  ];

  // Social links
  const socialLinks = [
    { icon: faFacebookF, href: 'https://facebook.com', label: 'Facebook', hoverColor: 'hover:bg-blue-600 hover:border-blue-600' },
    { icon: faYoutube, href: 'https://youtube.com', label: 'YouTube', hoverColor: 'hover: bg-red-600 hover: border-red-600' },
    { icon: faTiktok, href: 'https://tiktok.com', label: 'TikTok', hoverColor: 'hover:bg-gray-800 hover:border-gray-800' },
    { icon: faInstagram, href:  'https://instagram.com', label: 'Instagram', hoverColor: 'hover:bg-pink-600 hover:border-pink-600' },
    { icon: faLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn', hoverColor: 'hover: bg-blue-700 hover: border-blue-700' },
    { icon: faTwitter, href: 'https://twitter.com', label: 'Twitter', hoverColor: 'hover: bg-sky-500 hover: border-sky-500' }
  ];

  // Stats
  const stats = [
    { value: '60+', label: 'Năm thành lập', icon: faUniversity },
    { value: '20K+', label: 'Sinh viên', icon: faUsers },
    { value: '500+', label: 'Giảng viên', icon: faGraduationCap },
    { value: '50+', label: 'Ngành đào tạo', icon: faBook }
  ];

  return (
    <footer className="relative">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700"></div>

      {/* Stats Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 bg-white border-2 border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:border-red-300 group-hover:shadow-md transition-all">
                  <FontAwesomeIcon icon={stat. icon} className="text-xl text-red-700" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat. label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 group mb-6">
                <div className="w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center group-hover:bg-red-800 transition-colors shadow-md">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">
                    ĐẠI HỌC THỦ ĐÔ HÀ NỘI
                  </h2>
                  <p className="text-xs text-red-700 font-medium">HANOI METROPOLITAN UNIVERSITY</p>
                </div>
              </a>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Trường Đại học Thủ đô Hà Nội là cơ sở giáo dục đại học công lập, đào tạo nguồn nhân lực 
                chất lượng cao phục vụ sự nghiệp phát triển Thủ đô và đất nước. 
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-600 hover:text-red-700 transition-colors group"
                >
                  <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-700 text-sm" />
                  </div>
                  <span className="text-sm pt-2">98 Dương Quảng Hàm, Cầu Giấy, Hà Nội</span>
                </a>

                <a 
                  href="tel:02438340740"
                  className="flex items-center space-x-3 text-gray-600 hover:text-red-700 transition-colors group"
                >
                  <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <FontAwesomeIcon icon={faPhone} className="text-red-700 text-sm" />
                  </div>
                  <span className="text-sm">(024) 3834 0740</span>
                </a>

                <a 
                  href="mailto:info@hnmu.edu.vn"
                  className="flex items-center space-x-3 text-gray-600 hover:text-red-700 transition-colors group"
                >
                  <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <FontAwesomeIcon icon={faEnvelope} className="text-red-700 text-sm" />
                  </div>
                  <span className="text-sm">info@hnmu.edu.vn</span>
                </a>

                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-red-700 text-sm" />
                  </div>
                  <span className="text-sm">Thứ 2 - Thứ 6: 7:30 - 17:00</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg: col-span-2">
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <span className="w-1. 5 h-5 bg-red-700 rounded-full mr-3"></span>
                Liên kết nhanh
              </h3>
              <ul className="space-y-2.5">
                {quickLinks. map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-red-700 text-sm flex items-center space-x-2 transition-colors group"
                    >
                      <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-[10px] text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" 
                      />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Student Links */}
            <div className="lg:col-span-2">
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <span className="w-1.5 h-5 bg-red-700 rounded-full mr-3"></span>
                Dành cho sinh viên
              </h3>
              <ul className="space-y-2.5">
                {studentLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-red-700 text-sm flex items-center space-x-2 transition-colors group"
                    >
                      <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-[10px] text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" 
                      />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <span className="w-1.5 h-5 bg-red-700 rounded-full mr-3"></span>
                Tài nguyên
              </h3>
              <ul className="space-y-2.5">
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-red-700 text-sm flex items-center space-x-2 transition-colors group"
                    >
                      <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-[10px] text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" 
                      />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="lg:col-span-2">
              <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                <span className="w-1.5 h-5 bg-red-700 rounded-full mr-3"></span>
                Đăng ký nhận tin
              </h3>

              {/* Newsletter */}
              <p className="text-gray-600 text-sm mb-4">
                Nhận thông tin mới nhất về tuyển sinh và hoạt động của trường
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus: border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-700 hover:bg-red-800 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  </button>
                </div>
                {isSubscribed && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Đăng ký thành công!
                  </p>
                )}
              </form>

              {/* Social Links */}
              <p className="text-gray-900 font-medium text-sm mb-3">Theo dõi chúng tôi</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social. href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-white ${social.hoverColor} transition-all`}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Certifications */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faAward} className="text-red-700 text-sm" />
                </div>
                <span className="text-sm font-medium">ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-red-700 text-sm" />
                </div>
                <span className="text-sm font-medium">Kiểm định chất lượng</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faHandshake} className="text-red-700 text-sm" />
                </div>
                <span className="text-sm font-medium">Hợp tác quốc tế</span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-lg text-sm text-red-700 font-medium transition-colors">
                <FontAwesomeIcon icon={faGlobe} className="text-xs" />
                Tiếng Việt
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-sm text-gray-600 transition-colors">
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} <span className="text-gray-700 font-medium">Đại học Thủ Đô Hà Nội</span>.  
              Tất cả quyền được bảo lưu. 
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="/chinh-sach-bao-mat" className="text-gray-500 hover:text-red-700 transition-colors">
                Chính sách bảo mật
              </a>
              <span className="text-gray-300">|</span>
              <a href="/dieu-khoan-su-dung" className="text-gray-500 hover:text-red-700 transition-colors">
                Điều khoản sử dụng
              </a>
              <span className="text-gray-300">|</span>
              <a href="/sitemap" className="text-gray-500 hover:text-red-700 transition-colors">
                Sitemap
              </a>
            </div>

            {/* Made with love */}
            <div className="text-gray-500 text-sm flex items-center gap-1.5">
              Made with 
              <FontAwesomeIcon icon={faHeart} className="text-red-500" /> 
              in Hanoi
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-xl shadow-lg hover:shadow-xl transition-all z-40 group"
        aria-label="Scroll to top"
      >
        <FontAwesomeIcon
          icon={faArrowUp}
          className="group-hover:-translate-y-0.5 transition-transform"
        />
      </button>
    </footer>
  );
};

export default AppFooter;