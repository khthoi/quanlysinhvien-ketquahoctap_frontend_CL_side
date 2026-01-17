'use client';

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
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import SearchableSelect, { SearchableSelectOption } from '@/components/ui/SearchableSelect';
import router from 'next/router';

// ==================== INTERFACES ====================

interface NamHoc {
  id: number;
  maNamHoc: string;
  tenNamHoc: string;
  namBatDau: number;
  namKetThuc: number;
}

interface HocKy {
  id:  number;
  hocKy: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  namHoc: NamHoc;
}

interface NienKhoa {
  id: number;
  maNienKhoa: string;
  tenNienKhoa:  string;
  namBatDau: number;
  namKetThuc: number;
  moTa: string;
}

interface Nganh {
  id: number;
  maNganh:  string;
  tenNganh: string;
  moTa: string;
}

interface MonHoc {
  id: number;
  tenMonHoc:  string;
  maMonHoc: string;
  loaiMon: string;
  soTinChi: number;
  moTa: string;
}

interface GiangVien {
  id: number;
  hoTen: string;
}

interface LopHocPhan {
  maLopHocPhan: string;
  monHoc: MonHoc;
  giangVien: GiangVien;
  hocKy: HocKy;
  namHoc: NamHoc;
  nienKhoa: NienKhoa;
  nganh: Nganh;
}

interface KetQuaHocTap {
  id: number;
  lopHocPhan: LopHocPhan;
  diemQuaTrinh: string;
  diemThanhPhan: string;
  diemThi: string;
  TBCHP: number;
  DiemSo: number;
  DiemChu: string;
}

interface KhenThuongKyLuat {
  id: number;
  loai: 'KHEN_THUONG' | 'KY_LUAT';
  noiDung: string;
  ngayQuyetDinh: string;
}

