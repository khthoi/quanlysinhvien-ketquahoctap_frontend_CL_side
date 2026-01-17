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

        {/* Programs Preview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Ngành đào tạo
            </span>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Đa dạng ngành học<br />
              <span className="text-red-700">phù hợp mọi đam mê</span>
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Trường đào tạo hơn 50 ngành học thuộc các lĩnh vực:  Sư phạm, Kinh tế,
              Công nghệ thông tin, Ngoại ngữ, Văn hóa - Du lịch và nhiều ngành khác.
            </p>
            <div className="space-y-4">
              {[
                { icon: faChalkboardTeacher, name: 'Khối ngành Sư phạm', count: '15 ngành' },
                { icon: faLaptopCode, name: 'Khối ngành Công nghệ', count: '12 ngành' },
                { icon: faBriefcase, name: 'Khối ngành Kinh tế', count: '10 ngành' },
                { icon: faBookOpen, name: 'Khối ngành Xã hội & Nhân văn', count: '13 ngành' }
              ].map((program, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={program.icon} className="text-red-700" />
                    </div>
                    <span className="font-medium text-gray-900">{program.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{program.count}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-red-700 text-sm" />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center space-x-2">
              <span>Xem tất cả ngành học</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Right Side - Image Placeholder with Stats */}
          <div className="relative">
            <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <FontAwesomeIcon icon={faGraduationCap} className="text-8xl text-gray-300 mb-4" />
                <p className="text-gray-400">Hình ảnh khuôn viên trường</p>
              </div>
            </div>
            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-green-700" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">20,000+</div>
                  <div className="text-sm text-gray-500">Sinh viên đang học</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-500">Giải thưởng NCKH</div>
                </div>
              </div>
            </div>
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
              <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                <span>Đăng ký tư vấn</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                Tải brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;