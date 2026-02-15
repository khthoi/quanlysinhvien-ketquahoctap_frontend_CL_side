'use client';

import { ENV } from "@/config/env";
import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faEye,
  faSpinner,
  faGraduationCap,
  faChalkboardTeacher,
  faBook,
  faAward,
  faTrophy,
  faExclamationTriangle,
  faCalendarAlt,
  faHashtag,
  faInfoCircle,
  faSync,
  faStar,
  faCheckCircle,
  faTimesCircle,
  faMedal,
  faGavel,
  faClipboardList,
  faPercent,
  faCreditCard,
  faLayerGroup,
  faFilter,
  faFileAlt,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/Button';
import DropdownTable from '@/components/ui/DropdownTable';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import SearchableSelect, { SearchableSelectOption } from '@/components/ui/SearchableSelect';
import { useRouter } from 'next/navigation';

// ==================== INTERFACES ====================

interface SinhVien {
  id: number;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  tinhTrang: string;
  maLop: string;
  tenLop: string;
  maNganh: string;
  tenNganh: string;
  maNienKhoa: string;
  tenNienKhoa: string;
}

interface LopHocPhan {
  lopHocPhanId: number;
  maLopHocPhan: string;
  khoaDiem: boolean;
  hocKy: number;
  maNamHoc: string;
  tenNamHoc: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  diemQuaTrinh: number;
  diemThanhPhan: number;
  diemThi: number;
  tbchp: number;
  diemHe4: number;
  diemChu: string;
}

interface KetQuaTheoMon {
  monHocId: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  loaiMonHoc: string;
  lopHocPhans: LopHocPhan[];
}

interface KetQuaXetTotNghiep {
  gpa: number;
  xepLoaiTotNghiep: string;
}

interface KhenThuongKyLuatItem {
  id: number;
  loai: 'KHEN_THUONG' | 'KY_LUAT';
  noiDung: string;
  ngayQuyetDinh: string;
}

interface SinhVienProfileResponse {
  id: number;
  maSinhVien: string;
  hoTen: string;
  khenThuongKyLuat?: KhenThuongKyLuatItem[];
}

