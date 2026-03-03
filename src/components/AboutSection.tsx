"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity,
  faHistory,
  faEye,
  faBullseye,
  faHeart,
  faUsers,
  faGraduationCap,
  faAward,
  faBookOpen,
  faGlobe,
  faLightbulb,
  faHandshake,
  faChevronRight,
  faQuoteLeft,
  faPlay,
  faMedal,
  faFlag,
  faStar,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const AboutSection: React.FC = () => {
  const coreValues = [
    {
      icon: faLightbulb,
      title: 'Sáng tạo',
      description: 'Khuyến khích tư duy đổi mới và sáng tạo trong giảng dạy và học tập'
    },
    {
      icon: faHandshake,
      title: 'Trách nhiệm',
      description: 'Cam kết chất lượng đào tạo và trách nhiệm với xã hội'
    },
    {
      icon: faHeart,
      title: 'Nhân văn',
      description: 'Đề cao giá trị con người và phát triển toàn diện sinh viên'
    },
    {
      icon: faGlobe,
      title: 'Hội nhập',
      description: 'Tiếp cận tri thức quốc tế, hội nhập với giáo dục thế giới'
    }
  ];

  const milestones = [
    {
      year: '1959',
      title: 'Thành lập trường',
      description: 'Tiền thân là Trường Sư phạm Hà Nội'
    },
    {
      year: '2004',
      title: 'Nâng cấp Cao đẳng',
      description: 'Trở thành Trường Cao đẳng Sư phạm Hà Nội'
    },
    {
      year: '2014',
      title: 'Thành lập Đại học',
      description: 'Chính thức mang tên Đại học Thủ Đô Hà Nội'
    },
    {
      year: '2024',
      title: 'Phát triển vượt bậc',
      description: 'Hơn 50 ngành đào tạo, 20.000+ sinh viên'
    }
  ];

  // detect gender based on Vietnamese name prefixes/simple heuristic
  const detectGender = (fullName: string): 'male' | 'female' => {
    const lower = fullName.toLowerCase();
    if (lower.includes(' thị ') || lower.includes(' hoa ') || lower.includes(' lan ') || lower.includes(' nga ') || lower.includes(' anh ') ) {
      return 'female';
    }
    return 'male';
  };

  const pickColors = (gender: string) => {
    if (gender === 'female') {
      return { bg: 'bg-pink-100', text: 'text-pink-700' };
    }
    return { bg: 'bg-blue-100', text: 'text-blue-700' };
  };

  const leadershipTeam = [
    'PGS. TS. Nguyễn Văn A',
    'PGS. TS. Trần Thị B',
    'TS. Lê Văn C'
  ].map(name => {
    const gender = detectGender(name);
    const colors = pickColors(gender);
    return {
      name,
      position: name === 'PGS. TS. Nguyễn Văn A' ? 'Hiệu trưởng' : 'Phó Hiệu trưởng',
      avatar: gender === 'female' ? '/icons/woman.png' : '/icons/man.png',
      iconBg: colors.bg,
      iconColor: colors.text
    };
  });

  const achievements = [
    { icon: faMedal, label: 'Huân chương Lao động hạng Nhất' },
    { icon: faFlag, label: 'Cờ thi đua Chính phủ' },
    { icon: faAward, label: 'Giải thưởng Chất lượng Quốc gia' },
    { icon: faStar, label: 'Top 20 Đại học Việt Nam' }
  ];

  return (
    <section className="bg-gray-50 py-20" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FontAwesomeIcon icon={faUniversity} className="mr-2" />
            Giới thiệu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Về <span className="text-red-700">Đại học Thủ Đô Hà Nội</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hơn 60 năm xây dựng và phát triển, trường luôn giữ vững sứ mệnh
            đào tạo nguồn nhân lực chất lượng cao cho Thủ đô và đất nước.
          </p>
        </div>

        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Image & Video */}
          <div className="relative">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div id="about-video" className="bg-gray-200 aspect-video flex items-center justify-center relative">
                  <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/gD7BmNA6Pfs"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">Video giới thiệu Đại học Thủ Đô Hà Nội</p>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-red-700 text-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-4xl font-bold">65+</div>
                <div className="text-sm text-red-100">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nơi ươm mầm tri thức, kiến tạo tương lai
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Đại học Thủ Đô Hà Nội (Hanoi Metropolitan University - HNMU) là trường
                đại học công lập trực thuộc UBND Thành phố Hà Nội, có bề dày lịch sử
                hơn 60 năm trong sự nghiệp đào tạo và bồi dưỡng nguồn nhân lực.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Trường hiện đào tạo hơn 50 ngành học thuộc các lĩnh vực: Sư phạm,
                Kinh tế - Quản lý, Công nghệ thông tin, Ngoại ngữ, Văn hóa - Du lịch,
                và nhiều ngành khác với đội ngũ giảng viên có trình độ cao.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <FontAwesomeIcon icon={faGraduationCap} className="text-red-700 text-xl mb-2" />
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">Ngành đào tạo</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <FontAwesomeIcon icon={faUsers} className="text-blue-700 text-xl mb-2" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Giảng viên</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <FontAwesomeIcon icon={faBookOpen} className="text-green-700 text-xl mb-2" />
                <div className="text-2xl font-bold text-gray-900">20K+</div>
                <div className="text-sm text-gray-500">Sinh viên</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <FontAwesomeIcon icon={faGlobe} className="text-purple-700 text-xl mb-2" />
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">Đối tác quốc tế</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faEye} className="text-red-700 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Đến năm 2030, Đại học Thủ Đô Hà Nội trở thành trường đại học đa ngành,
              đa lĩnh vực có uy tín trong nước và khu vực, là địa chỉ tin cậy trong
              đào tạo nguồn nhân lực chất lượng cao cho Thủ đô và cả nước.
            </p>
            <ul className="space-y-2">
              {['Top 15 đại học Việt Nam', 'Đạt chuẩn kiểm định quốc tế', 'Trung tâm NCKH hàng đầu'].map((item, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-700">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover: shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faBullseye} className="text-blue-700 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Đào tạo nguồn nhân lực chất lượng cao, nghiên cứu khoa học và chuyển giao
              công nghệ phục vụ sự phát triển kinh tế - xã hội của Thủ đô Hà Nội và đất nước.
            </p>
            <ul className="space-y-2">
              {['Đào tạo nhân lực chất lượng', 'Nghiên cứu khoa học ứng dụng', 'Phục vụ cộng đồng'].map((item, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-700">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những giá trị nền tảng định hướng mọi hoạt động của nhà trường
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover: border-red-200 hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors">
                  <FontAwesomeIcon
                    icon={value.icon}
                    className="text-red-700 text-2xl group-hover:text-white transition-colors"
                  />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        <div className="mb-20" id="history">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              Lịch sử phát triển
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Những <span className="text-red-700">cột mốc</span> quan trọng
            </h3>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line - Center (Desktop) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-200 via-red-300 to-red-200 rounded-full"></div>

            {/* Timeline Line - Left (Mobile) */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-red-200"></div>

            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div key={index} className="relative">
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Content */}
                        <div className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                          <div className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-red-200 transition-all group ${isLeft ? 'ml-auto' : 'mr-auto'} max-w-md`}>
                            <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                              <span className="bg-red-100 text-red-700 font-bold text-lg px-3 py-1 rounded-lg">
                                {milestone.year}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                              {milestone.title}
                            </h4>
                            <p className="text-gray-600 mt-2">{milestone.description}</p>
                          </div>
                        </div>

                        {/* Center Dot */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                          <div className="w-8 h-8 bg-red-700 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>

                        {/* Empty Space */}
                        <div className="w-1/2"></div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden pl-12 relative">
                      {/* Mobile Dot */}
                      <div className="absolute left-2 top-6 w-5 h-5 bg-red-700 rounded-full border-4 border-white shadow"></div>

                      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
                        <span className="inline-block bg-red-100 text-red-700 font-bold text-sm px-3 py-1 rounded-lg mb-2">
                          {milestone.year}
                        </span>
                        <h4 className="text-lg font-bold text-gray-900">{milestone.title}</h4>
                        <p className="text-gray-600 mt-1 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-20 border-2 border-red-100 shadow-lg shadow-red-50">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Thành tựu & Giải thưởng
            </h3>
            <p className="text-slate-600">Những ghi nhận xứng đáng cho nỗ lực không ngừng</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-6 text-center hover:bg-red-50 hover:border-red-200 transition-all border border-slate-200"
              >
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={item.icon} className="text-white text-xl" />
                </div>
                <p className="text-slate-900 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ban Giám hiệu
            </h3>
            <p className="text-gray-600">Đội ngũ lãnh đạo tâm huyết và giàu kinh nghiệm</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                <p className="text-red-700 font-medium">{member.position}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <FontAwesomeIcon icon={faQuoteLeft} className="text-5xl text-red-200 mb-6" />
            <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
              "Đại học Thủ Đô Hà Nội cam kết đồng hành cùng sinh viên trên hành trình
              chinh phục tri thức, rèn luyện kỹ năng và phát triển toàn diện để trở thành
              những công dân có ích cho xã hội."
            </blockquote>
            <div>
              <p className="font-bold text-gray-900">PGS.TS. Nguyễn Văn A</p>
              <p className="text-red-700">Hiệu trưởng</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Tìm hiểu thêm về chúng tôi</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center space-x-2"
            >
              <span>Liên hệ tư vấn</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;