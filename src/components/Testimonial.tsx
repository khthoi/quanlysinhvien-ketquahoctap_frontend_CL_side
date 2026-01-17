"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuoteLeft,
  faQuoteRight,
  faStar,
  faStarHalfAlt,
  faChevronLeft,
  faChevronRight,
  faUserGraduate,
  faBuilding,
  faBriefcase,
  faMapMarkerAlt,
  faCalendarAlt,
  faAward,
  faUsers,
  faHeart,
  faThumbsUp,
  faGraduationCap,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  department: string;
  graduationYear: string;
  avatar?: string;
  rating: number;
  quote: string;
  achievement?: string;
  location?: string;
  type: 'alumni' | 'student' | 'employer';
}

const TestimonialSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alumni' | 'student' | 'employer'>('alumni');
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials: Testimonial[] = [
    // Alumni
    {
      id: 1,
      name: 'Nguyễn Thị Mai Anh',
      role: 'Senior Software Engineer',
      company: 'FPT Software',
      department: 'Công nghệ thông tin',
      graduationYear: '2018',
      rating: 5,
      quote: 'Những năm tháng học tập tại Đại học Thủ Đô đã trang bị cho tôi nền tảng kiến thức vững chắc và kỹ năng thực hành quý báu.  Đặc biệt, môi trường học tập năng động và đội ngũ giảng viên tâm huyết đã giúp tôi tự tin bước vào thị trường lao động.',
      achievement: 'Top 30 Under 30 Vietnam 2023',
      location: 'Hà Nội',
      type: 'alumni'
    },
    {
      id: 2,
      name: 'Trần Văn Minh',
      role: 'Giáo viên THPT',
      company: 'THPT Chu Văn An',
      department: 'Sư phạm Toán học',
      graduationYear: '2015',
      rating: 5,
      quote: 'Chương trình đào tạo sư phạm của trường rất bài bản và thực tiễn. Tôi được thực hành giảng dạy từ năm thứ 2, điều này giúp tôi tự tin và chuyên nghiệp hơn khi ra trường.  Hiện tại tôi đã là giáo viên chủ nhiệm và rất tự hào về xuất thân của mình.',
      achievement: 'Giáo viên giỏi cấp Thành phố',
      location: 'Hà Nội',
      type: 'alumni'
    },
    {
      id: 3,
      name: 'Lê Hoàng Nam',
      role: 'Marketing Manager',
      company: 'Vingroup',
      department: 'Quản trị kinh doanh',
      graduationYear: '2016',
      rating: 5,
      quote: 'Tôi đặc biệt ấn tượng với chương trình thực tập doanh nghiệp của trường. Nhờ đó, tôi đã có cơ hội làm việc tại Vingroup ngay khi còn là sinh viên năm cuối và được giữ lại sau khi tốt nghiệp.',
      location: 'TP.  Hồ Chí Minh',
      type: 'alumni'
    },
    // Students
    {
      id: 4,
      name: 'Phạm Thị Hương',
      role: 'Sinh viên năm 4',
      department: 'Ngôn ngữ Anh',
      graduationYear: '2025',
      rating: 5,
      quote: 'Môi trường học tập tại đây rất tuyệt vời! Tôi có cơ hội tham gia nhiều CLB, hoạt động ngoại khóa và các chương trình trao đổi sinh viên quốc tế. Điều này giúp tôi phát triển toàn diện cả về kiến thức lẫn kỹ năng mềm.',
      achievement: 'Thủ khoa học kỳ 2023-2024',
      type: 'student'
    },
    {
      id: 5,
      name: 'Đỗ Quang Huy',
      role: 'Sinh viên năm 3',
      department: 'Công nghệ thông tin',
      graduationYear: '2026',
      rating: 5,
      quote: 'Các phòng lab và trang thiết bị học tập rất hiện đại. Giảng viên luôn sẵn sàng hỗ trợ và hướng dẫn sinh viên. Tôi đã được tham gia nhiều dự án thực tế ngay từ năm 2.',
      achievement: 'Giải Nhì Hackathon 2024',
      type: 'student'
    },
    {
      id: 6,
      name: 'Nguyễn Lan Chi',
      role: 'Sinh viên năm 2',
      department: 'Sư phạm Mầm non',
      graduationYear: '2027',
      rating: 5,
      quote: 'Tôi rất thích không khí học tập ở đây - vừa nghiêm túc vừa thân thiện. Các thầy cô luôn lắng nghe và đồng hành cùng sinh viên.  Ký túc xá sạch đẹp, tiện nghi và học phí rất hợp lý.',
      type: 'student'
    },
    // Employers
    {
      id: 7,
      name: 'Ông Nguyễn Văn Thành',
      role: 'Giám đốc Nhân sự',
      company: 'Samsung Vietnam',
      department: '',
      graduationYear: '',
      rating: 5,
      quote: 'Chúng tôi đã tuyển dụng nhiều sinh viên từ Đại học Thủ Đô và rất hài lòng với chất lượng. Các bạn có kiến thức chuyên môn tốt, thái độ làm việc nghiêm túc và khả năng thích ứng nhanh với môi trường doanh nghiệp.',
      type: 'employer'
    },
    {
      id: 8,
      name: 'Bà Trần Thị Hạnh',
      role: 'CEO',
      company: 'EduTech Vietnam',
      department: '',
      graduationYear: '',
      rating: 5,
      quote: 'Đại học Thủ Đô là đối tác đào tạo tin cậy của chúng tôi. Sinh viên thực tập tại công ty luôn thể hiện sự chủ động, sáng tạo và tinh thần học hỏi cao. Nhiều bạn đã trở thành nhân viên chính thức xuất sắc.',
      type: 'employer'
    },
    {
      id: 9,
      name: 'Ông Lê Minh Đức',
      role: 'Hiệu trưởng',
      company: 'THCS Nguyễn Trãi',
      department: '',
      graduationYear: '',
      rating: 5,
      quote: 'Giáo viên tốt nghiệp từ Đại học Thủ Đô đều có năng lực sư phạm vững vàng, yêu nghề và tận tâm với học sinh. Trường chúng tôi luôn ưu tiên tuyển dụng sinh viên từ HNMU.',
      type: 'employer'
    }
  ];

  const filteredTestimonials = testimonials.filter(t => t.type === activeTab);

  const stats = [
    { icon: faUserGraduate, number: '50,000+', label: 'Cựu sinh viên' },
    { icon: faBuilding, number: '500+', label: 'Doanh nghiệp đối tác' },
    { icon: faThumbsUp, number: '95%', label: 'Hài lòng về chất lượng' },
    { icon: faHeart, number: '98%', label: 'Giới thiệu cho người thân' }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500" />
        );
      } else {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className="text-gray-300" />
        );
      }
    }
    return stars;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === filteredTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alumni':
        return faUserGraduate;
      case 'student':
        return faGraduationCap;
      case 'employer':
        return faBuilding;
      default:
        return faUsers;
    }
  };

  return (
    <section className="bg-white py-20" id="programs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FontAwesomeIcon icon={faQuoteLeft} className="mr-2" />
            Cảm nhận
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Họ nói gì về <span className="text-red-700">Đại học Thủ Đô</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lắng nghe chia sẻ từ cựu sinh viên, sinh viên đang học và các nhà tuyển dụng
            về trải nghiệm tại Đại học Thủ Đô Hà Nội.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={stat.icon} className="text-red-700 text-xl" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: 'alumni', label: 'Cựu sinh viên', icon: faUserGraduate },
            { key: 'student', label: 'Sinh viên', icon: faGraduationCap },
            { key: 'employer', label: 'Nhà tuyển dụng', icon: faBuilding }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as 'alumni' | 'student' | 'employer');
                setCurrentSlide(0);
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === tab.key
                ? 'bg-red-700 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Featured Testimonial Slider */}
        <div className="relative mb-16">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Avatar & Info - Fixed Height Container */}
              <div className="text-center lg:text-left">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-xl mx-auto lg:mx-0">
                    <FontAwesomeIcon
                      icon={getTypeIcon(filteredTestimonials[currentSlide]?.type)}
                      className="text-5xl text-gray-400"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
                  </div>
                </div>

                {/* Name & Role - Always Show */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {filteredTestimonials[currentSlide]?.name}
                </h3>
                <p className="text-red-700 font-medium mb-4">
                  {filteredTestimonials[currentSlide]?.role}
                </p>

                {/* Info List - Fixed Structure */}
                <div className="space-y-2 min-h-24">
                  {/* Line 1: Company/Organization OR Department */}
                  <div className="flex items-center justify-center lg:justify-start text-gray-600">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-sm w-4" />
                    <span>
                      {filteredTestimonials[currentSlide]?.company ||
                        filteredTestimonials[currentSlide]?.department ||
                        '—'}
                    </span>
                  </div>

                  {/* Line 2: Department (for alumni/student) OR Position detail (for employer) */}
                  <div className="flex items-center justify-center lg:justify-start text-gray-600">
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-sm w-4" />
                    <span>
                      {filteredTestimonials[currentSlide]?.type === 'employer'
                        ? (filteredTestimonials[currentSlide]?.company || '—')
                        : (filteredTestimonials[currentSlide]?.department || '—')}
                    </span>
                  </div>

                  {/* Line 3: Year/Location */}
                  <div className="flex items-center justify-center lg:justify-start text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-sm w-4" />
                    <span>
                      {filteredTestimonials[currentSlide]?.graduationYear
                        ? `Khóa ${filteredTestimonials[currentSlide]?.graduationYear}`
                        : (filteredTestimonials[currentSlide]?.location || '—')}
                    </span>
                  </div>

                  {/* Line 4: Location (if available) */}
                  {filteredTestimonials[currentSlide]?.location &&
                    filteredTestimonials[currentSlide]?.graduationYear && (
                      <div className="flex items-center justify-center lg:justify-start text-gray-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-sm w-4" />
                        <span>{filteredTestimonials[currentSlide]?.location}</span>
                      </div>
                    )}
                </div>

                {/* Social Links - Always Show */}
                <div className="flex items-center justify-center lg:justify-start space-x-3 mt-6">
                  <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover: bg-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                </div>
              </div>

              {/* Quote - Fixed Layout */}
              <div className="lg:col-span-2 flex flex-col">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-red-200 mb-4" />

                {/* Quote Text - Fixed Min Height */}
                <blockquote className="text-lg md: text-xl text-gray-700 leading-relaxed mb-6 min-h-32">
                  {filteredTestimonials[currentSlide]?.quote}
                </blockquote>

                {/* Rating - Always Show */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-600 mr-2">Đánh giá:</span>
                  <div className="flex space-x-1">
                    {renderStars(filteredTestimonials[currentSlide]?.rating || 0)}
                  </div>
                </div>

                {/* Achievement Badge - Fixed Height Container */}
                <div className="h-10">
                  {filteredTestimonials[currentSlide]?.achievement ? (
                    <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                      <FontAwesomeIcon icon={faAward} className="mr-2" />
                      <span className="font-medium">{filteredTestimonials[currentSlide]?.achievement}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center bg-gray-100 text-gray-500 px-4 py-2 rounded-full">
                      <FontAwesomeIcon icon={faStar} className="mr-2" />
                      <span className="font-medium">Thành viên tích cực</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index
                  ? 'bg-red-700 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Cards Grid - Fixed Layout */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
            Thêm nhiều chia sẻ khác
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-lg cursor-pointer flex flex-col h-full ${currentSlide === index
                  ? 'border-red-700 shadow-lg'
                  : 'border-gray-100 hover:border-red-200'
                  }`}
                onClick={() => setCurrentSlide(index)}
              >
                {/* Header - Fixed */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon
                      icon={getTypeIcon(testimonial.type)}
                      className="text-xl text-gray-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{testimonial.name}</h4>
                    <p className="text-sm text-red-700 truncate">{testimonial.role}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {testimonial.company || testimonial.department || '—'}
                    </p>
                  </div>
                </div>

                {/* Rating - Always Show */}
                <div className="flex space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Quote - Fixed Height */}
                <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
                  "{testimonial.quote.substring(0, 150)}..."
                </p>

                {/* Achievement - Fixed Height Container */}
                <div className="h-8 mt-auto">
                  {testimonial.achievement ? (
                    <div className="inline-flex items-center text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                      <FontAwesomeIcon icon={faAward} className="mr-1" />
                      <span className="truncate max-w-32">{testimonial.achievement}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      <span>Đã xác minh</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Video chia sẻ</h3>
            <p className="text-gray-600">Xem video chia sẻ từ cựu sinh viên và sinh viên</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Hành trình từ sinh viên đến CEO', author: 'Nguyễn Văn A - Khóa 2010' },
              { title: 'Trải nghiệm trao đổi sinh viên tại Hàn Quốc', author: 'Trần Thị B - Khóa 2020' },
              { title: 'Câu chuyện khởi nghiệp của cựu sinh viên', author: 'Lê Văn C - Khóa 2015' }
            ].map((video, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 flex items-center justify-center relative group cursor-pointer">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-5xl text-gray-300" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                      <FontAwesomeIcon icon={faChevronRight} className="text-white text-xl ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{video.title}</h4>
                  <p className="text-sm text-gray-500">{video.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-red-100 shadow-xl shadow-red-50">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Bạn cũng muốn trở thành một phần của câu chuyện?
              </h3>
              <p className="text-slate-600 mb-6">
                Hãy bắt đầu hành trình của bạn tại Đại học Thủ Đô Hà Nội và viết nên
                câu chuyện thành công của riêng mình.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                  Đăng ký tuyển sinh
                </button>
                <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <div className="w-48 h-48 bg-red-50 border-4 border-red-200 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeart} className="text-6xl text-red-500" />
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-red-100 rounded-full border-2 border-white flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faUsers} className="text-xs text-red-600" />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-900">+50K</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Cựu sinh viên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;