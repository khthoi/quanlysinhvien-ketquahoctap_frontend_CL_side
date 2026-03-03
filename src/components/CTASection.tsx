"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap,
    faArrowRight,
    faPhone,
    faEnvelope,
    faMapMarkerAlt,
    faCalendarAlt,
    faFileDownload,
    faUserPlus,
    faComments,
    faHeadset,
    faCheckCircle,
    faClock,
    faUsers,
    faStar,
    faBook,
    faLaptop,
    faBriefcase,
    faGlobe,
    faPaperPlane,
    faSpinner,
    faBell,
    faGift,
    faPercent,
    faShieldAlt,
    faHeart,
    faRocket,
    faQuestionCircle,
    faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faYoutube,
    faTiktok,
    faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

const CTASection: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        program: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const quickLinks = [
        {
            icon: faUserPlus,
            title: 'Đăng ký xét tuyển',
            description: 'Nộp hồ sơ trực tuyến',
            color: 'bg-red-100 text-red-700',
            hoverColor: 'hover:bg-red-700',
            link: '#'
        },
        {
            icon: faFileDownload,
            title: 'Tải brochure',
            description: 'Thông tin tuyển sinh 2026',
            color: 'bg-blue-100 text-blue-700',
            hoverColor: 'hover:bg-blue-700',
            link: '#'
        },
        {
            icon: faCalendarAlt,
            title: 'Đặt lịch tham quan',
            description: 'Khám phá khuôn viên',
            color: 'bg-green-100 text-green-700',
            hoverColor: 'hover:bg-green-700',
            link: '#'
        },
        {
            icon: faHeadset,
            title: 'Tư vấn trực tuyến',
            description: 'Chat với tư vấn viên',
            color: 'bg-purple-100 text-purple-700',
            hoverColor: 'hover:bg-purple-700',
            link: '#'
        }
    ];

    const programs = [
        'Chọn ngành học quan tâm',
        'Công nghệ thông tin',
        'Sư phạm Toán học',
        'Sư phạm Ngữ văn',
        'Sư phạm Tiếng Anh',
        'Sư phạm Mầm non',
        'Quản trị kinh doanh',
        'Kế toán',
        'Ngôn ngữ Anh',
        'Ngôn ngữ Trung Quốc',
        'Văn hóa Du lịch',
        'Thiết kế đồ họa',
        'Luật',
        'Ngành khác'
    ];

    const benefits = [
        { icon: faGift, text: 'Học bổng lên đến 100% học phí' },
        { icon: faShieldAlt, text: 'Cam kết chất lượng đào tạo' },
        { icon: faBriefcase, text: '95% có việc làm sau tốt nghiệp' },
        { icon: faGlobe, text: 'Cơ hội học tập quốc tế' }
    ];

    const contactInfo = [
        {
            icon: faPhone,
            title: 'Hotline tuyển sinh',
            value: '1900 xxxx',
            subValue: 'Miễn phí cuộc gọi'
        },
        {
            icon: faEnvelope,
            title: 'Email',
            value: 'tuyensinh@daihocthuho.edu.vn',
            subValue: 'Phản hồi trong 24h'
        },
        {
            icon: faMapMarkerAlt,
            title: 'Địa chỉ',
            value: '98 Dương Quảng Hàm, Cầu Giấy, Hà Nội',
            subValue: 'Mở cửa:  7: 30 - 17:00'
        }
    ];

    const socialLinks = [
        { icon: faFacebookF, label: 'Facebook', color: 'hover:bg-blue-600', followers: '150K' },
        { icon: faYoutube, label: 'YouTube', color: 'hover: bg-red-600', followers: '50K' },
        { icon: faTiktok, label: 'TikTok', color: 'hover:bg-gray-900', followers: '80K' },
        { icon: faLinkedinIn, label: 'LinkedIn', color: 'hover:bg-blue-700', followers: '20K' }
    ];

    const upcomingEvents = [
        {
            date: '20',
            month: 'Th01',
            title: 'Ngày hội Tư vấn Tuyển sinh 2026',
            time: '8:00 - 17:00'
        },
        {
            date: '25',
            month: 'Th01',
            title: 'Workshop:  Định hướng nghề nghiệp',
            time: '14:00 - 16:30'
        },
        {
            date: '01',
            month: 'Th02',
            title: 'Hạn cuối nộp hồ sơ đợt 1',
            time: '23:59'
        }
    ];

    const faqs = [
        { q: 'Điểm chuẩn năm 2025 là bao nhiêu?', a: 'Từ 18-25 điểm tùy ngành' },
        { q: 'Có những hình thức xét tuyển nào? ', a: 'Xét học bạ, thi THPT, đánh giá năng lực' },
        { q: 'Học phí như thế nào?', a: 'Từ 12-18 triệu/năm tùy ngành' }
    ];

    return (
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Announcement Banner */}
                <div className="bg-white rounded-2xl p-4 md:p-6 mb-12 relative overflow-hidden border-2 border-red-100 shadow-lg shadow-red-50">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                <FontAwesomeIcon icon={faBell} className="text-red-600 text-xl" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-slate-900">🎉 Mở đăng ký tuyển sinh năm 2026!</p>
                                <p className="text-slate-600 text-sm">Đăng ký sớm nhận học bổng lên đến 50% học phí năm đầu</p>
                            </div>
                        </div>
                        <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2 whitespace-nowrap shadow-lg shadow-red-100">
                            <span>Đăng ký ngay</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {quickLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.link}
                            className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-red-300 transition-all hover:shadow-xl"
                        >
                            <div className={`w-14 h-14 ${link.color} rounded-xl flex items-center justify-center mb-4`}>
                                <FontAwesomeIcon icon={link.icon} className="text-2xl" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">
                                {link.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {link.description}
                            </p>
                            <div className="mt-4 flex items-center text-red-700 font-medium">
                                <span className="text-sm">Xem chi tiết</span>
                                <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-3xl p-8 md:p-12 mb-16 border-2 border-slate-200 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sự kiện sắp tới</h3>
                            <p className="text-slate-600">Đừng bỏ lỡ các sự kiện quan trọng</p>
                        </div>
                        <a href="#" className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2 mt-4 md:mt-0">
                            <span>Xem tất cả</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {upcomingEvents.map((event, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-2xl p-6 hover:bg-red-50 hover:border-red-200 transition-all group border border-slate-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="bg-red-600 rounded-xl p-3 text-center min-w-16">
                                        <div className="text-2xl font-bold text-white">{event.date}</div>
                                        <div className="text-xs text-red-100">{event.month}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center text-slate-600 text-sm">
                                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                                            {event.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Preview */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                            FAQ
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Câu hỏi <span className="text-red-700">thường gặp</span>
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Giải đáp nhanh những thắc mắc phổ biến về tuyển sinh
                        </p>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                                >
                                    <h4 className="font-bold text-gray-900 mb-1">{faq.q}</h4>
                                    <p className="text-gray-600 text-sm">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                        <a href="#" className="inline-flex items-center space-x-2 text-red-700 font-medium mt-6 hover:text-red-800">
                            <span>Xem tất cả câu hỏi</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                    </div>

                    {/* Video CTA */}
                    <div className="relative bg-gray-100 rounded-3xl overflow-hidden">
                        <div className="aspect-video relative">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/gD7BmNA6Pfs"
                                title="Giới thiệu Đại học Thủ Đô Hà Nội"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-6">
                            <h4 className="font-bold text-gray-900 mb-1">Khám phá Đại học Thủ Đô</h4>
                            <p className="text-gray-600 text-sm">Xem video giới thiệu về trường và các ngành đào tạo</p>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-red-100 shadow-xl shadow-red-50">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: faUsers, number: '20,000+', label: 'Sinh viên đang học' },
                            { icon: faGraduationCap, number: '50,000+', label: 'Cựu sinh viên' },
                            { icon: faBook, number: '50+', label: 'Ngành đào tạo' },
                            { icon: faStar, number: '95%', label: 'Hài lòng chất lượng' }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={stat.icon} className="text-red-600 text-2xl" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.number}</div>
                                <div className="text-slate-600 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Final CTA */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Sẵn sàng bắt đầu hành trình của bạn?
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Hãy trở thành một phần của cộng đồng Đại học Thủ Đô Hà Nội - nơi ươm mầm
                        tri thức và kiến tạo tương lai.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center space-x-2">
                            <FontAwesomeIcon icon={faRocket} />
                            <span>Đăng ký xét tuyển ngay</span>
                        </button>
                        <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-red-700 hover:text-red-700 transition-colors flex items-center space-x-2">
                            <FontAwesomeIcon icon={faHeadset} />
                            <span>Liên hệ tư vấn</span>
                        </button>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                        <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-1" />
                        Hơn 50,000 sinh viên đã lựa chọn chúng tôi
                    </p>
                </div>
            </div>
        </section >
    );
};

export default CTASection;