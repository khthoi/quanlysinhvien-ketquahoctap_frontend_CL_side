'use client';

import { ENV } from "@/config/env";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faKey,
    faIdCard,
    faCalendarAlt,
    faVenusMars,
    faMapMarkerAlt,
    faEnvelope,
    faPhone,
    faGraduationCap,
    faBuilding,
    faUserGraduate,
    faSpinner,
    faTimes,
    faCheckCircle,
    faExclamationTriangle,
    faLock,
    faShieldAlt,
    faSignOutAlt,
    faClock
} from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { useRouter } from 'next/navigation';

// Interfaces
interface Khoa {
    id: number;
    maKhoa: string;
    tenKhoa: string;
    moTa: string;
    ngayThanhLap: string;
}

interface Nganh {
    id: number;
    maNganh: string;
    tenNganh: string;
    moTa: string;
    khoa: Khoa;
}

interface NienKhoa {
    id: number;
    maNienKhoa: string;
    tenNienKhoa: string;
    namBatDau: number;
    namKetThuc: number;
    moTa: string;
}

interface Lop {
    id: number;
    maLop: string;
    tenLop: string;
    nganh: Nganh;
    nienKhoa: NienKhoa;
}

interface SinhVienProfile {
    id: number;
    maSinhVien: string;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    diaChi: string;
    email: string;
    sdt: string;
    ngayNhapHoc: string;
    tinhTrang: string;
    lop: Lop;
    khenThuongKyLuat: any[];
}

interface AlertState {
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

// Tình trạng mapping
const tinhTrangMapping: Record<string, { label: string; color: string }> = {
    DANG_HOC: { label: 'Đang học', color: 'bg-green-100 text-green-700' },
    TAM_NGHI: { label: 'Tạm nghỉ', color: 'bg-yellow-100 text-yellow-700' },
    DA_TOT_NGHIEP: { label: 'Đã tốt nghiệp', color: 'bg-blue-100 text-blue-700' },
    BI_DUOI: { label: 'Bị đuổi', color: 'bg-red-100 text-red-700' }
};

// Giới tính mapping
const gioiTinhMapping: Record<string, string> = {
    NAM: 'Nam',
    NU: 'Nữ',
    KHONG_XAC_DINH: 'Không xác định'
};

const UserProfileInfo: React.FC = () => {
    // States
    const [profile, setProfile] = useState<SinhVienProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Modal states
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Password states
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // OTP states
    const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Logout countdown
    const [logoutCountdown, setLogoutCountdown] = useState(5);

    // Alert state
    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    // Get cookie helper
    const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    };

    // Delete cookie helper
    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // Show alert helper
    const showAlert = (type: AlertState['type'], title: string, message: string) => {
        setAlertState({ show: true, type, title, message });
    };