interface ApiResponse {
  sinhVien: SinhVien;
  ketQuaTheoMon: KetQuaTheoMon[];
  tbchpHe10: number;
  gpa: number;
  xepLoaiHocLuc: string;
  ketQuaXetTotNghiep: KetQuaXetTotNghiep | null;
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// ==================== CONSTANTS ====================

const loaiMonMapping: Record<string, { label: string; color: string }> = {
  BAT_BUOC: { label: 'Bắt buộc', color: 'bg-red-100 text-red-700' },
  TU_CHON: { label: 'Tự chọn', color: 'bg-purple-100 text-purple-700' },
  CHUYEN_NGANH: { label: 'Chuyên ngành', color: 'bg-red-100 text-red-700' },
  DAI_CUONG: { label: 'Đại cương', color: 'bg-blue-100 text-blue-700' },
  CO_SO: { label: 'Cơ sở', color: 'bg-green-100 text-green-700' }
};

const diemChuColors: Record<string, string> = {
  'A+': 'bg-green-500 text-white',
  'A': 'bg-green-500 text-white',
  'B+': 'bg-blue-500 text-white',
  'B': 'bg-blue-500 text-white',
  'C+': 'bg-yellow-500 text-white',
  'C': 'bg-yellow-500 text-white',
  'D+': 'bg-orange-500 text-white',
  'D': 'bg-orange-500 text-white',
  'F': 'bg-red-500 text-white'
};

// ==================== MAIN COMPONENT ====================

const KetQuaHocTapPage: React.FC = () => {
  // Data states
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thanhTich, setThanhTich] = useState<KhenThuongKyLuatItem[]>([]);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMonHoc, setSelectedMonHoc] = useState<KetQuaTheoMon | null>(null);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlertState({ show: true, type, message });
  };

  // Tìm lớp học phần có TBCHP cao nhất
  const getBestLopHocPhan = (lopHocPhans: LopHocPhan[]): LopHocPhan | null => {
    if (!lopHocPhans || lopHocPhans.length === 0) return null;
    return lopHocPhans.reduce((best, current) => 
      current.tbchp > best.tbchp ? current : best
    );
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

      const [ketQuaRes, profileRes] = await Promise.all([
        fetch('${ENV.BACKEND_URL}/ket-qua/sinh-vien/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('${ENV.BACKEND_URL}/sinh-vien/me/my-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!ketQuaRes.ok) {
        throw new Error('Không thể tải kết quả học tập');
      }

      const ketQuaData: ApiResponse = await ketQuaRes.json();
      setApiData(ketQuaData);

      if (profileRes.ok) {
        const profileData: SinhVienProfileResponse = await profileRes.json();
        setThanhTich(profileData.khenThuongKyLuat || []);
      } else {
        setThanhTich([]);
      }
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

  // Statistics
  const statistics = useMemo(() => {
    if (!apiData || !apiData.ketQuaTheoMon || !Array.isArray(apiData.ketQuaTheoMon)) {
      return {
        totalMonHoc: 0,
        totalTinChi: 0,
        avgDiemSo: '0.00',
        avgTBCHP: '0.00',
        xepLoaiHocLuc: 'Chưa xác định'
      };
    }

    const totalTinChi = apiData.ketQuaTheoMon.reduce((sum, mon) => sum + mon.soTinChi, 0);

    return {
      totalMonHoc: apiData.ketQuaTheoMon.length,
      totalTinChi,
      avgDiemSo: apiData.gpa?.toFixed(2) || '0.00',
      avgTBCHP: apiData.tbchpHe10?.toFixed(2) || '0.00',
      xepLoaiHocLuc: apiData.xepLoaiHocLuc || 'Chưa xác định'
    };
  }, [apiData]);

  const khenThuongList = useMemo(
    () => thanhTich.filter((item) => item.loai === 'KHEN_THUONG'),
    [thanhTich]
  );

  const kyLuatList = useMemo(
    () => thanhTich.filter((item) => item.loai === 'KY_LUAT'),
    [thanhTich]
  );

  // ==================== HANDLERS ====================

  const handleViewDetail = (monHoc: KetQuaTheoMon) => {
    setSelectedMonHoc(monHoc);
    setIsDetailModalOpen(true);
  };

  // ==================== TABLE COLUMNS ====================

  // Columns cho row chính (môn học)
  const monHocColumns = [
    {
      key: 'maMonHoc',
      header: 'Mã MH',
      width: 8,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <span className="font-mono text-sm font-medium text-gray-900">
            {row.maMonHoc}
          </span>
        );
      }
    },
    {
      key: 'tenMonHoc',
      header: 'Tên môn học',
      width: 25,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <div>
            <p className="font-medium text-gray-900">{row.tenMonHoc}</p>
            {bestLHP && (
              <p className="text-xs text-gray-500">{bestLHP.maLopHocPhan}</p>
            )}
          </div>
        );
      }
    },
    {
      key: 'soTinChi',
      header: 'TC',
      width: 5,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => (
        <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm">
          {row.soTinChi}
        </span>
      )
    },
    {
      key: 'diemQuaTrinh',
      header: 'ĐQT',
      width: 7,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <span className="font-medium text-gray-900">
            {bestLHP ? bestLHP.diemQuaTrinh.toFixed(1) : '-'}
          </span>
        );
      }
    },
    {
      key: 'diemThi',
      header: 'ĐThi',
      width: 7,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <span className="font-medium text-gray-900">
            {bestLHP ? bestLHP.diemThi.toFixed(1) : '-'}
          </span>
        );
      }
    },
    {
      key: 'tbchp',
      header: 'TBCHP',
      width: 8,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <span className="font-bold text-gray-900">
            {bestLHP ? bestLHP.tbchp.toFixed(1) : '-'}
          </span>
        );
      }
    },
    {
      key: 'diemHe4',
      header: 'Điểm số',
      width: 9,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <span className="font-bold text-red-700">
            {bestLHP ? bestLHP.diemHe4.toFixed(1) : '-'}
          </span>
        );
      }
    },
    {
      key: 'diemChu',
      header: 'Điểm chữ',
      width: 10,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${bestLHP ? (diemChuColors[bestLHP.diemChu] || 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700'}`}>
            {bestLHP ? bestLHP.diemChu : '-'}
          </span>
        );
      }
    },
    {
      key: 'hocKy',
      header: 'Học kỳ',
      width: 10,
      render: (_: any, row: KetQuaTheoMon) => {
        const bestLHP = getBestLopHocPhan(row.lopHocPhans);
        return (
          <div className="text-sm">
            {bestLHP ? (
              <>
                <p className="font-medium text-gray-900">HK{bestLHP.hocKy}</p>
                <p className="text-xs text-gray-500">{bestLHP.tenNamHoc}</p>
              </>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Hành động',
      width: 11,
      align: 'center' as const,
      render: (_: any, row: KetQuaTheoMon) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(row);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-700 transition-colors"
            title="Xem chi tiết"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      )
    }
  ];

  // Columns cho dropdown (các lớp học phần)
  const createLopHocPhanColumns = (allRows: LopHocPhan[]): Array<{
    key: string;
    header: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: LopHocPhan, index: number) => React.ReactNode;
  }> => {
    const bestLHP = getBestLopHocPhan(allRows);
    
    return [
      {
        key: 'maLopHocPhan',
        header: 'Mã lớp HP',
        width: 15,
        render: (_: any, row: LopHocPhan) => {
          const isBest = bestLHP?.lopHocPhanId === row.lopHocPhanId;
          return (
            <div className="flex items-center gap-2">
              <span className={`font-mono text-sm ${isBest ? 'font-bold text-green-700' : 'text-gray-900'}`}>
                {row.maLopHocPhan}
              </span>
            </div>
          );
        }
      },
      {
        key: 'hocKy',
        header: 'Học kỳ',
        width: 8,
        align: 'center' as const,
        render: (_: any, row: LopHocPhan) => (
          <span className="text-sm text-gray-900">HK{row.hocKy}</span>
        )
      },
      {
        key: 'tenNamHoc',
        header: 'Năm học',
        width: 15,
        render: (_: any, row: LopHocPhan) => (
          <span className="text-sm text-gray-700">{row.tenNamHoc}</span>
        )
      },
      {
        key: 'diemQuaTrinh',
        header: 'ĐQT',
        width: 8,
        align: 'center' as const,
        render: (value: number) => (
          <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
        )
      },
      {
        key: 'diemThanhPhan',
        header: 'ĐTP',
        width: 8,
        align: 'center' as const,
        render: (value: number) => (
          <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
        )
      },
      {
        key: 'diemThi',
        header: 'ĐThi',
        width: 8,
        align: 'center' as const,
        render: (value: number) => (
          <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
        )
      },
      {
        key: 'tbchp',
        header: 'TBCHP',
        width: 9,
        align: 'center' as const,
        render: (value: number, row: LopHocPhan) => {
          const isBest = bestLHP?.lopHocPhanId === row.lopHocPhanId;
          return (
            <span className={`font-bold ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
              {value.toFixed(1)}
            </span>
          );
        }
      },
      {
        key: 'diemHe4',
        header: 'Điểm số',
        width: 9,
        align: 'center' as const,
        render: (value: number) => (
          <span className="font-bold text-red-700">{value.toFixed(1)}</span>
        )
      },
      {
        key: 'diemChu',
        header: 'Điểm chữ',
        width: 10,
        align: 'center' as const,
        render: (value: string) => (
          <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg font-bold text-base ${diemChuColors[value] || 'bg-gray-100 text-gray-700'}`}>
            {value}
          </span>
        )
      },
      {
        key: 'khoaDiem',
        header: 'Trạng thái',
        width: 10,
        align: 'center' as const,
        render: (value: boolean) => (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            <FontAwesomeIcon icon={value ? faCheckCircle : faExclamationTriangle} className="text-xs" />
            {value ? 'Đã khóa' : 'Chưa khóa'}
          </span>
        )
      }
    ];
  };

  // Render dropdown content
  const renderDropdownContent = (row: KetQuaTheoMon) => {
    const bestLHP = getBestLopHocPhan(row.lopHocPhans);
    const columns = createLopHocPhanColumns(row.lopHocPhans);
    
    return (
      <div className="ml-8 border-l-2 border-gray-200 pl-6 py-2">
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>
            {row.lopHocPhans.length > 1 
              ? `Sinh viên học môn này ${row.lopHocPhans.length} lần. Lớp học phần có điểm TBCHP cao nhất (${bestLHP?.tbchp.toFixed(1)}) được highlight và được sử dụng để tính điểm tích lũy.`
              : 'Sinh viên học môn này 1 lần.'}
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    text-xs font-semibold text-gray-600 uppercase tracking-wider
                  `}
                  style={{ width: typeof col.width === 'number' ? `${col.width}%` : col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {row.lopHocPhans.map((lhp, index) => {
              const isBest = bestLHP?.lopHocPhanId === lhp.lopHocPhanId;
              return (
                <tr
                  key={lhp.lopHocPhanId}
                  className={`
                    ${isBest ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white'}
                    ${index % 2 === 1 && !isBest ? 'bg-gray-50/50' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-4 py-3
                        ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                        text-sm text-gray-700
                      `}
                    >
                      {col.render
                        ? col.render((lhp as any)[col.key], lhp, index)
                        : (lhp as any)[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {bestLHP && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2 text-sm text-green-800">
              <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Lớp học phần được công nhận:</p>
                <p className="text-xs">
                  Lớp học phần <span className="font-mono font-semibold">{bestLHP.maLopHocPhan}</span> có điểm TBCHP cao nhất ({bestLHP.tbchp.toFixed(1)}) 
                  được sử dụng để tính điểm tích lũy và xét tốt nghiệp cho sinh viên.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER ====================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-red-700 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Đang tải kết quả học tập...</p>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <FontAwesomeIcon icon={faChartLine} className="text-red-700" />
                </div>
                Kết quả học tập
              </h1>
              <p className="text-gray-500 mt-1">Xem điểm số và kết quả học tập theo môn học</p>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={faBook}
            label="Môn học"
            value={statistics.totalMonHoc}
            color="bg-red-100 text-red-700"
          />
          <StatCard
            icon={faCreditCard}
            label="Tín chỉ"
            value={statistics.totalTinChi}
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={faPercent}
            label="TB Điểm 10"
            value={statistics.avgTBCHP}
            color="bg-green-100 text-green-700"
            isDecimal
          />
          <StatCard
            icon={faStar}
            label="GPA (Hệ 4)"
            value={statistics.avgDiemSo}
            color="bg-yellow-100 text-yellow-700"
            isDecimal
          />
        </div>

        {/* GPA Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-red-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tổng kết học tập</h2>
                <p className="text-gray-500">Kết quả tích lũy toàn khóa</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-red-700">{statistics.avgDiemSo}</p>
                <p className="text-sm text-gray-500">GPA (Hệ 4)</p>
              </div>
              <div className="h-16 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{statistics.avgTBCHP}</p>
                <p className="text-sm text-gray-500">TB (Hệ 10)</p>
              </div>
              <div className="h-16 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-700">{statistics.totalTinChi}</p>
                <p className="text-sm text-gray-500">Tín chỉ</p>
              </div>
              <div className="h-16 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{statistics.xepLoaiHocLuc}</p>
                <p className="text-sm text-gray-500">Xếp loại</p>
              </div>
            </div>
          </div>
        </div>

        {/* Khen thưởng & Kỷ luật */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                  <FontAwesomeIcon icon={faAward} />
                </span>
                Khen thưởng
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                {khenThuongList.length} quyết định
              </span>
            </div>
            {khenThuongList.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Chưa có quyết định khen thưởng nào.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-auto pr-1">
                {khenThuongList.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 rounded-xl border border-green-100 bg-green-50/60 flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      <FontAwesomeIcon icon={faMedal} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.noiDung}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ngày quyết định: <span className="font-medium">{formatDate(item.ngayQuyetDinh)}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
                  <FontAwesomeIcon icon={faGavel} />
                </span>
                Kỷ luật
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 font-medium">
                {kyLuatList.length} quyết định
              </span>
            </div>
            {kyLuatList.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Chưa có quyết định kỷ luật nào.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-auto pr-1">
                {kyLuatList.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 rounded-xl border border-red-100 bg-red-50/70 flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.noiDung}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ngày quyết định:{' '}
                        <span className="font-medium">{formatDate(item.ngayQuyetDinh)}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboardList} className="text-red-700" />
                Bảng điểm chi tiết
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({apiData.ketQuaTheoMon.length} môn học)
                </span>
              </h3>
            </div>
          </div>

          <DropdownTable
            columns={monHocColumns}
            data={apiData.ketQuaTheoMon}
            emptyMessage="Chưa có kết quả học tập"
            striped
            hoverable
            getDropdownData={(row) => row.lopHocPhans}
            renderDropdownContent={(row) => renderDropdownContent(row)}
          />
        </div>

        {/* Detail Modal */}
        {selectedMonHoc && (
          <Modal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            title="Chi tiết kết quả học tập"
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
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faBook} className="text-2xl text-red-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedMonHoc.tenMonHoc}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {selectedMonHoc.maMonHoc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${loaiMonMapping[selectedMonHoc.loaiMonHoc]?.color || 'bg-gray-100 text-gray-700'
                        }`}>
                        {loaiMonMapping[selectedMonHoc.loaiMonHoc]?.label || selectedMonHoc.loaiMonHoc}
                      </span>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {selectedMonHoc.soTinChi} tín chỉ
                      </span>
                    </div>
                  </div>
                  {(() => {
                    const bestLHP = getBestLopHocPhan(selectedMonHoc.lopHocPhans);
                    return bestLHP ? (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${diemChuColors[bestLHP.diemChu] || 'bg-gray-100 text-gray-700'
                        }`}>
                        <span className="text-2xl font-bold">{bestLHP.diemChu}</span>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Best Score Summary */}
              {(() => {
                const bestLHP = getBestLopHocPhan(selectedMonHoc.lopHocPhans);
                if (!bestLHP) return null;
                return (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FontAwesomeIcon icon={faAward} className="text-green-700" />
                      <h4 className="font-semibold text-green-900">Kết quả học tập được công nhận</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <ScoreCard label="Điểm quá trình" value={bestLHP.diemQuaTrinh.toFixed(1)} />
                      <ScoreCard label="Điểm thành phần" value={bestLHP.diemThanhPhan.toFixed(1)} />
                      <ScoreCard label="Điểm thi" value={bestLHP.diemThi.toFixed(1)} />
                      <ScoreCard label="TB học phần" value={bestLHP.tbchp.toFixed(1)} highlight />
                    </div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div className="bg-red-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-red-600 mb-1">Điểm hệ 4</p>
                        <p className="text-3xl font-bold text-red-700">{bestLHP.diemHe4.toFixed(1)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Điểm chữ</p>
                        <p className="text-3xl font-bold text-gray-900">{bestLHP.diemChu}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Lớp học phần:</span>{' '}
                        <span className="font-mono">{bestLHP.maLopHocPhan}</span> - 
                        HK{bestLHP.hocKy} - {bestLHP.tenNamHoc}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Đây là lớp học phần có điểm TBCHP cao nhất ({bestLHP.tbchp.toFixed(1)}) trong số {selectedMonHoc.lopHocPhans.length} lớp học phần của môn học này. 
                        Kết quả này được sử dụng để tính điểm tích lũy và xét tốt nghiệp.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* All Classes Table */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-red-700" />
                  Tất cả các lớp học phần ({selectedMonHoc.lopHocPhans.length})
                </h4>
                <Table
                  columns={createLopHocPhanColumns(selectedMonHoc.lopHocPhans)}
                  data={selectedMonHoc.lopHocPhans}
                  emptyMessage="Không có lớp học phần"
                  striped
                  hoverable
                />
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 text-sm text-blue-800">
                    <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Lưu ý:</p>
                      <p className="text-xs">
                        Dòng được highlight màu xanh là lớp học phần có điểm TBCHP cao nhất và được sử dụng để xét tốt nghiệp cho sinh viên. 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

// ==================== SUB COMPONENTS ====================

interface StatCardProps {
  icon: any;
  label: string;
  value: number | string;
  color: string;
  isDecimal?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, isDecimal }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-bold text-gray-900 ${isDecimal ? 'tabular-nums' : ''}`}>
          {value}
        </p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
    </div>
  </div>
);

interface ScoreCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, value, highlight }) => (
  <div className={`rounded-xl p-4 text-center ${highlight ? 'bg-red-50' : 'bg-gray-50'}`}>
    <p className={`text-sm mb-1 ${highlight ? 'text-red-600' : 'text-gray-500'}`}>{label}</p>
    <p className={`text-2xl font-bold ${highlight ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
  </div>
);

export default KetQuaHocTapPage;
