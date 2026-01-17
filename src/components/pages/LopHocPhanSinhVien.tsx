'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faEye,
  faFilter,
  faSpinner,
  faCalendarAlt,
  faChalkboardTeacher,
  faGraduationCap,
  faBuilding,
  faLayerGroup,
  faClock,
  faHashtag,
  faInfoCircle,
  faBookOpen,
  faUserGraduate,
  faSync,
  faTimes,
  faCheckCircle,
  faClipboardList,
  faTag,
  faCalendarCheck,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import SearchableSelect, { SearchableSelectOption } from '@/components/ui/SearchableSelect';
import { width } from '@fortawesome/free-brands-svg-icons/fa11ty';
import router from 'next/router';

// ==================== INTERFACES ====================

interface Khoa {
  id: number;
  maKhoa: string;
  tenKhoa:  string;
  moTa:  string;
  ngayThanhLap: string;
}

interface Nganh {
  id: number;
  maNganh:  string;
  tenNganh: string;
  moTa: string;
  khoa:  Khoa;
}

interface NienKhoa {
  id:  number;
  maNienKhoa: string;
  tenNienKhoa: string;
  namBatDau:  number;
  namKetThuc: number;
  moTa: string;
}

interface NamHoc {
  id: number;
  maNamHoc: string;
  tenNamHoc: string;
  namBatDau: number;
  namKetThuc: number;
}

interface HocKy {
  id: number;
  hocKy: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  namHoc?:  NamHoc;
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
  hoTen: string;
}

interface LopHocPhan {
  id: number;
  maLopHocPhan: string;
  monHoc: MonHoc;
  giangVien: GiangVien;
  hocKy: HocKy & { namHoc: NamHoc };
  nienKhoa:  NienKhoa;
  nganh: Nganh;
  ngayDangKy: string;
  loaiThamGia: string;
}

interface NamHocWithHocKy {
  id:  number;
  maNamHoc: string;
  tenNamHoc: string;
  namBatDau: number;
  namKetThuc:  number;
  hocKys: {
    id: number;
    hocKy: number;
    ngayBatDau:  string;
    ngayKetThuc: string;
  }[];
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// ==================== CONSTANTS ====================

const loaiMonMapping:  Record<string, { label: string; color: string }> = {
  CHUYEN_NGANH: { label: 'Chuyên ngành', color: 'bg-red-100 text-red-700' },
  DAI_CUONG: { label: 'Đại cương', color: 'bg-blue-100 text-blue-700' },
  CO_SO: { label: 'Cơ sở', color: 'bg-green-100 text-green-700' },
  TU_CHON: { label: 'Tự chọn', color: 'bg-purple-100 text-purple-700' }
};

const loaiThamGiaMapping: Record<string, { label: string; color: string }> = {
  CHINH_QUY: { label: 'Chính quy', color: 'bg-green-100 text-green-700' },
  HOC_LAI: { label: 'Học lại', color: 'bg-yellow-100 text-yellow-700' },
  HOC_CAI_THIEN: { label: 'Cải thiện', color: 'bg-blue-100 text-blue-700' }
};

// ==================== MAIN COMPONENT ====================

const LopHocPhanPage: React.FC = () => {
  // Data states
  const [lopHocPhans, setLopHocPhans] = useState<LopHocPhan[]>([]);
  const [namHocs, setNamHocs] = useState<NamHocWithHocKy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Filter states
  const [selectedNamHocId, setSelectedNamHocId] = useState<string | number>('');
  const [selectedHocKyId, setSelectedHocKyId] = useState<string | number>('');

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLopHocPhan, setSelectedLopHocPhan] = useState<LopHocPhan | null>(null);

