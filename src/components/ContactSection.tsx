"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faPhone,
    faEnvelope,
    faClock,
    faGlobe,
    faPaperPlane,
    faSpinner,
    faCheckCircle,
    faBuilding,
    faUserGraduate,
    faChalkboardTeacher,
    faBriefcase,
    faQuestionCircle,
    faHeadset,
    faComments,
    faDirections,
    faParking,
    faBus,
    faSubway,
    faInfoCircle,
    faExclamationCircle,
    faCalendarCheck,
    faPhoneAlt,
    faEnvelopeOpenText,
    faMapMarked,
    faUniversity,
    faLandmark,
    faCity,
    faRoad,
    faLocationArrow
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faYoutube,
    faTiktok,
    faLinkedinIn,
    faInstagram,
    faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { ENV } from "@/config/env";
import SearchableSelect from './ui/SearchableSelect';
import Modal from './ui/Modal';

interface ContactFormData {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    department: string;
    message: string;
}

interface Department {
    id: string;
    name: string;
    icon: any;
    phone: string;
    email: string;
    room: string;
    hours: string;
}

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        department: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'form' | 'departments' | 'map'>('form');
    const [modal, setModal] = useState<{ open: boolean; success: boolean; message: string }>({
        open: false,
        success: false,
        message: ''
    });
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${ENV.BACKEND_URL}/contact/send-form-information`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setModal({ open: true, success: true, message: 'Cảm ơn bạn đã liên hệ! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong vòng 24 giờ làm việc.' });
                resetForm();
            } else {
                setModal({ open: true, success: false, message: 'Gửi tin nhắn thất bại. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline.' });
            }
        } catch {
            setModal({ open: true, success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            department: '',
            message: ''
        });
    };

    const mainContacts = [
        {
            icon: faPhone,
            title: 'Hotline',
            value: '1900 xxxx',
            subValue: 'Miễn phí cuộc gọi',
            color: 'bg-red-100 text-red-700'
        },
        {
            icon: faEnvelope,
            title: 'Email',
            value: 'info@hnmu.edu. vn',
            subValue: 'Phản hồi trong 24h',
            color: 'bg-blue-100 text-blue-700'
        },
        {
            icon: faMapMarkerAlt,
            title: 'Địa chỉ',
            value: '98 Dương Quảng Hàm',
            subValue: 'Cầu Giấy, Hà Nội',
            color: 'bg-green-100 text-green-700'
        },
        {
            icon: faClock,
            title: 'Giờ làm việc',
            value: 'T2 - T6:  7:30 - 17:00',
            subValue: 'T7: 8:00 - 11:30',
            color: 'bg-purple-100 text-purple-700'
        }
    ];

    const departments: Department[] = [
        {
            id: 'admissions',
            name: 'Phòng Tuyển sinh',
            icon: faUserGraduate,
            phone: '024 xxxx 1001',
            email: 'tuyensinh@hnmu.edu.vn',
            room: 'Phòng A101, Tầng 1, Nhà A',
            hours: '7:30 - 17:00'
        },
        {
            id: 'academic',
            name: 'Phòng Đào tạo',
            icon: faChalkboardTeacher,
            phone: '024 xxxx 1002',
            email: 'daotao@hnmu.edu.vn',
            room: 'Phòng A201, Tầng 2, Nhà A',
            hours: '7:30 - 17:00'
        },
        {
            id: 'student',
            name: 'Phòng Công tác Sinh viên',
            icon: faBuilding,
            phone: '024 xxxx 1003',
            email: 'ctsv@hnmu.edu.vn',
            room: 'Phòng B101, Tầng 1, Nhà B',
            hours: '7:30 - 17:00'
        },
        {
            id: 'hr',
            name: 'Phòng Tổ chức Cán bộ',
            icon: faBriefcase,
            phone: '024 xxxx 1004',
            email: 'tccb@hnmu.edu. vn',
            room: 'Phòng A301, Tầng 3, Nhà A',
            hours: '7:30 - 17:00'
        },
        {
            id: 'international',
            name: 'Phòng Hợp tác Quốc tế',
            icon: faGlobe,
            phone: '024 xxxx 1005',
            email: 'htqt@hnmu.edu.vn',
            room: 'Phòng C201, Tầng 2, Nhà C',
            hours: '7:30 - 17:00'
        },
        {
            id: 'support',
            name: 'Trung tâm Hỗ trợ Sinh viên',
            icon: faHeadset,
            phone: '024 xxxx 1006',
            email: 'hotro@hnmu.edu. vn',
            room: 'Phòng B201, Tầng 2, Nhà B',
            hours: '7:30 - 21:00'
        }
    ];

    const campuses = [
        {
            name: 'Cơ sở chính - Cầu Giấy',
            address: '98 Dương Quảng Hàm, Quan Hoa, Cầu Giấy, Hà Nội',
            phone: '024 xxxx xxxx',
            features: ['Khu giảng đường', 'Thư viện', 'Ký túc xá', 'Sân vận động'],
            isMain: true
        },
        {
            name: 'Cơ sở 2 - Hà Đông',
            address: '15 Trần Phú, Hà Đông, Hà Nội',
            phone: '024 xxxx xxxx',
            features: ['Khu thực hành', 'Phòng lab', 'Hội trường'],
            isMain: false
        },
        {
            name: 'Cơ sở 3 - Mỹ Đình',
            address: '25 Lê Đức Thọ, Nam Từ Liêm, Hà Nội',
            phone: '024 xxxx xxxx',
            features: ['Trung tâm đào tạo', 'Khu liên kết'],
            isMain: false
        }
    ];

    const subjects = [
        'Chọn chủ đề',
        'Tư vấn tuyển sinh',
        'Thông tin ngành học',
        'Học phí & Học bổng',
        'Chương trình đào tạo',
        'Hợp tác & Liên kết',
        'Khiếu nại & Góp ý',
        'Hỗ trợ sinh viên',
        'Khác'
    ];

    const socialLinks = [
        { icon: faFacebookF, label: 'Facebook', url: '#', color: 'hover:bg-blue-600' },
        { icon: faYoutube, label: 'YouTube', url: '#', color: 'hover:bg-red-600' },
        { icon: faInstagram, label: 'Instagram', url: '#', color: 'hover:bg-pink-600' },
        { icon: faTiktok, label: 'TikTok', url: '#', color: 'hover:bg-gray-900' },
        { icon: faLinkedinIn, label: 'LinkedIn', url: '#', color: 'hover:bg-blue-700' },
        { icon: faTwitter, label: 'Twitter', url: '#', color: 'hover:bg-sky-500' }
    ];

    const transportInfo = [
        {
            icon: faBus,
            title: 'Xe buýt',
            lines: ['Tuyến 16', 'Tuyến 20', 'Tuyến 26', 'Tuyến 32']
        },
        {
            icon: faSubway,
            title: 'Metro',
            lines: ['Ga Cầu Giấy (Tuyến 3)', 'Cách trường 500m']
        },
        {
            icon: faParking,
            title: 'Bãi đỗ xe',
            lines: ['Miễn phí cho sinh viên', 'Có phí cho khách']
        }
    ];

    const quickQuestions = [
        {
            icon: faQuestionCircle,
            question: 'Làm thế nào để đăng ký xét tuyển? ',
            answer: 'Đăng ký trực tuyến tại website hoặc nộp hồ sơ trực tiếp tại Phòng Tuyển sinh'
        },
        {
            icon: faQuestionCircle,
            question: 'Học phí một năm là bao nhiêu? ',
            answer: 'Từ 12-18 triệu/năm tùy ngành, có học bổng hỗ trợ lên đến 100%'
        },
        {
            icon: faQuestionCircle,
            question: 'Trường có ký túc xá không?',
            answer: 'Có, ký túc xá hiện đại với đầy đủ tiện nghi, giá 300-500k/tháng'
        }
    ];

    return (
        <section className="bg-gray-50 py-20" id="contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <FontAwesomeIcon icon={faEnvelopeOpenText} className="mr-2" />
                        Liên hệ
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kết nối với <span className="text-red-700">Đại học Thủ Đô</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi
                        qua các kênh dưới đây hoặc ghé thăm trực tiếp tại khuôn viên trường.
                    </p>
                </div>

                {/* Main Contact Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {mainContacts.map((contact, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
                        >
                            <div className={`w-16 h-16 ${contact.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                <FontAwesomeIcon icon={contact.icon} className="text-2xl" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{contact.title}</p>
                            <p className="font-bold text-gray-900 text-lg">{contact.value}</p>
                            <p className="text-sm text-gray-400">{contact.subValue}</p>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {[
                        { key: 'form', label: 'Gửi tin nhắn', icon: faComments },
                        { key: 'departments', label: 'Phòng ban', icon: faBuilding },
                        { key: 'map', label: 'Bản đồ & Cơ sở', icon: faMapMarked }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as 'form' | 'departments' | 'map')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${activeTab === tab.key
                                ? 'bg-white text-red-700 shadow-lg border-2 border-red-700'
                                : 'bg-white text-gray-700 hover: bg-gray-100 border border-gray-200'
                                }`}
                        >
                            <FontAwesomeIcon icon={tab.icon} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mb-16">
                    {/* Form Tab */}
                    {activeTab === 'form' && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Contact Form */}
                            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gửi tin nhắn cho chúng tôi</h3>
                                    <p className="text-gray-600">Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24h</p>
                                </div>

                                {(
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Họ và tên <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                                                    placeholder="Nguyễn Văn A"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Số điện thoại <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                                                    placeholder="0912 345 678"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                                                placeholder="email@example.com"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Chủ đề
                                                </label>
                                                <SearchableSelect
                                                    fullWidth
                                                    placeholder="Chọn chủ đề"
                                                    value={formData.subject}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, subject: String(val) }))}
                                                    options={subjects.slice(1).map(s => ({ value: s, label: s }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phòng ban liên hệ
                                                </label>
                                                <SearchableSelect
                                                    fullWidth
                                                    placeholder="Chọn phòng ban"
                                                    value={formData.department}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, department: String(val) }))}
                                                    options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nội dung tin nhắn <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none resize-none placeholder:text-gray-400 text-gray-900"
                                                placeholder="Nhập nội dung tin nhắn của bạn..."
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-red-100"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                                        <span>Đang gửi...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faPaperPlane} />
                                                        <span>Gửi tin nhắn</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                            >
                                                Xóa form
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Quick Questions */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <FontAwesomeIcon icon={faInfoCircle} className="text-red-600 mr-2" />
                                        Câu hỏi thường gặp
                                    </h4>
                                    <div className="space-y-4">
                                        {quickQuestions.map((item, index) => (
                                            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <p className="font-medium text-gray-900 text-sm mb-1">{item.question}</p>
                                                <p className="text-gray-600 text-sm">{item.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Chat */}
                                <div className="bg-white rounded-2xl p-6 border-2 border-red-100 shadow-lg shadow-red-50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faHeadset} className="text-xl text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Chat trực tuyến</h4>
                                            <p className="text-red-600 text-sm">Hỗ trợ 24/7</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Cần hỗ trợ ngay? Chat trực tiếp với tư vấn viên của chúng tôi.
                                    </p>
                                    <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-red-100">
                                        <FontAwesomeIcon icon={faComments} />
                                        <span>Bắt đầu chat</span>
                                    </button>
                                </div>

                                {/* Social Links */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4">Theo dõi chúng tôi</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.url}
                                                className={`
                    w-full aspect-square 
                    bg-white rounded-xl 
                    flex items-center justify-center 
                    border-2 border-gray-200 
                    text-gray-600
                    hover:border-current hover:text-current 
                    transition-all duration-300
                    ${social.color}
                `}
                                                title={social.label}
                                            >
                                                <FontAwesomeIcon icon={social.icon} className="text-2xl" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Departments Tab */}
                    {activeTab === 'departments' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${selectedDepartment === dept.id
                                        ? 'border-red-700 shadow-lg'
                                        : 'border-gray-100 hover:border-red-200 hover:shadow-md'
                                        }`}
                                    onClick={() => setSelectedDepartment(
                                        selectedDepartment === dept.id ? null : dept.id
                                    )}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FontAwesomeIcon icon={dept.icon} className="text-red-700 text-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-2">{dept.name}</h4>
                                            <div className="space-y-2 text-sm">
                                                <p className="flex items-center text-gray-600">
                                                    <FontAwesomeIcon icon={faPhoneAlt} className="w-4 mr-2 text-gray-400" />
                                                    {dept.phone}
                                                </p>
                                                <p className="flex items-center text-gray-600">
                                                    <FontAwesomeIcon icon={faEnvelope} className="w-4 mr-2 text-gray-400" />
                                                    {dept.email}
                                                </p>
                                                <p className="flex items-center text-gray-600">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mr-2 text-gray-400" />
                                                    {dept.room}
                                                </p>
                                                <p className="flex items-center text-gray-600">
                                                    <FontAwesomeIcon icon={faClock} className="w-4 mr-2 text-gray-400" />
                                                    {dept.hours}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedDepartment === dept.id && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                            <a
                                                href={`tel:${dept.phone.replace(/\s/g, '')}`}
                                                className="flex-1 bg-white text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1 border-2 border-red-700"
                                            >
                                                <FontAwesomeIcon icon={faPhone} />
                                                <span>Gọi ngay</span>
                                            </a>
                                            <a
                                                href={`mailto:${dept.email}`}
                                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:border-red-700 hover:text-red-700 transition-colors flex items-center justify-center space-x-1"
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                <span>Gửi email</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Map Tab */}
                    {activeTab === 'map' && (
                        <div className="space-y-8">
                            {/* Campuses */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <FontAwesomeIcon icon={faUniversity} className="text-red-700 mr-3" />
                                    Các cơ sở đào tạo
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {campuses.map((campus, index) => (
                                        <div
                                            key={index}
                                            className={`bg-white rounded-2xl p-6 border-2 transition-all ${campus.isMain
                                                ? 'border-red-700 shadow-lg'
                                                : 'border-gray-100 hover:border-red-200'
                                                }`}
                                        >
                                            {campus.isMain && (
                                                <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
                                                    Cơ sở chính
                                                </span>
                                            )}
                                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                                <FontAwesomeIcon icon={faLandmark} className="text-red-700 mr-2" />
                                                {campus.name}
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <p className="flex items-start">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mr-2 mt-1 text-gray-400" />
                                                    {campus.address}
                                                </p>
                                                <p className="flex items-center">
                                                    <FontAwesomeIcon icon={faPhone} className="w-4 mr-2 text-gray-400" />
                                                    {campus.phone}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {campus.features.map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Transport Info */}
                            <div className="bg-white rounded-3xl p-8 border-2 border-red-700">
                                <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center">
                                    <FontAwesomeIcon icon={faRoad} className="mr-3" />
                                    Hướng dẫn di chuyển
                                </h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {transportInfo.map((transport, index) => (
                                        <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                                                <FontAwesomeIcon icon={transport.icon} className="text-red-700 text-xl" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-3">{transport.title}</h4>
                                            <ul className="space-y-2">
                                                {transport.lines.map((line, idx) => (
                                                    <li key={idx} className="text-gray-600 text-sm flex items-center">
                                                        <FontAwesomeIcon icon={faLocationArrow} className="w-3 mr-2 text-red-500" />
                                                        {line}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Office Hours Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-16">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Lưu ý về giờ làm việc</h4>
                            <p className="text-gray-600 text-sm">
                                Các phòng ban làm việc từ <strong>Thứ Hai đến Thứ Sáu (7: 30 - 17:00)</strong> và
                                <strong> Thứ Bảy (8:00 - 11:30)</strong>.  Ngoài giờ làm việc, vui lòng để lại tin nhắn
                                hoặc email, chúng tôi sẽ phản hồi trong ngày làm việc tiếp theo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-red-700">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">
                            Bạn cần hỗ trợ ngay?
                        </h3>
                        <p className="text-red-700 mb-8">
                            Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn.
                            Gọi ngay hotline hoặc đặt lịch hẹn tư vấn trực tiếp.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:1900xxxx"
                                className="bg-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-800 transition-colors flex items-center space-x-2"
                            >
                                <FontAwesomeIcon icon={faPhone} />
                                <span>Gọi 1900 xxxx</span>
                            </a>
                            <button className="border-2 border-red-700 text-red-700 px-8 py-4 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center space-x-2">
                                <FontAwesomeIcon icon={faCalendarCheck} />
                                <span>Đặt lịch hẹn</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div >

            {/* Result Modal */}
            <Modal
                isOpen={modal.open}
                onClose={() => setModal(prev => ({ ...prev, open: false }))}
                size="sm"
                closeOnOverlayClick
                icon={modal.success ? faCheckCircle : faExclamationCircle}
                iconColor={modal.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                title={modal.success ? 'Gửi thành công!' : 'Gửi thất bại'}
            >
                <p className="text-gray-600 text-sm leading-relaxed">{modal.message}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setModal(prev => ({ ...prev, open: false }))}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-colors ${modal.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        Đóng
                    </button>
                </div>
            </Modal>
        </section >
    );
};

export default ContactSection;