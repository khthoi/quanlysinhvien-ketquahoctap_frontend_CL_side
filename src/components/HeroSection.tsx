'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faBook,
  faUsers,
  faAward,
  faArrowRight,
  faPlay
} from '@fortawesome/free-solid-svg-icons';

const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative bg-white min-h-screen pt-20 md:pt-28">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                <FontAwesomeIcon icon={faGraduationCap} className="text-red-700" />
                Chào mừng đến với HNMU
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Đại học Thủ Đô
                <span className="block text-red-700">Hà Nội</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nơi ươm mầm tri thức, kiến tạo tương lai. Với hơn 60 năm xây dựng
                và phát triển, chúng tôi tự hào là một trong những trường đại học
                hàng đầu về đào tạo nguồn nhân lực chất lượng cao cho Thủ đô và cả nước.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo('contact')}
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center space-x-2"
              >
                <span>Đăng ký tuyển sinh</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button
                onClick={() => scrollTo('about-video')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-red-700 hover:text-red-700 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlay} />
                <span>Xem video giới thiệu</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">60+</div>
                <div className="text-sm text-gray-500">Năm thành lập</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">20K+</div>
                <div className="text-sm text-gray-500">Sinh viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">500+</div>
                <div className="text-sm text-gray-500">Giảng viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">50+</div>
                <div className="text-sm text-gray-500">Ngành đào tạo</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-6 items-stretch">
            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faGraduationCap} className="text-red-700 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Chương trình đào tạo</h3>
              <p className="text-sm text-gray-500">
                Đa dạng ngành học từ sư phạm, kinh tế đến công nghệ thông tin
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBook} className="text-blue-700 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thư viện hiện đại</h3>
              <p className="text-sm text-gray-500">
                Hệ thống thư viện số với hàng triệu tài liệu học thuật
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-green-700 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cộng đồng sinh viên</h3>
              <p className="text-sm text-gray-500">
                Môi trường học tập năng động với nhiều CLB, hoạt động
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faAward} className="text-yellow-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thành tựu nổi bật</h3>
              <p className="text-sm text-gray-500">
                Nhiều giải thưởng quốc gia và quốc tế về nghiên cứu khoa học
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-gray-100 border-l-4 border-red-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="bg-red-700 text-white px-3 py-1 rounded text-sm font-bold animate-pulse">HOT</span>
              <span className="text-gray-800 font-medium">Thông báo tuyển sinh năm học 2026-2027 đã được công bố!</span>
            </div>
            <button
              onClick={() => scrollTo('contact')}
              className="text-red-700 hover:text-red-800 font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;