  // Alert state
  const [alertState, setAlertState] = useState<AlertState>({
    show:  false,
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

  const showAlert = (type: AlertState['type'], message:  string) => {
    setAlertState({ show: true, type, message });
  };

  // ==================== API CALLS ====================

  const fetchLopHocPhans = async (namHocId?:  string | number, hocKyId?:  string | number) => {
    try {
      const token = getCookie('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      let url = 'http://localhost:3000/sinh-vien/lich-hoc/me';
      const params = new URLSearchParams();
      
      if (hocKyId) params.append('hocKyId', String(hocKyId));
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách lớp học phần');
      }

      const result = await response.json();
      setLopHocPhans(result.data || []);
    } catch (err) {
      showAlert('error', err instanceof Error ?  err.message : 'Đã xảy ra lỗi');
      setLopHocPhans([]);
    }
  };

  const fetchNamHocs = async () => {
    try {
      const token = getCookie('access_token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/dao-tao/nam-hoc?page=1&limit=9999', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách năm học');
      }

      const result = await response.json();
      setNamHocs(result.data || []);
    } catch (err) {
      console.error('Error fetching nam hocs:', err);
    }
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLopHocPhans(), fetchNamHocs()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Reset học kỳ khi đổi năm học
  useEffect(() => {
    setSelectedHocKyId('');
  }, [selectedNamHocId]);

  // ==================== OPTIONS ====================

  const namHocOptions:  SearchableSelectOption[] = useMemo(() => {
    return namHocs.map(nh => ({
      value: nh.id,
      label: nh.tenNamHoc,
      description: `${nh.namBatDau} - ${nh.namKetThuc}`,
      icon: faCalendarAlt
    }));
  }, [namHocs]);

  const hocKyOptions: SearchableSelectOption[] = useMemo(() => {
    if (!selectedNamHocId) return [];
    
    const selectedNamHoc = namHocs. find(nh => nh. id === selectedNamHocId);
    if (!selectedNamHoc || !selectedNamHoc.hocKys. length) return [];

    return selectedNamHoc.hocKys.map(hk => ({
      value: hk.id,
      label: `Học kỳ ${hk.hocKy}`,
      description: `${formatDate(hk.ngayBatDau)} - ${formatDate(hk.ngayKetThuc)}`,
      icon: faBookOpen
    }));
  }, [selectedNamHocId, namHocs]);

  // ==================== HANDLERS ====================

  const handleFilter = async () => {
    setIsFiltering(true);
    await fetchLopHocPhans(selectedNamHocId, selectedHocKyId);
    setIsFiltering(false);
    showAlert('success', 'Đã lọc dữ liệu thành công');
  };

  const handleResetFilter = async () => {
    setSelectedNamHocId('');
    setSelectedHocKyId('');
    setIsFiltering(true);
    await fetchLopHocPhans();
    setIsFiltering(false);
  };

  const handleViewDetail = (lopHocPhan: LopHocPhan) => {
    setSelectedLopHocPhan(lopHocPhan);
    setIsDetailModalOpen(true);
  };

  // ==================== TABLE COLUMNS ====================

  const columns = [
    {
      key: 'maLopHocPhan',
      header: 'Mã LHP',
      width: '180px',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'monHoc. tenMonHoc',
      header: 'Tên môn học',
      render: (value: string, row: LopHocPhan) => (
        <div>
          <p className="font-medium text-gray-900">{row.monHoc.tenMonHoc}</p>
          <p className="text-xs text-gray-500">{row.monHoc.maMonHoc}</p>
        </div>
      )
    },
    {
      key:  'monHoc.soTinChi',
      header: 'Tín chỉ',
      width: '120px',
      align: 'center' as const,
      render: (value: number) => (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-lg font-semibold">
          {value}
        </span>
      )
    },
    {
      key: 'giangVien.hoTen',
      header: 'Giảng viên',
      render:  (value: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-500 text-sm" />
          </div>
          <span className="text-gray-700">{value}</span>
        </div>
      )
    },
    {
      key:  'hocKy',
      header: 'Học kỳ',
      width: '150px',
      render: (_:  any, row: LopHocPhan) => (
        <div className="text-sm">
          <p className="font-medium text-gray-900">Học kỳ {row.hocKy.hocKy}</p>
          <p className="text-xs text-gray-500">{row.hocKy.namHoc.tenNamHoc}</p>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      width:  '140px',
      align: 'center' as const,
      render: (_: any, row: LopHocPhan) => (
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

  // ==================== STATISTICS ====================

  const statistics = useMemo(() => {
    const totalTinChi = lopHocPhans.reduce((sum, lhp) => sum + lhp.monHoc.soTinChi, 0);
    const totalMonHoc = lopHocPhans.length;
    const chuyenNganh = lopHocPhans.filter(lhp => lhp.monHoc.loaiMon === 'CHUYEN_NGANH').length;
    const daiCuong = lopHocPhans.filter(lhp => lhp.monHoc.loaiMon === 'DAI_CUONG').length;

    return { totalTinChi, totalMonHoc, chuyenNganh, daiCuong };
  }, [lopHocPhans]);

  // ==================== RENDER ====================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faSpinner} className="text-2xl text-red-700 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
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
                  <FontAwesomeIcon icon={faLayerGroup} className="text-red-700" />
                </div>
                Lớp học phần
              </h1>
              <p className="text-gray-500 mt-1">Quản lý các lớp học phần đã đăng ký</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={faSync}
              onClick={handleResetFilter}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={faBook}
            label="Tổng môn học"
            value={statistics.totalMonHoc}
            color="bg-red-100 text-red-700"
          />
          <StatCard
            icon={faCreditCard}
            label="Tổng tín chỉ"
            value={statistics.totalTinChi}
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            icon={faGraduationCap}
            label="Chuyên ngành"
            value={statistics.chuyenNganh}
            color="bg-green-100 text-green-700"
          />
          <StatCard
            icon={faBookOpen}
            label="Đại cương"
            value={statistics.daiCuong}
            color="bg-purple-100 text-purple-700"
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="text-red-700 text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Năm học filter */}
            <SearchableSelect
              label="Năm học"
              options={namHocOptions}
              value={selectedNamHocId}
              onChange={(v) => setSelectedNamHocId(v)}
              placeholder="Chọn năm học..."
              searchPlaceholder="Tìm năm học..."
              clearable
              fullWidth
            />

            {/* Học kỳ filter */}
            <SearchableSelect
              label="Học kỳ"
              options={hocKyOptions}
              value={selectedHocKyId}
              onChange={(v) => setSelectedHocKyId(v)}
              placeholder={selectedNamHocId ? "Chọn học kỳ..." : "Vui lòng chọn năm học trước"}
              searchPlaceholder="Tìm học kỳ..."
              disabled={!selectedNamHocId || hocKyOptions.length === 0}
              clearable
              fullWidth
              helperText={
                selectedNamHocId && hocKyOptions.length === 0 
                  ? "Năm học này chưa có học kỳ" 
                  : undefined
              }
            />

            {/* Filter Button */}
            <div className="flex items-end gap-2">
              <Button
                variant="primary"
                leftIcon={faFilter}
                onClick={handleFilter}
                isLoading={isFiltering}
                disabled={!selectedNamHocId}
                fullWidth
              >
                Lọc dữ liệu
              </Button>
              {(selectedNamHocId || selectedHocKyId) && (
                <Button
                  variant="ghost"
                  leftIcon={faTimes}
                  onClick={handleResetFilter}
                >
                  Xóa
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedNamHocId || selectedHocKyId) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Đang lọc theo:</p>
              <div className="flex flex-wrap gap-2">
                {selectedNamHocId && (
                  <span className="inline-flex items-center gap-1. 5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                    {namHocs.find(nh => nh.id === selectedNamHocId)?.tenNamHoc}
                    <button
                      onClick={() => setSelectedNamHocId('')}
                      className="ml-1 hover:text-red-900"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedHocKyId && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
                    Học kỳ {hocKyOptions.find(hk => hk.value === selectedHocKyId)?.label}
                    <button
                      onClick={() => setSelectedHocKyId('')}
                      className="ml-1 hover:text-blue-900"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Danh sách lớp học phần
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({lopHocPhans.length} môn học)
                </span>
              </h3>
            </div>
          </div>
          
          <Table
            columns={columns}
            data={lopHocPhans}
            loading={isFiltering}
            emptyMessage="Không có lớp học phần nào"
            striped
            hoverable
          />
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Chi tiết lớp học phần"
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
          {selectedLopHocPhan && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faBook} className="text-2xl text-red-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedLopHocPhan.monHoc. tenMonHoc}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {selectedLopHocPhan.maLopHocPhan}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${loaiMonMapping[selectedLopHocPhan.monHoc. loaiMon]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {loaiMonMapping[selectedLopHocPhan.monHoc.loaiMon]?.label || selectedLopHocPhan. monHoc.loaiMon}
                      </span>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${loaiThamGiaMapping[selectedLopHocPhan.loaiThamGia]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {loaiThamGiaMapping[selectedLopHocPhan.loaiThamGia]?.label || selectedLopHocPhan.loaiThamGia}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Thông tin môn học */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBook} className="text-red-700" />
                    Thông tin môn học
                  </h4>
                  <div className="space-y-3">
                    <DetailRow label="Mã môn học" value={selectedLopHocPhan.monHoc.maMonHoc} />
                    <DetailRow label="Số tín chỉ" value={`${selectedLopHocPhan.monHoc.soTinChi} tín chỉ`} />
                    <DetailRow label="Mô tả" value={selectedLopHocPhan.monHoc.moTa} />
                  </div>
                </div>

                {/* Thông tin giảng dạy */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-red-700" />
                    Thông tin giảng dạy
                  </h4>
                  <div className="space-y-3">
                    <DetailRow label="Giảng viên" value={selectedLopHocPhan.giangVien. hoTen} />
                    <DetailRow label="Học kỳ" value={`Học kỳ ${selectedLopHocPhan.hocKy.hocKy} - ${selectedLopHocPhan.hocKy.namHoc. tenNamHoc}`} />
                    <DetailRow 
                      label="Thời gian" 
                      value={`${formatDate(selectedLopHocPhan.hocKy.ngayBatDau)} - ${formatDate(selectedLopHocPhan.hocKy. ngayKetThuc)}`} 
                    />
                  </div>
                </div>

                {/* Thông tin ngành/khoa */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuilding} className="text-red-700" />
                    Ngành/Khoa
                  </h4>
                  <div className="space-y-3">
                    <DetailRow label="Ngành" value={selectedLopHocPhan.nganh.tenNganh} />
                    <DetailRow label="Khoa" value={selectedLopHocPhan.nganh.khoa.tenKhoa} />
                    <DetailRow label="Niên khóa" value={selectedLopHocPhan.nienKhoa. tenNienKhoa} />
                  </div>
                </div>

                {/* Thông tin đăng ký */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboardList} className="text-red-700" />
                    Thông tin đăng ký
                  </h4>
                  <div className="space-y-3">
                    <DetailRow label="Ngày đăng ký" value={formatDate(selectedLopHocPhan. ngayDangKy)} />
                    <DetailRow 
                      label="Loại tham gia" 
                      value={loaiThamGiaMapping[selectedLopHocPhan.loaiThamGia]?.label || selectedLopHocPhan.loaiThamGia} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

// ==================== SUB COMPONENTS ====================

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-sm text-gray-500 min-w-24">{label}:</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

export default LopHocPhanPage;