    // Fetch profile
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const token = getCookie('access_token');

            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('${ENV.BACKEND_URL}/sinh-vien/me/my-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin người dùng');
            }

            const data: SinhVienProfile = await response.json();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Open password modal
    const handleOpenPasswordModal = () => {
        setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordError(null);
        setIsPasswordModalOpen(true);
    };

    // Validate password
    const validatePassword = (): string | null => {
        if (!passwordData.oldPassword) {
            return 'Vui lòng nhập mật khẩu cũ';
        }
        if (!passwordData.newPassword) {
            return 'Vui lòng nhập mật khẩu mới';
        }
        if (passwordData.newPassword.length < 6) {
            return 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return 'Xác nhận mật khẩu không khớp';
        }
        if (passwordData.oldPassword === passwordData.newPassword) {
            return 'Mật khẩu mới không được trùng với mật khẩu cũ';
        }
        return null;
    };

    // Handle change password
    const handleChangePassword = async () => {
        const validationError = validatePassword();
        if (validationError) {
            setPasswordError(validationError);
            return;
        }

        try {
            setIsChangingPassword(true);
            setPasswordError(null);

            const token = getCookie('access_token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('${ENV.BACKEND_URL}/auth/change-password/me', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đổi mật khẩu thất bại');
            }

            // Success - show OTP modal
            setIsPasswordModalOpen(false);
            setOtpValues(['', '', '', '', '', '']);
            setOtpError(null);
            setIsOtpModalOpen(true);
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow numbers

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value.slice(-1); // Only take last character
        setOtpValues(newOtpValues);

        // Auto focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    // Handle OTP keydown
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtpValues = [...otpValues];

        for (let i = 0; i < pastedData.length; i++) {
            newOtpValues[i] = pastedData[i];
        }

        setOtpValues(newOtpValues);

        // Focus last filled input or first empty
        const focusIndex = Math.min(pastedData.length, 5);
        otpInputRefs.current[focusIndex]?.focus();
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        const otp = otpValues.join('');

        if (otp.length !== 6) {
            setOtpError('Vui lòng nhập đủ 6 số');
            return;
        }

        try {
            setIsVerifyingOtp(true);
            setOtpError(null);

            const token = getCookie('access_token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('${ENV.BACKEND_URL}/auth/change-password/verify-otp', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Xác thực OTP thất bại');
            }

            // Success - show logout countdown modal
            setIsOtpModalOpen(false);
            setLogoutCountdown(5);
            setIsLogoutModalOpen(true);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    // Logout countdown effect
    useEffect(() => {
        if (isLogoutModalOpen && logoutCountdown > 0) {
            const timer = setTimeout(() => {
                setLogoutCountdown(logoutCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isLogoutModalOpen && logoutCountdown === 0) {
            deleteCookie('access_token');
            router.push('/login');
        }
    }, [isLogoutModalOpen, logoutCountdown]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-4xl text-red-700 animate-spin mb-4" />
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Alert
                    type="error"
                    title="Lỗi!"
                    message={error}
                    action={{
                        label: 'Thử lại',
                        onClick: () => fetchProfile()
                    }}
                />
            </div>
        );
    }

    if (!profile) return null;

    const tinhTrang = tinhTrangMapping[profile.tinhTrang] || {
        label: profile.tinhTrang,
        color: 'bg-gray-100 text-gray-700'
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Alert */}
                {alertState.show && (
                    <div className="mb-6">
                        <Alert
                            type={alertState.type}
                            title={alertState.title}
                            message={alertState.message}
                            dismissible
                            timeout={5000}
                            onDismiss={() => setAlertState({ ...alertState, show: false })}
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
                    <p className="text-gray-600 mt-1">Xem và quản lý thông tin tài khoản của bạn</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Button
                        variant="primary"
                        leftIcon={faKey}
                        onClick={handleOpenPasswordModal}
                    >
                        Thay đổi mật khẩu
                    </Button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gray-50 border-b border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faUserGraduate} className="text-3xl text-red-700" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{profile.hoTen}</h2>
                                <p className="text-gray-600">MSV:  {profile.maSinhVien}</p>
                                <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium ${tinhTrang.color}`}>
                                    {tinhTrang.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Thông tin cá nhân */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-red-700" />
                                    Thông tin cá nhân
                                </h3>
                                <div className="space-y-4">
                                    <InfoRow
                                        icon={faIdCard}
                                        label="Mã sinh viên"
                                        value={profile.maSinhVien}
                                    />
                                    <InfoRow
                                        icon={faCalendarAlt}
                                        label="Ngày sinh"
                                        value={formatDate(profile.ngaySinh)}
                                    />
                                    <InfoRow
                                        icon={faVenusMars}
                                        label="Giới tính"
                                        value={gioiTinhMapping[profile.gioiTinh] || profile.gioiTinh}
                                    />
                                    <InfoRow
                                        icon={faMapMarkerAlt}
                                        label="Địa chỉ"
                                        value={profile.diaChi}
                                    />
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-red-700" />
                                    Thông tin liên hệ
                                </h3>
                                <div className="space-y-4">
                                    <InfoRow
                                        icon={faEnvelope}
                                        label="Email"
                                        value={profile.email}
                                    />
                                    <InfoRow
                                        icon={faPhone}
                                        label="Số điện thoại"
                                        value={profile.sdt}
                                    />
                                </div>
                            </div>

                            {/* Thông tin học tập */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-red-700" />
                                    Thông tin học tập
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InfoRow
                                        icon={faBuilding}
                                        label="Khoa"
                                        value={profile.lop.nganh.khoa.tenKhoa}
                                    />
                                    <InfoRow
                                        icon={faGraduationCap}
                                        label="Ngành"
                                        value={profile.lop.nganh.tenNganh}
                                    />
                                    <InfoRow
                                        icon={faUserGraduate}
                                        label="Lớp"
                                        value={profile.lop.tenLop}
                                    />
                                    <InfoRow
                                        icon={faCalendarAlt}
                                        label="Niên khóa"
                                        value={profile.lop.nienKhoa.tenNienKhoa}
                                    />
                                    <InfoRow
                                        icon={faCalendarAlt}
                                        label="Ngày nhập học"
                                        value={formatDate(profile.ngayNhapHoc)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                <Modal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    title="Thay đổi mật khẩu"
                    description="Nhập mật khẩu cũ và mật khẩu mới"
                    icon={faKey}
                    iconColor="bg-yellow-100 text-yellow-600"
                    size="md"
                    footer={
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setIsPasswordModalOpen(false)}
                                disabled={isChangingPassword}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                leftIcon={faShieldAlt}
                                onClick={handleChangePassword}
                                isLoading={isChangingPassword}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-4">
                        {passwordError && (
                            <Alert type="error" message={passwordError} />
                        )}

                        <Input
                            label="Mật khẩu cũ"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            leftIcon={faLock}
                            required
                            fullWidth
                        />

                        <Input
                            label="Mật khẩu mới"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            leftIcon={faKey}
                            helperText="Mật khẩu phải có ít nhất 6 ký tự"
                            required
                            fullWidth
                        />

                        <Input
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            leftIcon={faKey}
                            error={
                                passwordData.confirmPassword &&
                                    passwordData.newPassword !== passwordData.confirmPassword
                                    ? 'Mật khẩu không khớp'
                                    : undefined
                            }
                            success={
                                passwordData.confirmPassword &&
                                    passwordData.newPassword === passwordData.confirmPassword
                                    ? 'Mật khẩu khớp'
                                    : undefined
                            }
                            required
                            fullWidth
                        />
                    </div>
                </Modal>

                {/* OTP Verification Modal */}
                <Modal
                    isOpen={isOtpModalOpen}
                    onClose={() => setIsOtpModalOpen(false)}
                    title="Xác thực OTP"
                    description="Nhập mã xác thực 6 số đã gửi đến email của bạn"
                    icon={faShieldAlt}
                    iconColor="bg-blue-100 text-blue-600"
                    size="md"
                    closeOnOverlayClick={false}
                    footer={
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setIsOtpModalOpen(false)}
                                disabled={isVerifyingOtp}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                leftIcon={faCheckCircle}
                                onClick={handleVerifyOtp}
                                isLoading={isVerifyingOtp}
                                disabled={otpValues.join('').length !== 6}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-6">
                        {otpError && (
                            <Alert type="error" message={otpError} />
                        )}

                        <div className="flex justify-center gap-3">
                            {otpValues.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { otpInputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={value}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={handleOtpPaste}
                                    className="w-12 h-14 text-center text-2xl font-bold text-black border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                                />
                            ))}
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Không nhận được mã?  <button className="text-red-700 font-medium hover:underline">Gửi lại</button>
                        </p>
                    </div>
                </Modal>

                {/* Logout Countdown Modal */}
                <Modal
                    isOpen={isLogoutModalOpen}
                    onClose={() => { }}
                    title="Đổi mật khẩu thành công!"
                    icon={faCheckCircle}
                    iconColor="bg-green-100 text-green-600"
                    size="sm"
                    showCloseButton={false}
                    closeOnOverlayClick={false}
                    closeOnEscape={false}
                >
                    <div className="text-center py-4">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl font-bold text-red-700">{logoutCountdown}</span>
                        </div>
                        <p className="text-gray-600 mb-2">
                            Mật khẩu đã được thay đổi thành công.
                        </p>
                        <p className="text-gray-600">
                            Hệ thống sẽ tự động đăng xuất sau <span className="font-bold text-red-700">{logoutCountdown}</span> giây...
                        </p>
                        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                            <FontAwesomeIcon icon={faClock} className="mr-2 animate-pulse" />
                            <span>Vui lòng đăng nhập lại với mật khẩu mới</span>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

// Info Row Component
interface InfoRowProps {
    icon: any;
    label: string;
    value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={icon} className="text-gray-500 text-sm" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-900">{value}</p>
        </div>
    </div>
);

export default UserProfileInfo;