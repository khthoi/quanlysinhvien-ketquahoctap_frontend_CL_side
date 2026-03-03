"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faFlask,
  faGlobe,
  faLaptopCode,
  faBriefcase,
  faHandshake,
  faChalkboardTeacher,
  faBookOpen,
  faArrowRight,
  faCheck,
  faStar,
  faUserGraduate,
  faBuildingColumns,
  faCertificate,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';

const FeatureSection: React.FC = () => {
  // smooth scroll helper for CTA
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const mainFeatures = [
    {
      icon: faGraduationCap,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
      title: 'CTĐT chất lượng cao',
      description: 'Hệ thống chương trình đào tạo được cập nhật theo chuẩn quốc tế, đáp ứng nhu cầu thị trường lao động hiện đại.',
      features: ['Cử nhân chính quy', 'Sau đại học', 'Liên thông', 'Văn bằng 2']
    },
    {
      icon: faFlask,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
      title: 'Nghiên cứu khoa học',
      description: 'Môi trường nghiên cứu năng động với các phòng thí nghiệm hiện đại và đội ngũ giảng viên giàu kinh nghiệm.',
      features: ['Phòng lab hiện đại', 'Đề tài cấp Bộ', 'Hội thảo quốc tế', 'Công bố khoa học']
    },
    {
      icon: faGlobe,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
      title: 'Hợp tác quốc tế',
      description: 'Liên kết với hơn 50 trường đại học và tổ chức giáo dục trên toàn thế giới.',
      features: ['Trao đổi sinh viên', 'Du học tại chỗ', 'Giảng viên quốc tế', 'Chứng chỉ quốc tế']
    },
    {
      icon: faLaptopCode,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
      title: 'Công nghệ thông tin',
      description: 'Đào tạo CNTT theo xu hướng công nghệ 4.0, trang bị kỹ năng thực hành cho sinh viên.',
      features: ['AI & Machine Learning', 'Web Development', 'Mobile App', 'Data Science']
    },
    {
      icon: faBriefcase,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Hỗ trợ việc làm',
      description: 'Kết nối doanh nghiệp, hỗ trợ sinh viên tìm kiếm cơ hội thực tập và việc làm sau tốt nghiệp.',
      features: ['Ngày hội việc làm', 'Kết nối doanh nghiệp', 'Tư vấn nghề nghiệp', 'Thực tập có lương']
    },
    {
      icon: faHandshake,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-700',
      title: 'Hỗ trợ sinh viên',
      description: 'Hệ thống hỗ trợ toàn diện từ học bổng, ký túc xá đến các hoạt động ngoại khóa.',
      features: ['Học bổng đa dạng', 'Ký túc xá', 'CLB sinh viên', 'Tư vấn tâm lý']
    }
  ];

  const achievements = [
    { icon: faUserGraduate, number: '95%', label: 'Sinh viên có việc làm sau 6 tháng tốt nghiệp' },
    { icon: faBuildingColumns, number: 'Top 20', label: 'Trường đại học hàng đầu Việt Nam' },
    { icon: faCertificate, number: '15+', label: 'Chương trình đạt chuẩn AUN-QA' },
    { icon: faStar, number: '4.8/5', label: 'Đánh giá từ sinh viên và cựu sinh viên' }
  ];

  return (
    <section className="bg-white py-20" id="admission">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Tại sao chọn chúng tôi?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Điểm nổi bật của <span className="text-red-700">Đại học Thủ Đô</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Với hơn 60 năm kinh nghiệm đào tạo, chúng tôi tự hào mang đến môi trường
            học tập chất lượng và cơ hội phát triển toàn diện cho sinh viên.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <FontAwesomeIcon icon={feature.icon} className={`${feature.iconColor} text-2xl`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 min-h-[3.5rem] flex items-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed min-h-[6rem]">
                {feature.description}
              </p>
              <ul className="space-y-2 mt-auto">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2 text-xs mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Achievements Banner */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-20 border border-gray-200 shadow-sm">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faTrophy} className="mr-2" />
              Con số ấn tượng
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Thành tựu <span className="text-red-700">nổi bật</span>
            </h3>
            <p className="text-gray-600">Những con số ấn tượng khẳng định chất lượng đào tạo</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors">
                  <FontAwesomeIcon icon={item.icon} className="text-red-700 text-2xl group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{item.number}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-red-100 shadow-lg shadow-red-50">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Sẵn sàng bắt đầu hành trình học tập?
              </h3>
              <p className="text-slate-600">
                Đăng ký ngay để nhận thông tin tuyển sinh và học bổng mới nhất
              </p>
            </div>
              <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('contact')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Đăng ký tư vấn</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;