interface ApiResponse {
  ketQuaHocTap: KetQuaHocTap[];
  khenThuongKyLuat: KhenThuongKyLuat[];
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// ==================== CONSTANTS ====================

const loaiMonMapping: Record<string, { label: string; color: string }> = {
  CHUYEN_NGANH:  { label: 'Chuyên ngành', color: 'bg-red-100 text-red-700' },
  DAI_CUONG: { label: 'Đại cương', color: 'bg-blue-100 text-blue-700' },
  CO_SO: { label: 'Cơ sở', color: 'bg-green-100 text-green-700' },
  TU_CHON: { label: 'Tự chọn', color: 'bg-purple-100 text-purple-700' }
};

const diemChuColors: Record<string, string> = {
  'A+': 'bg-green-500 text-white',
  'A':  'bg-green-500 text-white',
  'B+': 'bg-blue-500 text-white',
  'B': 'bg-blue-500 text-white',
  'C+': 'bg-yellow-500 text-white',
  'C': 'bg-yellow-500 text-white',
  'D+': 'bg-orange-500 text-white',
  'D': 'bg-orange-500 text-white',
  'F': 'bg-red-500 text-white'
};

const loaiKTKLOptions: SearchableSelectOption[] = [
  { value: '', label: 'Tất cả', icon: faFilter },
  { value: 'KHEN_THUONG', label: 'Khen thưởng', icon: faTrophy },
  { value: 'KY_LUAT', label: 'Kỷ luật', icon: faGavel }
];

// ==================== MAIN COMPONENT ====================

const KetQuaHocTapPage:  React.FC = () => {
  // Data states
  const [ketQuaHocTap, setKetQuaHocTap] = useState<KetQuaHocTap[]>([]);
  const [khenThuongKyLuat, setKhenThuongKyLuat] = useState<KhenThuongKyLuat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedKetQua, setSelectedKetQua] = useState<KetQuaHocTap | null>(null);
  const [isKTKLModalOpen, setIsKTKLModalOpen] = useState(false);
  const [ktklFilter, setKtklFilter] = useState<string | number>('');

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
      return parts. pop()?.split(';').shift() || null;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month:  '2-digit',
      year: 'numeric'
    });
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

      const response = await fetch('http://localhost:3000/ket-qua/sinh-vien/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải kết quả học tập');
      }

      const result:  ApiResponse = await response.json();
      setKetQuaHocTap(result.ketQuaHocTap || []);
      setKhenThuongKyLuat(result.khenThuongKyLuat || []);
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
    if (ketQuaHocTap. length === 0) {
      return {
        totalMonHoc: 0,
        totalTinChi: 0,
        avgDiemSo: 0,
        avgTBCHP: 0,
        khenThuong: 0,
        kyLuat: 0
      };
    }

    const totalTinChi = ketQuaHocTap.reduce((sum, kq) => sum + kq.lopHocPhan.monHoc.soTinChi, 0);
    const totalDiemSo = ketQuaHocTap.reduce((sum, kq) => sum + kq.DiemSo, 0);
    const totalTBCHP = ketQuaHocTap.reduce((sum, kq) => sum + kq.TBCHP, 0);

    return {
      totalMonHoc: ketQuaHocTap.length,
      totalTinChi,
      avgDiemSo: (totalDiemSo / ketQuaHocTap.length).toFixed(2),
      avgTBCHP: (totalTBCHP / ketQuaHocTap. length).toFixed(2),
      khenThuong: khenThuongKyLuat.filter(k => k.loai === 'KHEN_THUONG').length,
      kyLuat:  khenThuongKyLuat.filter(k => k. loai === 'KY_LUAT').length
    };
  }, [ketQuaHocTap, khenThuongKyLuat]);

  // Filtered KTKL
  const filteredKTKL = useMemo(() => {
    if (!ktklFilter) return khenThuongKyLuat;
    return khenThuongKyLuat.filter(k => k.loai === ktklFilter);
  }, [khenThuongKyLuat, ktklFilter]);

  // ==================== HANDLERS ====================

  const handleViewDetail = (ketQua: KetQuaHocTap) => {
    setSelectedKetQua(ketQua);
    setIsDetailModalOpen(true);
  };

  const handleOpenKTKLModal = () => {
    setKtklFilter('');
    setIsKTKLModalOpen(true);
  };

  // ==================== TABLE COLUMNS ====================

  const ketQuaColumns = [
    {
      key: 'lopHocPhan.monHoc.maMonHoc',
      header: 'Mã MH',
      width: '100px',
      render: (_: any, row: KetQuaHocTap) => (
        <span className="font-mono text-sm font-medium text-gray-900">
          {row.lopHocPhan.monHoc.maMonHoc}
        </span>
      )
    },
    {
      key: 'lopHocPhan.monHoc.tenMonHoc',
      header: 'Tên môn học',
      render: (_: any, row: KetQuaHocTap) => (
        <div>
          <p className="font-medium text-gray-900">{row.lopHocPhan.monHoc.tenMonHoc}</p>
          <p className="text-xs text-gray-500">{row.lopHocPhan.maLopHocPhan}</p>
        </div>
      )
    },
    {
      key: 'lopHocPhan.monHoc.soTinChi',
      header: 'TC',
      width: '60px',
      align: 'center' as const,
      render: (_: any, row: KetQuaHocTap) => (
        <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm">
          {row.lopHocPhan.monHoc. soTinChi}
        </span>
      )
    },
    {
      key:  'diemQuaTrinh',
      header: 'ĐQT',
      width: '70px',
      align: 'center' as const,
      render: (value: string) => (
        <span className="font-medium text-gray-900">{parseFloat(value).toFixed(1)}</span>
      )
    },
    {
      key: 'diemThi',
      header: 'ĐThi',
      width: '70px',
      align: 'center' as const,
      render:  (value: string) => (
        <span className="font-medium text-gray-900">{parseFloat(value).toFixed(1)}</span>
      )
    },
    {
      key: 'TBCHP',
      header: 'TBCHP',
      width: '80px',
      align: 'center' as const,
      render: (value: number) => (
        <span className="font-bold text-gray-900">{value. toFixed(1)}</span>
      )
    },
    {
      key: 'DiemSo',
      header:  'Điểm số',
      width: '110px',
      align: 'center' as const,
      render:  (value: number) => (
        <span className="font-bold text-red-700">{value.toFixed(1)}</span>
      )
    },
    {
      key: 'DiemChu',
      header: 'Điểm chữ',
      width: '130px',
      align: 'center' as const,
      render: (value: string) => (
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${diemChuColors[value] || 'bg-gray-100 text-gray-700'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'hocKy',
      header:  'Học kỳ',
      width: '120px',
      render: (_: any, row: KetQuaHocTap) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900">HK{row.lopHocPhan.hocKy.hocKy}</p>
          <p className="text-xs text-gray-500">{row.lopHocPhan.namHoc.tenNamHoc}</p>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      width:  '140px',
      align: 'center' as const,
      render: (_: any, row: KetQuaHocTap) => (
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

  const ktklColumns = [
    {
      key: 'loai',
      header: 'Loại',
      width: '190px',
      align: 'center' as const,
      render: (value: string) => {
        const isKhenThuong = value === 'KHEN_THUONG';
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            isKhenThuong 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <FontAwesomeIcon icon={isKhenThuong ? faTrophy : faGavel} className="text-xs" />
            {isKhenThuong ? 'Khen thưởng' : 'Kỷ luật'}
          </span>
        );
      }
    },
    {
      key:  'noiDung',
      header: 'Nội dung',
      render: (value: string) => (
        <p className="text-gray-900">{value}</p>
      )
    },
    {
      key: 'ngayQuyetDinh',
      header: 'Ngày quyết định',
      width: '180px',
      align: 'center' as const,
      render: (value: string) => (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
          <span>{formatDate(value)}</span>
        </div>
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
          <p className="text-gray-600 font-medium">Đang tải kết quả học tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8">
        {/* Alert */}
        {alertState. show && (
          <div className="mb-6">
            <Alert
              type={alertState.type}
              message={alertState.message}
              dismissible
              timeout={5000}
              onDismiss={() => setAlertState({ ... alertState, show: false })}
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
              <p className="text-gray-500 mt-1">Xem điểm số và khen thưởng kỷ luật</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
            label="TB Điểm 4"
            value={statistics.avgDiemSo}
            color="bg-yellow-100 text-yellow-700"
            isDecimal
          />
          <StatCard
            icon={faTrophy}
            label="Khen thưởng"
            value={statistics.khenThuong}
            color="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={faGavel}
            label="Kỷ luật"
            value={statistics.kyLuat}
            color="bg-orange-100 text-orange-700"
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant="primary"
            leftIcon={faMedal}
            onClick={handleOpenKTKLModal}
          >
            Xem khen thưởng & kỷ luật
            {(statistics.khenThuong + statistics.kyLuat) > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {statistics.khenThuong + statistics.kyLuat}
              </span>
            )}
          </Button>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboardList} className="text-red-700" />
                Bảng điểm chi tiết
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({ketQuaHocTap.length} môn học)
                </span>
              </h3>
            </div>
          </div>
          
          <Table
            columns={ketQuaColumns}
            data={ketQuaHocTap}
            emptyMessage="Chưa có kết quả học tập"
            striped
            hoverable
          />
        </div>

        {/* Detail Modal */}
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
          {selectedKetQua && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faBook} className="text-2xl text-red-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedKetQua. lopHocPhan.monHoc.tenMonHoc}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {selectedKetQua.lopHocPhan.maLopHocPhan}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        loaiMonMapping[selectedKetQua.lopHocPhan.monHoc.loaiMon]?. color || 'bg-gray-100 text-gray-700'
                      }`}>
                        {loaiMonMapping[selectedKetQua.lopHocPhan.monHoc.loaiMon]?.label || selectedKetQua.lopHocPhan.monHoc.loaiMon}
                      </span>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {selectedKetQua.lopHocPhan.monHoc.soTinChi} tín chỉ
                      </span>
                    </div>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    diemChuColors[selectedKetQua.DiemChu] || 'bg-gray-100 text-gray-700'
                  }`}>
                    <span className="text-2xl font-bold">{selectedKetQua.DiemChu}</span>
                  </div>
                </div>
              </div>

              {/* Scores Grid */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-red-700" />
                  Điểm số chi tiết
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ScoreCard label="Điểm quá trình" value={parseFloat(selectedKetQua. diemQuaTrinh).toFixed(1)} />
                  <ScoreCard label="Điểm thành phần" value={parseFloat(selectedKetQua.diemThanhPhan).toFixed(1)} />
                  <ScoreCard label="Điểm thi" value={parseFloat(selectedKetQua.diemThi).toFixed(1)} />
                  <ScoreCard label="TB học phần" value={selectedKetQua. TBCHP. toFixed(1)} highlight />
                </div>
              </div>

              {/* Final Scores */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-red-600 mb-1">Điểm hệ 4</p>
                  <p className="text-3xl font-bold text-red-700">{selectedKetQua.DiemSo. toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Điểm chữ</p>
                  <p className="text-3xl font-bold text-gray-900">{selectedKetQua. DiemChu}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-red-700" />
                    Thông tin giảng dạy
                  </h4>
                  <div className="space-y-2">
                    <DetailRow label="Giảng viên" value={selectedKetQua.lopHocPhan.giangVien. hoTen} />
                    <DetailRow label="Học kỳ" value={`HK${selectedKetQua.lopHocPhan.hocKy. hocKy} - ${selectedKetQua. lopHocPhan.namHoc. tenNamHoc}`} />
                    <DetailRow label="Niên khóa" value={selectedKetQua.lopHocPhan.nienKhoa.tenNienKhoa} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-red-700" />
                    Thông tin môn học
                  </h4>
                  <div className="space-y-2">
                    <DetailRow label="Mã môn" value={selectedKetQua.lopHocPhan.monHoc.maMonHoc} />
                    <DetailRow label="Ngành" value={selectedKetQua.lopHocPhan. nganh.tenNganh} />
                    <DetailRow label="Mô tả" value={selectedKetQua.lopHocPhan.monHoc.moTa} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* KTKL Modal */}
        <Modal
          isOpen={isKTKLModalOpen}
          onClose={() => setIsKTKLModalOpen(false)}
          title="Khen thưởng & Kỷ luật"
          icon={faMedal}
          iconColor="bg-yellow-100 text-yellow-600"
          size="full"
          footer={
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setIsKTKLModalOpen(false)}>
                Đóng
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faTrophy} className="text-xl text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{statistics.khenThuong}</p>
                  <p className="text-sm text-green-600">Khen thưởng</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faGavel} className="text-xl text-red-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{statistics. kyLuat}</p>
                  <p className="text-sm text-red-600">Kỷ luật</p>
                </div>
              </div>
            </div>

            {/* Filter */}
            <SearchableSelect
              label="Lọc theo loại"
              options={loaiKTKLOptions}
              value={ktklFilter}
              onChange={(v) => setKtklFilter(v)}
              placeholder="Chọn loại..."
              clearable
              fullWidth
            />

            {/* Table */}
            <Table
              columns={ktklColumns}
              data={filteredKTKL}
              emptyMessage="Không có dữ liệu khen thưởng/kỷ luật"
              striped
              hoverable
              compact
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

// ==================== SUB COMPONENTS ====================

interface StatCardProps {
  icon:  any;
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

const ScoreCard: React. FC<ScoreCardProps> = ({ label, value, highlight }) => (
  <div className={`rounded-xl p-4 text-center ${highlight ? 'bg-red-50' : 'bg-gray-50'}`}>
    <p className={`text-sm mb-1 ${highlight ? 'text-red-600' : 'text-gray-500'}`}>{label}</p>
    <p className={`text-2xl font-bold ${highlight ? 'text-red-700' :  'text-gray-900'}`}>{value}</p>
  </div>
);

interface DetailRowProps {
  label:  string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-sm text-gray-500 min-w-24 flex-shrink-0">{label}:</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

export default KetQuaHocTapPage;