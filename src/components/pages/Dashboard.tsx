'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faUserGraduate,
    faChalkboardTeacher,
    faCalendarAlt,
    faGraduationCap,
    faBuilding,
    faBook,
    faLayerGroup,
    faBookOpen,
    faClipboardList,
    faSpinner,
    faExclamationTriangle,
    faArrowUp,
    faArrowDown,
    faCircle,
    faChartPie,
    faEllipsisV,
    faSync,
    faClock,
    faCheckCircle,
    faPauseCircle,
    faTimesCircle,
    faAward,
    faTrophy,
    faUniversity,
    faChartBar,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

// Interfaces
interface ThongKeTongQuan {
    sinhVien: {
        tongSinhVien: number;
        theoTinhTrang: {
            dangHoc: number;
            baoLuu: number;
            thoiHoc: number;
            daTotNghiep: number;
        };
    };
    tongGiangVien: number;
    tongNienKhoa: number;
    tongNganh: number;
    tongKhoa: number;
    tongMonHoc: number;
    tongLop: number;
    tongLopHocPhan: number;
    tongChuongTrinhDaoTao: number;
}

interface StatCardProps {
    icon: any;
    label: string;
    value: number;
    subLabel?: string;
    color: string;
    bgColor: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    subLabel,
    color,
    bgColor,
    trend
}) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
        <div className="flex items-start justify-between">
            <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <FontAwesomeIcon icon={icon} className={`text-xl ${color}`} />
            </div>
            {trend && (
                <div className={`flex items-center space-x-1 text-sm font-medium ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    <FontAwesomeIcon icon={trend.isUp ? faArrowUp : faArrowDown} className="text-xs" />
                    <span>{trend.value}%</span>
                </div>
            )}
        </div>
        <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString('vi-VN')}</p>
            {subLabel && (
                <p className="text-xs text-gray-400 mt-1">{subLabel}</p>
            )}
        </div>
    </div>
);

// Progress Bar Component
interface ProgressBarProps {
    label: string;
    value: number;
    total: number;
    color: string;
    icon: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, total, color, icon }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 ${color.replace('bg-', 'bg-').replace('-500', '-100')} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <FontAwesomeIcon icon={icon} className={`text-sm ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value.toLocaleString('vi-VN')}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1">{percentage}% tổng số</p>
            </div>
        </div>
    );
};

