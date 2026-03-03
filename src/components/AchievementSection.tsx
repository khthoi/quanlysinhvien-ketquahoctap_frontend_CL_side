"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faMedal,
  faAward,
  faStar,
  faCertificate,
  faGraduationCap,
  faFlask,
  faBook,
  faGlobe,
  faUsers,
  faChalkboardTeacher,
  faLaptopCode,
  faHandshake,
  faNewspaper,
  faCalendarAlt,
  faChevronRight,
  faQuoteLeft,
  faCheckCircle,
  faFlag,
  faUniversity,
  faRocket,
  faBullseye,
  faLightbulb,
  faCrown,
  faGem
} from '@fortawesome/free-solid-svg-icons';

interface Achievement {
  id: number;
  title: string;
  description: string;
  year: string;
  category: string;
  icon: any;
  level: 'national' | 'international' | 'institutional';
}

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
  prefix?: string;
}

// Animated Counter Component
const AnimatedCounter: React.FC<CounterProps> = ({ end, duration, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const AchievementSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // smooth scroll helper for CTA buttons
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const mainStats = [
    {
      icon: faTrophy,
      number: 150,
      suffix: '+',
      label: 'Giải thưởng các cấp',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: faCertificate,
      number: 15,
      suffix: '',
      label: 'Chương trình đạt chuẩn AUN-QA',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: faFlask,
      number: 200,
      suffix: '+',
      label: 'Đề tài NCKH cấp Bộ',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: faGlobe,
      number: 50,
      suffix: '+',
      label: 'Đối tác quốc tế',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const institutionalAwards = [
    {
      icon: faCrown,
      title: 'Huân chương Lao động hạng Nhất',
      year: '2019',
      description: 'Ghi nhận đóng góp xuất sắc trong sự nghiệp giáo dục'
    },
    {
      icon: faFlag,
      title: 'Cờ thi đua của Chính phủ',
      year: '2020',
      description: 'Đơn vị dẫn đầu phong trào thi đua yêu nước'
    },
    {
      icon: faAward,
      title: 'Giải thưởng Chất lượng Quốc gia',
      year: '2021',
      description: 'Top cơ sở giáo dục đại học chất lượng cao'
    },
    {
      icon: faStar,
      title: 'Top 20 Đại học Việt Nam',
      year: '2024',
      description: 'Xếp hạng bởi UniRank & Webometrics'
    }
  ];

  const achievements: Achievement[] = [
    // Nghiên cứu khoa học
    {
      id: 1,
      title: 'Giải Nhất NCKH Sinh viên Quốc gia',
      description: 'Đề tài nghiên cứu ứng dụng AI trong giáo dục',
      year: '2024',
      category: 'research',
      icon: faFlask,
      level: 'national'
    },
    {
      id: 2,
      title: 'Best Paper Award - IEEE Conference',
      description: 'Công bố quốc tế về Machine Learning',
      year: '2024',
      category: 'research',
      icon: faNewspaper,
      level: 'international'
    },
    {
      id: 3,
      title: 'Giải thưởng Sáng tạo Khoa học Công nghệ',
      year: '2023',
      description: 'VIFOTEC - Liên hiệp các Hội KH&KT Việt Nam',
      category: 'research',
      icon: faLightbulb,
      level: 'national'
    },
    // Học thuật
    {
      id: 4,
      title: 'Thủ khoa toàn quốc ngành Sư phạm',
      description: 'Sinh viên Nguyễn Thị A - Khoa Sư phạm',
      year: '2024',
      category: 'academic',
      icon: faGraduationCap,
      level: 'national'
    },
    {
      id: 5,
      title: 'Huy chương Vàng Olympic Toán học',
      description: 'Cuộc thi Olympic Toán học Sinh viên toàn quốc',
      year: '2024',
      category: 'academic',
      icon: faMedal,
      level: 'national'
    },
    {
      id: 6,
      title: 'Giải Nhất cuộc thi Hùng biện tiếng Anh',
      description: 'Cuộc thi cấp Thành phố Hà Nội',
      year: '2023',
      category: 'academic',
      icon: faBook,
      level: 'institutional'
    },
    // Công nghệ
    {
      id: 7,
      title: 'Vô địch Hackathon Vietnam 2024',
      description: 'Ứng dụng giáo dục thông minh EduAI',
      year: '2024',
      category: 'technology',
      icon: faLaptopCode,
      level: 'national'
    },
    {
      id: 8,
      title: 'Top 10 ICPC Asia Regional',
      description: 'Cuộc thi lập trình sinh viên quốc tế',
      year: '2023',
      category: 'technology',
      icon: faRocket,
      level: 'international'
    },
    {
      id: 9,
      title: 'Giải Ba Google Solution Challenge',
      description: 'Dự án ứng dụng công nghệ vì cộng đồng',
      year: '2024',
      category: 'technology',
      icon: faGlobe,
      level: 'international'
    },
    // Văn hóa - Xã hội
    {
      id: 10,
      title: 'Giải Nhất Hội thi Văn nghệ Sinh viên',
      description: 'Liên hoan Văn nghệ các trường ĐH Hà Nội',
      year: '2024',
      category: 'culture',
      icon: faStar,
      level: 'institutional'
    },
    {
      id: 11,
      title: 'Tình nguyện viên xuất sắc Quốc gia',
      description: 'Chương trình Mùa hè xanh',
      year: '2023',
      category: 'culture',
      icon: faUsers,
      level: 'national'
    },
    {
      id: 12,
      title: 'Giải thưởng Sao tháng Giêng',
      description: 'Gương sinh viên tiêu biểu toàn quốc',
      year: '2024',
      category: 'culture',
      icon: faGem,
      level: 'national'
    }
  ];

  const categories = [
    { key: 'all', label: 'Tất cả', icon: faTrophy },
    { key: 'research', label: 'Nghiên cứu khoa học', icon: faFlask },
    { key: 'academic', label: 'Học thuật', icon: faGraduationCap },
    { key: 'technology', label: 'Công nghệ', icon: faLaptopCode },
    { key: 'culture', label: 'Văn hóa - Xã hội', icon: faUsers }
  ];

  const filteredAchievements = activeCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeCategory);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'international':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Quốc tế' };
      case 'national':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Quốc gia' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Cấp trường/TP' };
    }
  };

  const featuredProjects = [
    {
      title: 'Dự án EduTech 4.0',
      description: 'Ứng dụng công nghệ AI và VR trong giảng dạy, được Bộ GD&ĐT đánh giá cao',
      stats: [
        { label: 'Giảng viên tham gia', value: '120+' },
        { label: 'Môn học áp dụng', value: '45' },
        { label: 'Sinh viên hưởng lợi', value: '15,000+' }
      ],
      icon: faLaptopCode
    },
    {
      title: 'Chương trình Khởi nghiệp HNMU',
      description: 'Hỗ trợ sinh viên phát triển ý tưởng kinh doanh và khởi nghiệp',
      stats: [
        { label: 'Dự án ươm tạo', value: '50+' },
        { label: 'Vốn huy động', value: '5 tỷ' },
        { label: 'Startup thành công', value: '12' }
      ],
      icon: faRocket
    },
    {
      title: 'Hợp tác Doanh nghiệp',
      description: 'Liên kết đào tạo và tuyển dụng với các doanh nghiệp hàng đầu',
      stats: [
        { label: 'Doanh nghiệp đối tác', value: '200+' },
        { label: 'Sinh viên thực tập', value: '3,000+' },
        { label: 'Tỷ lệ có việc làm', value: '95%' }
      ],
      icon: faHandshake
    }
  ];

  const accreditations = [
    { name: 'AUN-QA', count: 15, description: 'Chương trình đạt chuẩn' },
    { name: 'ABET', count: 3, description: 'Chương trình CNTT' },
    { name: 'ISO 9001:2015', count: 1, description: 'Hệ thống quản lý' },
    { name: 'QS Stars', count: 4, description: 'Sao đánh giá' }
  ];

  return (
    <section className="bg-gray-50 py-20" id="achievements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
            Thành tựu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thành tựu nổi bật của <span className="text-red-700">Đại học Thủ Đô</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ghi nhận những nỗ lực không ngừng trong nghiên cứu khoa học, đào tạo
            và các hoạt động phong trào của giảng viên và sinh viên nhà trường.
          </p>
        </div>

        {/* Main Stats with Animation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mainStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <FontAwesomeIcon icon={stat.icon} className="text-2xl" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={stat.number} duration={2000} suffix={stat.suffix} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Institutional Awards */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 border border-gray-200 shadow-sm">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faTrophy} className="mr-2" />
              Danh hiệu cao quý
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Danh hiệu & Giải thưởng <span className="text-red-700">cấp Nhà nước</span>
            </h3>
            <p className="text-gray-600">Những ghi nhận cao quý cho toàn thể nhà trường</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutionalAwards.map((award, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg hover:bg-white border border-gray-100 hover:border-red-200 transition-all group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors">
                  <FontAwesomeIcon icon={award.icon} className="text-red-700 text-2xl group-hover:text-white transition-colors" />
                </div>
                <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full mb-3 font-medium">
                  {award.year}
                </span>
                <h4 className="text-gray-900 font-bold mb-2">{award.title}</h4>
                <p className="text-gray-500 text-sm">{award.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Filter & Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Thành tích Giảng viên & Sinh viên
            </h3>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.key
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover: bg-gray-100 border border-gray-200'
                    }`}
                >
                  <FontAwesomeIcon icon={cat.icon} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => {
              const levelBadge = getLevelBadge(achievement.level);
              return (
                <div
                  key={achievement.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover: shadow-xl hover:border-red-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <FontAwesomeIcon
                        icon={achievement.icon}
                        className="text-red-700 text-xl group-hover:text-white transition-colors"
                      />
                    </div>
                    <span className={`${levelBadge.bg} ${levelBadge.text} text-xs px-3 py-1 rounded-full font-medium`}>
                      {levelBadge.label}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {achievement.year}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center space-x-2 text-red-700 font-medium hover:text-red-800 transition-colors"
            >
              <span>Xem tất cả thành tích</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Dự án nổi bật
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Dự án & Chương trình <span className="text-red-700">nổi bật</span>
            </h3>
            <p className="text-gray-600">Những sáng kiến đột phá trong giáo dục và nghiên cứu</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:border-red-200 transition-all group"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-700 transition-colors">
                    <FontAwesomeIcon icon={project.icon} className="text-red-700 text-2xl group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">{project.title}</h4>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    {project.stats.map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-xl font-bold text-red-700">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollTo('contact')}
                    className="w-full mt-6 py-3 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-red-700 hover:text-red-700 hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Tìm hiểu thêm</span>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accreditations */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <FontAwesomeIcon icon={faCertificate} className="mr-2" />
                Kiểm định chất lượng
              </span>
              <h3 className="text-2xl md: text-3xl font-bold text-gray-900 mb-4">
                Chất lượng được <span className="text-red-700">công nhận quốc tế</span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Đại học Thủ Đô Hà Nội tự hào là một trong những trường đại học có nhiều
                chương trình đào tạo đạt chuẩn kiểm định chất lượng trong nước và quốc tế,
                khẳng định vị thế trong hệ thống giáo dục đại học Việt Nam.
              </p>
              <ul className="space-y-3">
                {[
                  'Đạt chuẩn kiểm định cơ sở giáo dục đại học',
                  '15 chương trình đạt chuẩn AUN-QA',
                  'Hệ thống quản lý chất lượng ISO 9001:2015',
                  'Thành viên mạng lưới đảm bảo chất lượng ASEAN'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {accreditations.map((acc, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors"
                >
                  <div className="text-3xl font-bold text-red-700 mb-1">{acc.count}</div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{acc.name}</div>
                  <div className="text-sm text-gray-500">{acc.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Recent Achievements */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thành tích gần đây</h3>
            <p className="text-gray-600">Cập nhật những thành tựu mới nhất</p>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-red-200 transform md:-translate-x-1/2"></div>

            <div className="space-y-8">
              {[
                {
                  date: 'Tháng 1/2026',
                  title: 'Ký kết hợp tác với Đại học Tokyo',
                  description: 'Mở rộng chương trình trao đổi sinh viên và nghiên cứu chung',
                  icon: faGlobe
                },
                {
                  date: 'Tháng 12/2025',
                  title: 'Giải Nhất Cuộc thi Khởi nghiệp Quốc gia',
                  description: 'Dự án GreenEdu của nhóm sinh viên Khoa CNTT',
                  icon: faRocket
                },
                {
                  date: 'Tháng 11/2025',
                  title: 'Thêm 3 chương trình đạt chuẩn AUN-QA',
                  description: 'Nâng tổng số lên 15 chương trình được kiểm định quốc tế',
                  icon: faCertificate
                },
                {
                  date: 'Tháng 10/2025',
                  title: 'Khánh thành Trung tâm Nghiên cứu AI',
                  description: 'Đầu tư hơn 50 tỷ đồng cho nghiên cứu trí tuệ nhân tạo',
                  icon: faLaptopCode
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-red-700 rounded-full transform -translate-x-1/2 z-10 ring-4 ring-white"></div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md: pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className={`flex items-center space-x-3 mb-3 ${index % 2 === 0 ? 'md: justify-end' : ''}`}>
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon icon={item.icon} className="text-red-700" />
                        </div>
                        <span className="text-sm text-red-700 font-medium">{item.date}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 text-center">
          <FontAwesomeIcon icon={faQuoteLeft} className="text-5xl text-slate-300 mb-6" />
          <blockquote className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-6 max-w-4xl mx-auto">
            "Mỗi thành tựu của nhà trường là kết quả của sự nỗ lực không ngừng từ đội ngũ
            giảng viên tâm huyết và thế hệ sinh viên năng động, sáng tạo. Chúng tôi sẽ
            tiếp tục phấn đấu vì một nền giáo dục chất lượng cao."
          </blockquote>
          <div>
            <p className="font-bold text-slate-900">PGS. TS. Nguyễn Văn A</p>
            <p className="text-slate-600">Hiệu trưởng Đại học Thủ Đô Hà Nội</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementSection;