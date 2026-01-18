'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap,
    faEye,
    faSpinner,
    faBook,
    faLayerGroup,
    faCalendarAlt,
    faChalkboardTeacher,
    faUsers,
    faInfoCircle,
    faSync,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faClipboardList,
    faCreditCard,
    faBuilding,
    faBookOpen,
    faLock,
    faLockOpen,
    faHashtag,
    faStickyNote,
    faListAlt,
    faUniversity,
    faUserGraduate
} from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { useRouter } from 'next/navigation';

// ==================== INTERFACES ====================

interface Nganh {
    id: number;
    maNganh: string;
    tenNganh: string;
    moTa: string;
}

interface NienKhoa {
    id: number;
    maNienKhoa: string;
    tenNienKhoa: string;
    namBatDau: number;
    namKetThuc: number;
    moTa: string;
}

interface ChuongTrinh {
    id: number;
    tenChuongTrinh: string;
    maChuongTrinh: string;
    thoiGianDaoTao: number;
    nganh: Nganh;
    nienKhoaApDung: NienKhoa;
}

interface MonHocInfo {
    id: number;
    maMonHoc: string;
    tenMonHoc: string;
    soTinChi: number;
}

interface MonHocCTDT {
    id: number;
    thuTuHocKy: number;
    monHoc: MonHocInfo;
    ghiChu: string;
}

interface LopHocPhanMonHoc {
    maMonHoc: string;
    tenMonHoc: string;
}

interface LopHocPhan {
    id: number;
    maLopHocPhan: string;
    monHoc: LopHocPhanMonHoc;
    hocKy: string;
    nienKhoa: string;
    giangVien: string;
    siSo: number;
    daDangKy: boolean;
    khoaDiem: boolean;
}

interface ApiResponse {
    chuongTrinh: ChuongTrinh;
    monHocs: MonHocCTDT[];
    lopHocPhans: LopHocPhan[];
    tongSoMon: number;
    tongSoLopTrongCTDT: number;
}