// Donut Chart Component (CSS only)
interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    total: number;
    centerLabel: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, total, centerLabel }) => {
    let cumulativePercentage = 0;

    const segments = data.map(item => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const startAngle = cumulativePercentage * 3.6;
        cumulativePercentage += percentage;
        return { ...item, percentage, startAngle };
    });

    // Generate conic-gradient
    let gradientStops: string[] = [];
    let currentAngle = 0;

    segments.forEach(segment => {
        const endAngle = currentAngle + (segment.percentage * 3.6);
        gradientStops.push(`${segment.color} ${currentAngle}deg ${endAngle}deg`);
        currentAngle = endAngle;
    });

    const gradientStyle = {
        background: `conic-gradient(${gradientStops.join(', ')})`
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative">
                <div
                    className="w-40 h-40 rounded-full"
                    style={gradientStyle}
                />
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{total}</span>
                    <span className="text-xs text-gray-500">{centerLabel}</span>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
    const [data, setData] = useState<ThongKeTongQuan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const router = useRouter();
    
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

    // Fetch data
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = getCookie('access_token');

            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('http://localhost:3000/bao-cao/thong-ke/tong-quan', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu thống kê');
            }

            const result: ThongKeTongQuan = await response.json();
            setData(result);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Format time
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faSpinner} className="text-2xl text-red-700 animate-spin" />
                    </div>
                    <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                    <p className="text-gray-400 text-sm mt-1">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <Alert
                        type="error"
                        title="Không thể tải dữ liệu"
                        message={error}
                        action={{
                            label: 'Thử lại',
                            onClick: fetchData
                        }}
                    />
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Prepare chart data
    const sinhVienChartData = [
        { label: 'Đang học', value: data.sinhVien.theoTinhTrang.dangHoc, color: '#22c55e' },
        { label: 'Bảo lưu', value: data.sinhVien.theoTinhTrang.baoLuu, color: '#eab308' },
        { label: 'Thôi học', value: data.sinhVien.theoTinhTrang.thoiHoc, color: '#ef4444' },
        { label: 'Đã tốt nghiệp', value: data.sinhVien.theoTinhTrang.daTotNghiep, color: '#3b82f6' }
    ];

    // Main stats cards data
    const mainStats: StatCardProps[] = [
        {
            icon: faUserGraduate,
            label: 'Tổng sinh viên',
            value: data.sinhVien.tongSinhVien,
            subLabel: 'Tất cả trạng thái',
            color: 'text-red-700',
            bgColor: 'bg-red-100',
        },
        {
            icon: faChalkboardTeacher,
            label: 'Giảng viên',
            value: data.tongGiangVien,
            subLabel: 'Đang giảng dạy',
            color: 'text-blue-700',
            bgColor: 'bg-blue-100',
        },
        {
            icon: faBuilding,
            label: 'Khoa',
            value: data.tongKhoa,
            subLabel: 'Đơn vị đào tạo',
            color: 'text-purple-700',
            bgColor: 'bg-purple-100'
        },
        {
            icon: faGraduationCap,
            label: 'Ngành đào tạo',
            value: data.tongNganh,
            subLabel: 'Chương trình học',
            color: 'text-green-700',
            bgColor: 'bg-green-100'
        }
    ];

    // Secondary stats
    const secondaryStats = [
        { icon: faCalendarAlt, label: 'Niên khóa', value: data.tongNienKhoa, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { icon: faBook, label: 'Môn học', value: data.tongMonHoc, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
        { icon: faLayerGroup, label: 'Lớp', value: data.tongLop, color: 'text-pink-600', bgColor: 'bg-pink-100' },
        { icon: faBookOpen, label: 'Lớp học phần', value: data.tongLopHocPhan, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
        { icon: faClipboardList, label: 'CTĐT', value: data.tongChuongTrinhDaoTao, color: 'text-teal-600', bgColor: 'bg-teal-100' }
    ];

    // Tình trạng sinh viên data for progress bars
    const tinhTrangData = [
        {
            label: 'Đang học',
            value: data.sinhVien.theoTinhTrang.dangHoc,
            color: 'bg-green-500',
            icon: faCheckCircle
        },
        {
            label: 'Bảo lưu',
            value: data.sinhVien.theoTinhTrang.baoLuu,
            color: 'bg-yellow-500',
            icon: faPauseCircle
        },
        {
            label: 'Thôi học',
            value: data.sinhVien.theoTinhTrang.thoiHoc,
            color: 'bg-red-500',
            icon: faTimesCircle
        },
        {
            label: 'Đã tốt nghiệp',
            value: data.sinhVien.theoTinhTrang.daTotNghiep,
            color: 'bg-blue-500',
            icon: faAward
        }
    ];

    return (
        <>
            <div className='pt-5'></div>
            <div className='pt-5'></div>
            <div className='pt-5'></div>
            <div className='pt-5'></div>
            <div className='pt-5'></div>
            <div className='pt-4'></div>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Tổng quan hệ thống
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Dashboard quản lý Đại học Thủ Đô Hà Nội
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {lastUpdated && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                                        <span>Cập nhật: {formatTime(lastUpdated)}</span>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    leftIcon={faSync}
                                    onClick={fetchData}
                                >
                                    Làm mới
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Banner */}
                    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

                        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUniversity} className="text-2xl text-red-700" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Chào mừng đến với cổng thông tin sinh viên
                                    </h2>
                                    <p className="text-gray-500">
                                        Đại học Thủ Đô Hà Nội - Hanoi Metropolitan University
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-bold text-red-700">{data.sinhVien.tongSinhVien}</p>
                                    <p className="text-xs text-gray-500">Sinh viên</p>
                                </div>
                                <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-bold text-blue-700">{data.tongGiangVien}</p>
                                    <p className="text-xs text-gray-500">Giảng viên</p>
                                </div>
                                <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-bold text-purple-700">{data.tongKhoa}</p>
                                    <p className="text-xs text-gray-500">Khoa</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {mainStats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-8">
                        {/* Student Status Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Phân bổ sinh viên</h3>
                                    <p className="text-sm text-gray-500">Theo tình trạng học tập</p>
                                </div>
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                                    <FontAwesomeIcon icon={faEllipsisV} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Donut Chart */}
                                <div className="flex items-center justify-center">
                                    <DonutChart
                                        data={sinhVienChartData}
                                        total={data.sinhVien.tongSinhVien}
                                        centerLabel="Sinh viên" />
                                </div>

                                {/* Legend & Stats */}
                                <div className="space-y-4">
                                    {tinhTrangData.map((item, index) => (
                                        <ProgressBar
                                            key={index}
                                            label={item.label}
                                            value={item.value}
                                            total={data.sinhVien.tongSinhVien}
                                            color={item.color}
                                            icon={item.icon} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Thống kê nhanh</h3>
                                    <p className="text-sm text-gray-500">Tổng quan hệ thống</p>
                                </div>
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faChartBar} className="text-red-700" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {secondaryStats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                                <FontAwesomeIcon icon={stat.icon} className={`text-sm ${stat.color}`} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid - Additional Info */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Ratio Card - Students per Teacher */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUsers} className="text-xl text-blue-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Tỷ lệ SV/GV</h3>
                                    <p className="text-sm text-gray-500">Sinh viên trên mỗi giảng viên</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-4xl font-bold text-gray-900">
                                        {data.tongGiangVien > 0
                                            ? (data.sinhVien.tongSinhVien / data.tongGiangVien).toFixed(1)
                                            : 0}
                                    </span>
                                    <span className="text-gray-500 ml-1">: 1</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Students Percentage */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-green-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Tỷ lệ đang học</h3>
                                    <p className="text-sm text-gray-500">Sinh viên đang theo học</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-4xl font-bold text-gray-900">
                                        {data.sinhVien.tongSinhVien > 0
                                            ? Math.round((data.sinhVien.theoTinhTrang.dangHoc / data.sinhVien.tongSinhVien) * 100)
                                            : 0}
                                    </span>
                                    <span className="text-gray-500 ml-1">%</span>
                                </div>
                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{
                                            width: `${data.sinhVien.tongSinhVien > 0
                                                ? (data.sinhVien.theoTinhTrang.dangHoc / data.sinhVien.tongSinhVien) * 100
                                                : 0}%`
                                        }} />
                                </div>
                            </div>
                        </div>

                        {/* Courses per Major */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBook} className="text-xl text-purple-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Môn học/Ngành</h3>
                                    <p className="text-sm text-gray-500">Trung bình môn học mỗi ngành</p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-4xl font-bold text-gray-900">
                                        {data.tongNganh > 0
                                            ? (data.tongMonHoc / data.tongNganh).toFixed(1)
                                            : 0}
                                    </span>
                                    <span className="text-gray-500 ml-1">môn</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Tổng:  {data.tongMonHoc} môn</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 border-2 border-red-100 shadow-xl shadow-red-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            <SummaryItem
                                icon={faUserGraduate}
                                label="Sinh viên"
                                value={data.sinhVien.tongSinhVien} />
                            <SummaryItem
                                icon={faChalkboardTeacher}
                                label="Giảng viên"
                                value={data.tongGiangVien} />
                            <SummaryItem
                                icon={faBuilding}
                                label="Khoa"
                                value={data.tongKhoa} />
                            <SummaryItem
                                icon={faLayerGroup}
                                label="Lớp"
                                value={data.tongLop} />
                            <SummaryItem
                                icon={faBookOpen}
                                label="Lớp học phần"
                                value={data.tongLopHocPhan}
                                className="col-span-2 md:col-span-1" />
                        </div>
                    </div>
                </div>
            </div></>
    );
};

// Summary Item Component
interface SummaryItemProps {
    icon: any;
    label: string;
    value: number;
    className?: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ icon, label, value, className = '' }) => (
    <div className={`text-center ${className}`}>
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={icon} className="text-xl text-red-600" />
        </div>
        <p className="text-2xl md:text-3xl font-bold text-slate-900">{value.toLocaleString('vi-VN')}</p>
        <p className="text-sm text-slate-600">{label}</p>
    </div>
);

export default DashboardPage;