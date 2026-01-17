'use client';

import React, { useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap,
    faUser,
    faLock,
    faEye,
    faEyeSlash,
    faSignInAlt,
    faSpinner,
    faExclamationTriangle,
    faCheckCircle,
    faUniversity,
    faPhone,
    faEnvelope,
    faShieldAlt,
    faUserGraduate,
    faBook,
    faAward
} from '@fortawesome/free-solid-svg-icons';
import router from 'next/router';

interface LoginFormData {
    tenDangNhap: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
    message?: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        tenDangNhap: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    // Kiểm tra form hợp lệ
    const isFormValid = formData.tenDangNhap.trim() !== '' && formData.password.trim() !== '';

    // Xử lý thay đổi input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error khi user bắt đầu nhập lại
        if (error) setError(null);
    };

    // Hàm decode JWT đơn giản (không cần thư viện, vì JWT là base64)
    const decodeJWT = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Lỗi decode token:', e);
            return null;
        }
    };

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
    };

    // Lưu access_token vào cookie
    const setCookie = (name: string, value: string, days: number = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    };

    // Xử lý đăng nhập
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenDangNhap: formData.tenDangNhap,
                    password: formData.password
                }),
            });

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            }

            if (data.access_token) {
                const decoded = decodeJWT(data.access_token);

                if (decoded && decoded.vaiTro === 'SINH_VIEN') {
                    // Là sinh viên → lưu cookie và redirect
                    setCookie('access_token', data.access_token, rememberMe ? 30 : 7);
                    router.push("/");
                } else {
                    // Không phải sinh viên → xóa token (nếu có), hiển thị lỗi
                    deleteCookie('access_token');
                    setError('Bạn không phải đối tượng phù hợp. Đây là trang dành cho sinh viên. Vui lòng đăng nhập bằng tài khoản sinh viên.');
                }
            } else {
                throw new Error('Không nhận được token từ server.');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: faUserGraduate, text: 'Quản lý thông tin cá nhân' },
        { icon: faBook, text: 'Tra cứu điểm & lớp học phần' },
        { icon: faAward, text: 'Tra cứu khen thưởng & kỷ luật' },
        { icon: faShieldAlt, text: 'Bảo mật thông tin tuyệt đối' }
    ];

    // Kiểm tra nếu đã có access_token thì redirect về trang chủ
    React.useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return undefined;
        };

        const token = getCookie('access_token');
        if (token) {
            router.push("/"); // hoặc dùng next/navigation nếu dùng App Router
        }
    }, []); // Chỉ chạy 1 lần khi component mount

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-red-700 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-700 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-700 rounded-full"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-4 mb-12">
                        <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">ĐẠI HỌC THỦ ĐÔ HÀ NỘI</h1>
                            <p className="text-red-700 font-medium">HANOI METROPOLITAN UNIVERSITY</p>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="mb-12">
                        <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            Chào mừng đến với
                            <span className="block text-red-700">Cổng thông tin Sinh viên</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Hệ thống quản lý thông tin sinh viên trực tuyến giúp bạn dễ dàng
                            tra cứu điểm, tra cứu lớp học phần và cập nhật thông tin cá nhân.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FontAwesomeIcon icon={feature.icon} className="text-red-700" />
                                </div>
                                <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">Cần hỗ trợ? Liên hệ: </p>
                        <div className="flex items-center space-x-6 text-sm">
                            <a href="tel:1900xxxx" className="flex items-center text-gray-600 hover:text-red-700 transition-colors">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-red-700" />
                                <span>1900 xxxx</span>
                            </a>
                            <a href="mailto: support@hnmu.edu.vn" className="flex items-center text-gray-600 hover:text-red-700 transition-colors">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-red-700" />
                                <span>support@hnmu.edu.vn</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-3xl" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">ĐẠI HỌC THỦ ĐÔ HÀ NỘI</h1>
                        <p className="text-red-700 text-sm font-medium">HANOI METROPOLITAN UNIVERSITY</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faUniversity} className="text-red-700 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                            <p className="text-gray-500">Sử dụng tài khoản sinh viên của bạn</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 mt-0.5" />
                                <div>
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="tenDangNhap" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên đăng nhập <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="tenDangNhap"
                                        name="tenDangNhap"
                                        value={formData.tenDangNhap}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="Nhập mã sinh viên hoặc tên đăng nhập"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                                        placeholder="Nhập mật khẩu"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-red-700 focus:ring-red-500 cursor-pointer"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                                </label>
                                <a href="#forgot-password" className="text-sm text-red-700 hover:text-red-800 font-medium transition-colors">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${isFormValid && !isLoading
                                    ? 'bg-red-700 text-white hover:bg-red-800 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                        <span>Đang đăng nhập... </span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSignInAlt} />
                                        <span>Đăng nhập</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                        </div>
                        {/* Footer Note */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Bằng việc đăng nhập, bạn đồng ý với{' '}
                                <a href="#" className="text-red-700 hover:underline">Điều khoản sử dụng</a>
                                {' '}và{' '}
                                <a href="#" className="text-red-700 hover:underline">Chính sách bảo mật</a>
                                {' '}của Đại học Thủ Đô Hà Nội.
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-gray-500 hover:text-red-700 transition-colors">
                            ← Quay lại trang chủ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;