interface AlertState {
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

// ==================== MAIN COMPONENT ====================

const ChuongTrinhDaoTaoPage: React.FC = () => {
    // Data states
    const [data, setData] = useState<ApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMonHoc, setSelectedMonHoc] = useState<MonHocCTDT | null>(null);
    const router = useRouter();
    // Alert state
    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        type: 'info',
        message: ''
    });

    // ==================== HELPERS ====================

    const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    };

    const showAlert = (type: AlertState['type'], message: string) => {
        setAlertState({ show: true, type, message });
    };

    // ==================== API CALLS ====================

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const token = getCookie('access_token');

            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('http://localhost:3000/dao-tao/chuong-trinh/tat-ca-mon-hoc/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải chương trình đào tạo');
            }

            const result: ApiResponse = await response.json();
            setData(result);
        } catch (err) {
            showAlert('error', err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        } finally {
            setIsLoading(false);
        }
    };

    // ==================== EFFECTS ====================

    useEffect(() => {
        fetchData();
    }, []);

    // ==================== COMPUTED VALUES ====================

    // Get lớp học phần for selected môn học
    const lopHocPhansForMonHoc = useMemo(() => {
        if (!selectedMonHoc || !data) return [];
        return data.lopHocPhans.filter(
            lhp => lhp.monHoc.maMonHoc === selectedMonHoc.monHoc.maMonHoc
        );
    }, [selectedMonHoc, data]);

    // Statistics
    const statistics = useMemo(() => {
        if (!data) return { tongMon: 0, tongTinChi: 0, tongLop: 0, daDangKy: 0 };

        const tongTinChi = data.monHocs.reduce((sum, mh) => sum + mh.monHoc.soTinChi, 0);
        const daDangKy = data.lopHocPhans.filter(lhp => lhp.daDangKy).length;

        return {
            tongMon: data.tongSoMon,
            tongTinChi,
            tongLop: data.tongSoLopTrongCTDT,
            daDangKy
        };
    }, [data]);

    // Group môn học by học kỳ
    const monHocsByHocKy = useMemo(() => {
        if (!data) return {};

        const grouped: Record<number, MonHocCTDT[]> = {};
        data.monHocs.forEach(mh => {
            if (!grouped[mh.thuTuHocKy]) {
                grouped[mh.thuTuHocKy] = [];
            }
            grouped[mh.thuTuHocKy].push(mh);
        });

        return grouped;
    }, [data]);

    // ==================== HANDLERS ====================

    const handleViewDetail = (monHoc: MonHocCTDT) => {
        setSelectedMonHoc(monHoc);
        setIsDetailModalOpen(true);
    };

    // Get số lớp học phần for môn học
    const getSoLopHocPhan = (maMonHoc: string) => {
        if (!data) return 0;
        return data.lopHocPhans.filter(lhp => lhp.monHoc.maMonHoc === maMonHoc).length;
    };

    // Check if đã đăng ký môn học
    const isDaDangKy = (maMonHoc: string) => {
        if (!data) return false;
        return data.lopHocPhans.some(lhp => lhp.monHoc.maMonHoc === maMonHoc && lhp.daDangKy);
    };

    // ==================== TABLE COLUMNS ====================

    const monHocColumns = [
        {
            key: 'monHoc. maMonHoc',
            header: 'Mã MH',
            width: '120px',
            render: (_: any, row: MonHocCTDT) => (
                <span className="font-mono text-sm font-medium text-gray-900">
                    {row.monHoc.maMonHoc}
                </span>
            )
        },
        {
            key: 'monHoc.tenMonHoc',
            header: 'Tên môn học',
            render: (_: any, row: MonHocCTDT) => (
                <div>
                    <p className="font-medium text-gray-900">{row.monHoc.tenMonHoc}</p>
                    {row.ghiChu && (
                        <p className="text-xs text-gray-500 mt-0.5">{row.ghiChu}</p>
                    )}
                </div>
            )
        },
        {
            key: 'monHoc. soTinChi',
            header: 'Tín chỉ',
            width: '120px',
            align: 'center' as const,
            render: (_: any, row: MonHocCTDT) => (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-lg font-semibold">
                    {row.monHoc.soTinChi}
                </span>
            )
        },
        {
            key: 'thuTuHocKy',
            header: 'Học kỳ',
            width: '140px',
            align: 'center' as const,
            render: (value: number) => (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                    HK {value}
                </span>
            )
        },
        {
            key: 'soLop',
            header: 'Số lớp HP',
            width: '160px',
            align: 'center' as const,
            render: (_: any, row: MonHocCTDT) => {
                const soLop = getSoLopHocPhan(row.monHoc.maMonHoc);
                return (
                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium ${soLop > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {soLop} lớp
                    </span>
                );
            }
        },
        {
            key: 'actions',
            header: 'Hành động',
            width: '150px',
            align: 'center' as const,
            render: (_: any, row: MonHocCTDT) => (
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={faEye}
                    onClick={() => handleViewDetail(row)}
                >
                    Xem
                </Button>
            )
        }
    ];

    const lopHocPhanColumns = [
        {
            key: 'maLopHocPhan',
            header: 'Mã LHP',
            width: '200px',
            render: (value: string) => (
                <span className="font-mono text-sm font-medium text-gray-900">{value}</span>
            )
        },
        {
            key: 'giangVien',
            header: 'Giảng viên',
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-500 text-sm" />
                    </div>
                    <span className="text-gray-700">{value}</span>
                </div>
            )
        },
        {
            key: 'hocKy',
            header: 'Học kỳ',
            width: '200px',
            render: (value: string) => (
                <span className="text-sm text-gray-600">{value}</span>
            )
        },
        {
            key: 'siSo',
            header: 'Sĩ số',
            width: '80px',
            align: 'center' as const,
            render: (value: number) => (
                <span className="inline-flex items-center gap-1 text-gray-700">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                    {value}
                </span>
            )
        },
        {
            key: 'daDangKy',
            header: 'Đã ĐK',
            width: '100px',
            align: 'center' as const,
            render: (value: boolean) => (
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                    <FontAwesomeIcon icon={value ? faCheckCircle : faTimesCircle} />
                </span>
            )
        },
        {
            key: 'khoaDiem',
            header: 'Khóa điểm',
            width: '100px',
            align: 'center' as const,
            render: (value: boolean) => (
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${value ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                    <FontAwesomeIcon icon={value ? faLock : faLockOpen} />
                </span>
            )
        }
    ];

    // ==================== RENDER ====================

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faSpinner} className="text-2xl text-red-700 animate-spin" />
                    </div>
                    <p className="text-gray-600 font-medium">Đang tải chương trình đào tạo...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Alert
                    type="error"
                    title="Lỗi"
                    message="Không thể tải chương trình đào tạo"
                    action={{
                        label: 'Thử lại',
                        onClick: fetchData
                    }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8">
                {/* Alert */}
                {alertState.show && (
                    <div className="mb-6">
                        <Alert
                            type={alertState.type}
                            message={alertState.message}
                            dismissible
                            timeout={5000}
                            onDismiss={() => setAlertState({ ...alertState, show: false })}
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faGraduationCap} className="text-red-700" />
                                </div>
                                Chương trình đào tạo
                            </h1>
                            <p className="text-gray-500 mt-1">Danh sách các môn học trong chương trình</p>
                        </div>
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

                {/* Program Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Program Header */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon icon={faUniversity} className="text-3xl text-red-700" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {data.chuongTrinh.tenChuongTrinh}
                                </h2>
                                <p className="text-sm text-gray-500 font-mono">
                                    Mã:  {data.chuongTrinh.maChuongTrinh}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1. 5 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                        <FontAwesomeIcon icon={faBuilding} className="text-xs" />
                                        {data.chuongTrinh.nganh.tenNganh}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                        <FontAwesomeIcon icon={faUserGraduate} className="text-xs" />
                                        {data.chuongTrinh.nienKhoaApDung.tenNienKhoa}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                        <FontAwesomeIcon icon={faClock} className="text-xs" />
                                        {data.chuongTrinh.thoiGianDaoTao} năm
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <MiniStatCard
                                icon={faBook}
                                label="Môn học"
                                value={statistics.tongMon}
                                color="bg-red-100 text-red-700"
                            />
                            <MiniStatCard
                                icon={faCreditCard}
                                label="Tín chỉ"
                                value={statistics.tongTinChi}
                                color="bg-blue-100 text-blue-700"
                            />
                            <MiniStatCard
                                icon={faLayerGroup}
                                label="Lớp HP"
                                value={statistics.tongLop}
                                color="bg-green-100 text-green-700"
                            />
                            <MiniStatCard
                                icon={faCheckCircle}
                                label="Đã ĐK"
                                value={statistics.daDangKy}
                                color="bg-yellow-100 text-yellow-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Môn học Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <FontAwesomeIcon icon={faClipboardList} className="text-red-700" />
                                Danh sách môn học
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({data.monHocs.length} môn)
                                </span>
                            </h3>
                        </div>
                    </div>

                    <Table
                        columns={monHocColumns}
                        data={data.monHocs}
                        emptyMessage="Không có môn học trong chương trình"
                        striped
                        hoverable
                    />
                </div>

                {/* Summary by Học kỳ */}
                <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-red-700" />
                        Phân bố theo học kỳ
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {Object.entries(monHocsByHocKy).map(([hocKy, monHocs]) => (
                            <div
                                key={hocKy}
                                className="bg-gray-50 rounded-xl p-4 text-center hover:bg-red-50 transition-colors"
                            >
                                <p className="text-sm text-gray-500 mb-1">Học kỳ {hocKy}</p>
                                <p className="text-2xl font-bold text-gray-900">{monHocs.length}</p>
                                <p className="text-xs text-gray-400">môn học</p>
                                <p className="text-sm font-medium text-red-700 mt-1">
                                    {monHocs.reduce((sum, mh) => sum + mh.monHoc.soTinChi, 0)} TC
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail Modal */}
                <Modal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    title="Chi tiết môn học"
                    icon={faInfoCircle}
                    iconColor="bg-red-100 text-red-700"
                    size="full"
                    footer={
                        <div className="flex justify-end">
                            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                                Đóng
                            </Button>
                        </div>
                    }
                >
                    {selectedMonHoc && (
                        <div className="space-y-6">
                            {/* Môn học Header */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FontAwesomeIcon icon={faBook} className="text-2xl text-red-700" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {selectedMonHoc.monHoc.tenMonHoc}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-mono">
                                            {selectedMonHoc.monHoc.maMonHoc}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                                <FontAwesomeIcon icon={faCreditCard} className="text-xs" />
                                                {selectedMonHoc.monHoc.soTinChi} tín chỉ
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                                                Học kỳ {selectedMonHoc.thuTuHocKy}
                                            </span>
                                            {isDaDangKy(selectedMonHoc.monHoc.maMonHoc) && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                                                    Đã đăng ký
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ghi chú */}
                            {selectedMonHoc.ghiChu && (
                                <div className="bg-yellow-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faStickyNote} className="text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">Ghi chú</p>
                                            <p className="text-sm text-yellow-700">{selectedMonHoc.ghiChu}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lớp học phần */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faListAlt} className="text-red-700" />
                                    Danh sách lớp học phần
                                    <span className="text-sm font-normal text-gray-500">
                                        ({lopHocPhansForMonHoc.length} lớp)
                                    </span>
                                </h4>

                                {lopHocPhansForMonHoc.length > 0 ? (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <Table
                                            columns={lopHocPhanColumns}
                                            data={lopHocPhansForMonHoc}
                                            emptyMessage="Không có lớp học phần"
                                            compact
                                            striped
                                            hoverable
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FontAwesomeIcon icon={faLayerGroup} className="text-2xl text-gray-400" />
                                        </div>
                                        <p className="text-gray-500">Chưa có lớp học phần cho môn học này</p>
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            {lopHocPhansForMonHoc.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-500 mb-1">Tổng lớp</p>
                                        <p className="text-2xl font-bold text-gray-900">{lopHocPhansForMonHoc.length}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-green-600 mb-1">Đã đăng ký</p>
                                        <p className="text-2xl font-bold text-green-700">
                                            {lopHocPhansForMonHoc.filter(l => l.daDangKy).length}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <p className="text-sm text-blue-600 mb-1">Tổng sĩ số</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {lopHocPhansForMonHoc.reduce((sum, l) => sum + l.siSo, 0)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

// ==================== SUB COMPONENTS ====================

interface MiniStatCardProps {
    icon: any;
    label: string;
    value: number;
    color: string;
}

const MiniStatCard: React.FC<MiniStatCardProps> = ({ icon, label, value, color }) => (
    <div className="text-center">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
            <FontAwesomeIcon icon={icon} />
        </div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
    </div>
);

export default ChuongTrinhDaoTaoPage;