'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faBook,
  faClipboardList,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faExclamationTriangle,
  faInfoCircle,
  faSync,
  faCalendarAlt,
  faCreditCard,
  faGraduationCap,
  faFileAlt,
  faBan,
  faCheck,
  faEye,
  faLayerGroup,
  faUser
} from '@fortawesome/free-solid-svg-icons';

import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import SearchableSelect, { SearchableSelectOption } from '@/components/ui/SearchableSelect';
import { useRouter } from 'next/navigation';

// ==================== INTERFACES ====================

interface MonHocInfo {
  id: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi?: number;
}

interface LopHocPhan {
  lopHocPhanId: number;
  maLopHocPhan: string;
  khoaDiem: boolean;
  hocKy: number;
  maNamHoc: string;
  tenNamHoc: string;
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

interface MonHocCTDT {
  id: number;
  thuTuHocKy: number;
  monHoc: MonHocInfo;
  ghiChu: string;
}

interface ChuongTrinh {
  id: number;
  tenChuongTrinh: string;
  maChuongTrinh: string;
  thoiGianDaoTao?: number;
}

interface HocKy {
  id: number;
  hocKy: number;
  namHoc: {
    id: number;
    namBatDau: number;
    namKetThuc: number;
  };
}

interface NamHoc {
  id: number;
  namBatDau: number;
  namKetThuc: number;
}

interface Nganh {
  id: number;
  maNganh: string;
  tenNganh: string;
}

interface NienKhoa {
  id: number;
  maNienKhoa: string;
  tenNienKhoa: string;
}

interface GiangVien {
  id: number;
  maGiangVien: string;
  hoTen: string;
}

interface LopHocPhanInfo {
  id: number;
  maLopHocPhan: string;
  mucUuTien?: number;
  siSo?: number;
  siSoSauKhiGan?: number;
  hocKy: HocKy;
  nganh: Nganh;
  nienKhoa: NienKhoa;
  giangVien: GiangVien;
}

interface KetQuaCu {
  id: number;
  maLopHocPhan: string;
  diemQuaTrinh: number;
  diemThanhPhan: number;
  diemThi: number;
  diemTBCHP: number;
}

interface NguoiXuLy {
  id: number;
  tenDangNhap: string;
  loaiNguoiXuLy: 'CAN_BO_PHONG_DAO_TAO' | 'GIANG_VIEN';
  giangVien: GiangVien | null;
}

interface YeuCauDangKy {
  id: number;
  loaiYeuCau: 'HOC_CAI_THIEN' | 'HOC_BO_SUNG';
  trangThai: 'CHO_DUYET' | 'DANG_XU_LY' | 'DA_DUYET' | 'TU_CHOI' | 'DA_HUY';
  lyDo: string;
  ngayTao: string;
  ngayXuLy: string | null;
  ghiChuPhongDaoTao: string | null;
  monHoc: MonHocInfo;
  chuongTrinhDaoTao: {
    id: number;
    maChuongTrinh: string;
    tenChuongTrinh: string;
  };
  thuTuHocKy: number;
  ketQuaCu: KetQuaCu | null;
  lopHocPhanDeXuat: LopHocPhanInfo[] | null;
  lopHocPhanTotNhat: LopHocPhanInfo | null;
  lopHocPhanDaDuyet: LopHocPhanInfo | null;
  nguoiXuLy: NguoiXuLy | null;
}

interface YeuCauDangKyResponse {
  data: YeuCauDangKy[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface KetQuaHocTapResponse {
  sinhVien: any;
  ketQuaTheoMon: KetQuaTheoMon[];
  tbchpHe10: number;
  gpa: number;
  xepLoaiHocLuc: string;
  ketQuaXetTotNghiep: any | null;
}

interface ChuongTrinhResponse {
  chuongTrinh: ChuongTrinh;
  monHocs: MonHocCTDT[];
  lopHocPhans: any[];
  tongSoMon: number;
  tongSoLopTrongCTDT: number;
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

type TrangThaiTab = 'CHO_DUYET' | 'DANG_XU_LY' | 'DA_DUYET' | 'TU_CHOI' | 'DA_HUY';

// ==================== CONSTANTS ====================

const trangThaiConfig: Record<TrangThaiTab, { label: string; color: string; icon: any }> = {
  CHO_DUYET: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700', icon: faClock },
  DANG_XU_LY: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: faSync },
  DA_DUYET: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700', icon: faCheckCircle },
  TU_CHOI: { label: 'Từ chối', color: 'bg-red-100 text-red-700', icon: faTimesCircle },
  DA_HUY: { label: 'Đã huỷ', color: 'bg-gray-100 text-gray-700', icon: faBan }
};

const loaiYeuCauConfig: Record<string, { label: string; color: string }> = {
  HOC_CAI_THIEN: { label: 'Học cải thiện', color: 'bg-orange-100 text-orange-700' },
  HOC_BO_SUNG: { label: 'Học bổ sung', color: 'bg-purple-100 text-purple-700' }
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

const DangKyHocPage: React.FC = () => {
  // Data states
  const [ketQuaHocTap, setKetQuaHocTap] = useState<KetQuaHocTapResponse | null>(null);
  const [chuongTrinh, setChuongTrinh] = useState<ChuongTrinhResponse | null>(null);
  const [yeuCauList, setYeuCauList] = useState<YeuCauDangKy[]>([]);
  const [allYeuCauList, setAllYeuCauList] = useState<YeuCauDangKy[]>([]); // Lưu tất cả yêu cầu để tính số đếm
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<TrangThaiTab>('CHO_DUYET');

  // Modal states
  const [isDangKyCaiThienModalOpen, setIsDangKyCaiThienModalOpen] = useState(false);
  const [isDangKyBoSungModalOpen, setIsDangKyBoSungModalOpen] = useState(false);
  const [isSuaModalOpen, setIsSuaModalOpen] = useState(false);
  const [isHuyModalOpen, setIsHuyModalOpen] = useState(false);
  const [isXoaModalOpen, setIsXoaModalOpen] = useState(false);
  const [isChiTietModalOpen, setIsChiTietModalOpen] = useState(false);
  const [selectedYeuCau, setSelectedYeuCau] = useState<YeuCauDangKy | null>(null);
  const [isMonDaHocModalOpen, setIsMonDaHocModalOpen] = useState(false);
  const [isMonChuaHocModalOpen, setIsMonChuaHocModalOpen] = useState(false);
  const [isMonCoTheCaiThienModalOpen, setIsMonCoTheCaiThienModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    monHocId: 0,
    loaiYeuCau: 'HOC_CAI_THIEN' as 'HOC_CAI_THIEN' | 'HOC_BO_SUNG',
    lyDo: '',
    ketQuaCuId: 0
  });

  // Validation errors for modals
  const [modalErrors, setModalErrors] = useState<{
    monHocId?: string;
    lyDo?: string;
  }>({});

  // Alert state (only for API errors)
  const [alertState, setAlertState] = useState<AlertState>({
    show: false,
    type: 'info',
    message: ''
  });

  const router = useRouter();

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
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlertState({ show: true, type, message });
  };

  // ==================== API CALLS ====================

  const fetchKetQuaHocTap = async () => {
    try {
      const token = getCookie('access_token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/ket-qua/sinh-vien/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: KetQuaHocTapResponse = await response.json();
        setKetQuaHocTap(data);
      }
    } catch (err) {
      console.error('Error fetching ket qua hoc tap:', err);
    }
  };

  const fetchChuongTrinh = async () => {
    try {
      const token = getCookie('access_token');
      if (!token) return;

      const response = await fetch('http://localhost:3000/dao-tao/chuong-trinh/tat-ca-mon-hoc/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: ChuongTrinhResponse = await response.json();
        setChuongTrinh(data);
      }
    } catch (err) {
      console.error('Error fetching chuong trinh:', err);
    }
  };

  const fetchYeuCau = async (page: number = 1, limit: number = 10, trangThai?: TrangThaiTab, showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const token = getCookie('access_token');

      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch tất cả yêu cầu (không filter) để tính số đếm cho các tab
      const allParams = new URLSearchParams({
        page: '1',
        limit: '9999' // Lấy tất cả để tính số đếm
      });
      const allResponse = await fetch(`http://localhost:3000/sinh-vien/yeu-cau-dang-ky/me?${allParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (allResponse.ok) {
        const allResult: YeuCauDangKyResponse = await allResponse.json();
        setAllYeuCauList(allResult.data);
      }

      // Fetch yêu cầu theo tab hiện tại
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (trangThai) {
        params.append('trangThai', trangThai);
      }

      const response = await fetch(`http://localhost:3000/sinh-vien/yeu-cau-dang-ky/me?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách yêu cầu');
      }

      const result: YeuCauDangKyResponse = await response.json();
      setYeuCauList(result.data);
      setPagination(result.pagination);
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const fetchAllData = async (isRefresh: boolean = false) => {
    if (!isRefresh) {
      setIsInitialLoading(true);
    } else {
      setIsLoading(true);
    }
    try {
      await Promise.all([fetchKetQuaHocTap(), fetchChuongTrinh()]);
      await fetchYeuCau(1, 10, activeTab, false);
    } finally {
      if (!isRefresh) {
        setIsInitialLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!isInitialLoading) {
      fetchYeuCau(pagination.page, pagination.limit, activeTab);
    }
  }, [activeTab]);

  // ==================== COMPUTED VALUES ====================

  // Môn học đã học (có điểm và đã khóa điểm)
  const monHocDaHocCoDiem = useMemo(() => {
    if (!ketQuaHocTap) return [];
    return ketQuaHocTap.ketQuaTheoMon.filter(mon => {
      return mon.lopHocPhans.some(lhp => lhp.khoaDiem && lhp.diemChu);
    });
  }, [ketQuaHocTap]);

  // Môn học chưa học trong chương trình đào tạo
  const monHocChuaHoc = useMemo(() => {
    if (!chuongTrinh || !ketQuaHocTap) return [];
    const monHocDaHocMa = new Set(ketQuaHocTap.ketQuaTheoMon.map(m => m.maMonHoc));
    return chuongTrinh.monHocs.filter(mh => !monHocDaHocMa.has(mh.monHoc.maMonHoc));
  }, [chuongTrinh, ketQuaHocTap]);

  // Danh sách môn học cho học cải thiện (có dropdown ketQuaCu cho modal sửa)
  const monHocCaiThienOptions = useMemo(() => {
    return monHocDaHocCoDiem.map(mon => {
      const lhpCoDiem = mon.lopHocPhans.filter(lhp => lhp.khoaDiem && lhp.diemChu);
      const bestLHP = lhpCoDiem.sort((a, b) => b.tbchp - a.tbchp)[0];
      return {
        value: mon.monHocId,
        label: `${mon.maMonHoc} - ${mon.tenMonHoc}${bestLHP ? ` (Điểm: ${bestLHP.diemChu})` : ''}`,
        monHoc: mon,
        ketQuaCuOptions: lhpCoDiem.map(lhp => ({
          value: lhp.lopHocPhanId,
          label: `${lhp.maLopHocPhan} - HK${lhp.hocKy} ${lhp.tenNamHoc} - Điểm: ${lhp.diemChu} (${lhp.tbchp.toFixed(1)})`,
          lhp: lhp
        }))
      };
    });
  }, [monHocDaHocCoDiem]);

  // Danh sách môn học cho học bổ sung
  const monHocBoSungOptions = useMemo(() => {
    return monHocChuaHoc.map(mh => ({
      value: mh.monHoc.id,
      label: `${mh.monHoc.maMonHoc} - ${mh.monHoc.tenMonHoc} (${mh.monHoc.soTinChi} TC)`
    }));
  }, [monHocChuaHoc]);

  // Filter yêu cầu theo tab
  const filteredYeuCau = useMemo(() => {
    return yeuCauList.filter(yc => yc.trangThai === activeTab);
  }, [yeuCauList, activeTab]);

  // ==================== HANDLERS ====================

  const handleTabChange = (tab: TrangThaiTab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleOpenDangKyCaiThien = () => {
    setFormData({ monHocId: 0, loaiYeuCau: 'HOC_CAI_THIEN', lyDo: '', ketQuaCuId: 0 });
    setModalErrors({});
    setIsDangKyCaiThienModalOpen(true);
  };

  const handleOpenDangKyBoSung = () => {
    setFormData({ monHocId: 0, loaiYeuCau: 'HOC_BO_SUNG', lyDo: '', ketQuaCuId: 0 });
    setModalErrors({});
    setIsDangKyBoSungModalOpen(true);
  };

  const handleDangKy = async () => {
    // Validate form
    const errors: { monHocId?: string; lyDo?: string } = {};
    
    if (!formData.monHocId || formData.monHocId === 0) {
      errors.monHocId = 'Vui lòng chọn môn học';
    }
    
    if (!formData.lyDo.trim()) {
      errors.lyDo = 'Vui lòng nhập lý do';
    }

    if (Object.keys(errors).length > 0) {
      setModalErrors(errors);
      return;
    }

    setModalErrors({});

    try {
      const token = getCookie('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/sinh-vien/yeu-cau-dang-ky/me', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          monHocId: formData.monHocId,
          loaiYeuCau: formData.loaiYeuCau,
          lyDo: formData.lyDo.trim()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể tạo yêu cầu');
      }

      showAlert('success', 'Tạo yêu cầu thành công');
      setIsDangKyCaiThienModalOpen(false);
      setIsDangKyBoSungModalOpen(false);
      setFormData({ monHocId: 0, loaiYeuCau: 'HOC_CAI_THIEN', lyDo: '', ketQuaCuId: 0 });
      setModalErrors({});
      await fetchYeuCau(pagination.page, pagination.limit, activeTab, false);
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    }
  };

  const handleOpenSua = (yeuCau: YeuCauDangKy) => {
    setSelectedYeuCau(yeuCau);
    setFormData({
      monHocId: yeuCau.monHoc.id,
      loaiYeuCau: yeuCau.loaiYeuCau,
      lyDo: yeuCau.lyDo,
      ketQuaCuId: 0
    });
    setModalErrors({});
    setIsSuaModalOpen(true);
  };

  const handleSua = async () => {
    if (!selectedYeuCau) return;

    // Validate form
    const errors: { monHocId?: string; lyDo?: string } = {};
    
    if (!formData.monHocId || formData.monHocId === 0) {
      errors.monHocId = 'Vui lòng chọn môn học';
    }
    
    if (!formData.lyDo.trim()) {
      errors.lyDo = 'Vui lòng nhập lý do';
    }

    if (Object.keys(errors).length > 0) {
      setModalErrors(errors);
      return;
    }

    setModalErrors({});

    try {
      const token = getCookie('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const body = {
        yeuCauId: selectedYeuCau.id,
        monHocId: formData.monHocId,
        loaiYeuCau: formData.loaiYeuCau,
        lyDo: formData.lyDo.trim()
      };

      const response = await fetch('http://localhost:3000/sinh-vien/yeu-cau-hoc-phan/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật yêu cầu');
      }

      showAlert('success', 'Cập nhật yêu cầu thành công');
      setIsSuaModalOpen(false);
      setSelectedYeuCau(null);
      await fetchYeuCau(pagination.page, pagination.limit, activeTab, false);
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    }
  };

  const handleOpenHuy = (yeuCau: YeuCauDangKy) => {
    setSelectedYeuCau(yeuCau);
    setIsHuyModalOpen(true);
  };

  const handleHuy = async () => {
    try {
      const token = getCookie('access_token');
      if (!token || !selectedYeuCau) {
        return;
      }

      const response = await fetch(`http://localhost:3000/sinh-vien/yeu-cau-hoc-phan/me/${selectedYeuCau.id}/huy`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể huỷ yêu cầu');
      }

      showAlert('success', 'Huỷ yêu cầu thành công');
      setIsHuyModalOpen(false);
      setSelectedYeuCau(null);
      await fetchYeuCau(pagination.page, pagination.limit, activeTab, false);
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    }
  };

  const handleOpenXoa = (yeuCau: YeuCauDangKy) => {
    setSelectedYeuCau(yeuCau);
    setIsXoaModalOpen(true);
  };

  const handleOpenChiTiet = (yeuCau: YeuCauDangKy) => {
    setSelectedYeuCau(yeuCau);
    setIsChiTietModalOpen(true);
  };

  const handleXoa = async () => {
    try {
      const token = getCookie('access_token');
      if (!token || !selectedYeuCau) {
        return;
      }

      const response = await fetch(`http://localhost:3000/sinh-vien/yeu-cau-hoc-phan/me/${selectedYeuCau.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa yêu cầu');
      }

      showAlert('success', 'Xóa yêu cầu thành công');
      setIsXoaModalOpen(false);
      setSelectedYeuCau(null);
      await fetchYeuCau(pagination.page, pagination.limit, activeTab, false);
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    }
  };

  // ==================== TABLE COLUMNS ====================

  const createColumns = (showActions: boolean = false) => {
    const baseColumns = [
      {
        key: 'monHoc',
        header: 'Môn học',
        render: (_: any, row: YeuCauDangKy) => (
          <div>
            <p className="font-medium text-gray-900">{row.monHoc.tenMonHoc}</p>
            <p className="text-xs text-gray-500 font-mono">{row.monHoc.maMonHoc}</p>
            {row.monHoc.soTinChi && (
              <p className="text-xs text-gray-400 mt-0.5">{row.monHoc.soTinChi} tín chỉ</p>
            )}
          </div>
        )
      },
      {
        key: 'loaiYeuCau',
        header: 'Loại yêu cầu',
        width: '150px',
        render: (value: string) => {
          const config = loaiYeuCauConfig[value];
          return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-700'}`}>
              {config?.label || value}
            </span>
          );
        }
      },
      {
        key: 'lyDo',
        header: 'Lý do',
        render: (value: string) => (
          <p className="text-sm text-gray-700">{value}</p>
        )
      },
      {
        key: 'ketQuaCu',
        header: 'Kết quả cũ',
        width: '200px',
        render: (_: any, row: YeuCauDangKy) => {
          if (row.loaiYeuCau === 'HOC_BO_SUNG' || !row.ketQuaCu) {
            return <span className="text-gray-400">-</span>;
          }
          return (
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">{row.ketQuaCu.diemTBCHP.toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {row.ketQuaCu.maLopHocPhan}
              </p>
            </div>
          );
        }
      },
      {
        key: 'ngayTao',
        header: 'Ngày tạo',
        width: '150px',
        render: (value: string) => (
          <span className="text-sm text-gray-600">{formatDate(value)}</span>
        )
      },
      {
        key: 'ngayXuLy',
        header: 'Ngày xử lý',
        width: '150px',
        render: (value: string | null) => (
          <span className="text-sm text-gray-600">{formatDate(value || '')}</span>
        )
      },
      {
        key: 'ghiChuPhongDaoTao',
        header: 'Ghi chú',
        render: (value: string | null) => (
          <p className="text-sm text-gray-700">{value || '-'}</p>
        )
      }
    ];

    if (showActions) {
      baseColumns.push({
        key: 'actions',
        header: 'Hành động',
        width: '150px',
        render: (_: any, row: YeuCauDangKy) => (
          <div className="flex items-center justify-center gap-2">
            {activeTab === 'CHO_DUYET' && (
              <>
                <button
                  onClick={() => handleOpenSua(row)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-700 transition-colors"
                  title="Sửa"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleOpenHuy(row)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-700 transition-colors"
                  title="Huỷ"
                >
                  <FontAwesomeIcon icon={faBan} />
                </button>
              </>
            )}
            {activeTab === 'DA_HUY' && (
              <button
                onClick={() => handleOpenXoa(row)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-700 transition-colors"
                title="Xóa"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
            {activeTab === 'DA_DUYET' && (
              <button
                onClick={() => handleOpenChiTiet(row)}
                className="px-3 py-1.5 flex items-center justify-center gap-2 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors text-sm font-medium"
                title="Xem chi tiết"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            )}
          </div>
        )
      });
    }

    return baseColumns;
  };

  // ==================== RENDER ====================

  if (isInitialLoading) {
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
                  <FontAwesomeIcon icon={faGraduationCap} className="text-red-700" />
                </div>
                Đăng ký học phần
              </h1>
              <p className="text-gray-500 mt-1">Đăng ký học cải thiện và học bổ sung</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={faSync}
                onClick={() => fetchAllData(true)}
              >
                Làm mới
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={faPlus}
                onClick={handleOpenDangKyCaiThien}
              >
                Học cải thiện
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={faPlus}
                onClick={handleOpenDangKyBoSung}
              >
                Học bổ sung
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => setIsMonDaHocModalOpen(true)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <StatCard
              icon={faBook}
              label="Môn đã học"
              value={ketQuaHocTap?.ketQuaTheoMon.length || 0}
              color="bg-blue-100 text-blue-700"
            />
          </div>
          <div 
            onClick={() => setIsMonChuaHocModalOpen(true)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <StatCard
              icon={faClipboardList}
              label="Môn chưa học"
              value={monHocChuaHoc.length}
              color="bg-yellow-100 text-yellow-700"
            />
          </div>
          <div 
            onClick={() => setIsMonCoTheCaiThienModalOpen(true)}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <StatCard
              icon={faCheckCircle}
              label="Có thể cải thiện"
              value={monHocDaHocCoDiem.length}
              color="bg-orange-100 text-orange-700"
            />
          </div>
          <StatCard
            icon={faFileAlt}
            label="Tổng yêu cầu"
            value={pagination.total}
            color="bg-purple-100 text-purple-700"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {Object.entries(trangThaiConfig).map(([key, config]) => {
                const tabKey = key as TrangThaiTab;
                const isActive = activeTab === tabKey;
                const count = allYeuCauList.filter(yc => yc.trangThai === tabKey).length;
                return (
                  <button
                    key={key}
                    onClick={() => handleTabChange(tabKey)}
                    className={`
                      flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm transition-colors
                      ${isActive
                        ? 'border-red-500 text-red-700 bg-red-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={config.icon} />
                      <span>{config.label}</span>
                      {count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                          {count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Table */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <FontAwesomeIcon icon={faSpinner} className="text-2xl text-red-700 animate-spin" />
              </div>
            ) : filteredYeuCau.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faClipboardList} className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500">Không có yêu cầu nào ở trạng thái {trangThaiConfig[activeTab].label}</p>
              </div>
            ) : (
              <Table
                columns={createColumns(activeTab === 'CHO_DUYET' || activeTab === 'DA_HUY' || activeTab === 'DA_DUYET')}
                data={filteredYeuCau}
                emptyMessage="Không có dữ liệu"
                striped
                hoverable
              />
            )}
          </div>
        </div>

        {/* Modal Đăng ký học cải thiện */}
        <Modal
          isOpen={isDangKyCaiThienModalOpen}
          onClose={() => setIsDangKyCaiThienModalOpen(false)}
          title="Đăng ký học cải thiện"
          icon={faGraduationCap}
          iconColor="bg-orange-100 text-orange-700"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsDangKyCaiThienModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleDangKy}>
                Đăng ký
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Lưu ý:</p>
                  <p className="text-xs">
                    Chỉ có thể đăng ký học cải thiện các môn học đã có điểm và đã khóa điểm. 
                    Hệ thống sẽ tự động lấy kết quả cũ của môn học để xử lý.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn môn học <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={monHocCaiThienOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                value={formData.monHocId || ''}
                onChange={(value) => {
                  setFormData({ ...formData, monHocId: value && value !== '' ? (typeof value === 'number' ? value : Number(value)) : 0 });
                  if (modalErrors.monHocId) {
                    setModalErrors({ ...modalErrors, monHocId: undefined });
                  }
                }}
                placeholder="Chọn môn học..."
                clearable
                fullWidth
              />
              {modalErrors.monHocId && (
                <p className="text-xs text-red-500 mt-1">{modalErrors.monHocId}</p>
              )}
              {formData.monHocId > 0 && (() => {
                const selectedMon = monHocCaiThienOptions.find(opt => opt.value === formData.monHocId);
                if (selectedMon) {
                  const bestLHP = selectedMon.monHoc.lopHocPhans
                    .filter(lhp => lhp.khoaDiem && lhp.diemChu)
                    .sort((a, b) => b.tbchp - a.tbchp)[0];
                  if (bestLHP) {
                    return (
                      <div className="mt-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${diemChuColors[bestLHP.diemChu] || 'bg-gray-100 text-gray-700'}`}>
                            <span className="font-bold text-lg">{bestLHP.diemChu}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <FontAwesomeIcon icon={faBook} className="text-red-600 text-sm" />
                              <h4 className="text-sm font-semibold text-gray-900">Thông tin môn học</h4>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">Mã môn:</span>
                                <span className="text-xs text-gray-900 font-medium">{selectedMon.monHoc.maMonHoc}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">Tên môn:</span>
                                <span className="text-xs text-gray-900">{selectedMon.monHoc.tenMonHoc}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">Điểm TBCHP:</span>
                                <span className={`text-xs font-bold ${diemChuColors[bestLHP.diemChu] || 'text-gray-700'}`}>
                                  {bestLHP.tbchp.toFixed(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-xs" />
                                <span className="text-xs text-gray-600">
                                  {bestLHP.maLopHocPhan} - HK{bestLHP.hocKy} {bestLHP.tenNamHoc}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.lyDo}
                onChange={(e) => {
                  setFormData({ ...formData, lyDo: e.target.value });
                  if (modalErrors.lyDo) {
                    setModalErrors({ ...modalErrors, lyDo: undefined });
                  }
                }}
                placeholder="Nhập lý do đăng ký học cải thiện..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-500 text-black ${
                  modalErrors.lyDo ? 'border-red-500 text-red-500' : 'border-gray-300 text-black'
                }`}
                rows={4}
              />
              {modalErrors.lyDo && (
                <p className="text-xs text-red-500 mt-1">{modalErrors.lyDo}</p>
              )}
            </div>
          </div>
        </Modal>

        {/* Modal Đăng ký học bổ sung */}
        <Modal
          isOpen={isDangKyBoSungModalOpen}
          onClose={() => setIsDangKyBoSungModalOpen(false)}
          title="Đăng ký học bổ sung"
          icon={faBook}
          iconColor="bg-purple-100 text-purple-700"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsDangKyBoSungModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleDangKy}>
                Đăng ký
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn môn học <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={monHocBoSungOptions}
                value={formData.monHocId || ''}
                onChange={(value) => {
                  setFormData({ ...formData, monHocId: value && value !== '' ? (typeof value === 'number' ? value : Number(value)) : 0 });
                  if (modalErrors.monHocId) {
                    setModalErrors({ ...modalErrors, monHocId: undefined });
                  }
                }}
                placeholder="Chọn môn học..."
                clearable
                fullWidth
              />
              {modalErrors.monHocId && (
                <p className="text-xs text-red-500 mt-1">{modalErrors.monHocId}</p>
              )}
              {formData.monHocId > 0 && (() => {
                const selectedMon = monHocChuaHoc.find(mh => mh.monHoc.id === formData.monHocId);
                if (selectedMon) {
                  return (
                    <div className="mt-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                          <FontAwesomeIcon icon={faBook} className="text-purple-600 text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faInfoCircle} className="text-purple-600 text-sm" />
                            <h4 className="text-sm font-semibold text-gray-900">Thông tin môn học</h4>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-600">Mã môn:</span>
                              <span className="text-xs text-gray-900 font-medium">{selectedMon.monHoc.maMonHoc}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-600">Tên môn:</span>
                              <span className="text-xs text-gray-900">{selectedMon.monHoc.tenMonHoc}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 text-xs" />
                              <span className="text-xs text-gray-600">
                                {selectedMon.monHoc.soTinChi} tín chỉ
                              </span>
                            </div>
                            {selectedMon.thuTuHocKy && (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-xs" />
                                <span className="text-xs text-gray-600">
                                  Học kỳ {selectedMon.thuTuHocKy}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.lyDo}
                onChange={(e) => {
                  setFormData({ ...formData, lyDo: e.target.value });
                  if (modalErrors.lyDo) {
                    setModalErrors({ ...modalErrors, lyDo: undefined });
                  }
                }}
                placeholder="Nhập lý do đăng ký học bổ sung..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-500 text-black ${
                  modalErrors.lyDo ? 'border-red-500 text-red-500' : 'border-gray-300 text-black'
                }`}
                rows={4}
              />
              {modalErrors.lyDo && (
                <p className="text-xs text-red-500 mt-1">{modalErrors.lyDo}</p>
              )}
            </div>
          </div>
        </Modal>

        {/* Modal Sửa yêu cầu */}
        <Modal
          isOpen={isSuaModalOpen}
          onClose={() => setIsSuaModalOpen(false)}
          title="Sửa yêu cầu"
          icon={faEdit}
          iconColor="bg-blue-100 text-blue-700"
          size="lg"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsSuaModalOpen(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSua}>
                Cập nhật
              </Button>
            </div>
          }
        >
          {selectedYeuCau && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn môn học <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={
                    selectedYeuCau.loaiYeuCau === 'HOC_CAI_THIEN'
                      ? monHocCaiThienOptions.map(opt => ({ value: opt.value, label: opt.label }))
                      : monHocBoSungOptions
                  }
                  value={formData.monHocId || ''}
                  onChange={(value) => {
                    setFormData({ ...formData, monHocId: value && value !== '' ? (typeof value === 'number' ? value : Number(value)) : 0, ketQuaCuId: 0 });
                    if (modalErrors.monHocId) {
                      setModalErrors({ ...modalErrors, monHocId: undefined });
                    }
                  }}
                  placeholder="Chọn môn học..."
                  clearable
                  fullWidth
                />
                {modalErrors.monHocId && (
                  <p className="text-xs text-red-500 mt-1">{modalErrors.monHocId}</p>
                )}
                {formData.monHocId > 0 && (() => {
                  if (selectedYeuCau.loaiYeuCau === 'HOC_CAI_THIEN') {
                    const selectedMon = monHocCaiThienOptions.find(opt => opt.value === formData.monHocId);
                    if (selectedMon) {
                      const bestLHP = selectedMon.monHoc.lopHocPhans
                        .filter(lhp => lhp.khoaDiem && lhp.diemChu)
                        .sort((a, b) => b.tbchp - a.tbchp)[0];
                      if (bestLHP) {
                        return (
                          <div className="mt-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${diemChuColors[bestLHP.diemChu] || 'bg-gray-100 text-gray-700'}`}>
                                <span className="font-bold text-lg">{bestLHP.diemChu}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <FontAwesomeIcon icon={faBook} className="text-red-600 text-sm" />
                                  <h4 className="text-sm font-semibold text-gray-900">Thông tin môn học</h4>
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-600">Mã môn:</span>
                                    <span className="text-xs text-gray-900 font-medium">{selectedMon.monHoc.maMonHoc}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-600">Tên môn:</span>
                                    <span className="text-xs text-gray-900">{selectedMon.monHoc.tenMonHoc}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-600">Điểm TBCHP:</span>
                                    <span className={`text-xs font-bold ${diemChuColors[bestLHP.diemChu] || 'text-gray-700'}`}>
                                      {bestLHP.tbchp.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-xs" />
                                    <span className="text-xs text-gray-600">
                                      {bestLHP.maLopHocPhan} - HK{bestLHP.hocKy} {bestLHP.tenNamHoc}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    }
                  } else {
                    const selectedMon = monHocChuaHoc.find(mh => mh.monHoc.id === formData.monHocId);
                    if (selectedMon) {
                      return (
                        <div className="mt-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                              <FontAwesomeIcon icon={faBook} className="text-purple-600 text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faInfoCircle} className="text-purple-600 text-sm" />
                                <h4 className="text-sm font-semibold text-gray-900">Thông tin môn học</h4>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-600">Mã môn:</span>
                                  <span className="text-xs text-gray-900 font-medium">{selectedMon.monHoc.maMonHoc}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-600">Tên môn:</span>
                                  <span className="text-xs text-gray-900">{selectedMon.monHoc.tenMonHoc}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 text-xs" />
                                  <span className="text-xs text-gray-600">
                                    {selectedMon.monHoc.soTinChi} tín chỉ
                                  </span>
                                </div>
                                {selectedMon.thuTuHocKy && (
                                  <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-xs" />
                                    <span className="text-xs text-gray-600">
                                      Học kỳ {selectedMon.thuTuHocKy}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
              {selectedYeuCau.loaiYeuCau === 'HOC_CAI_THIEN' && selectedYeuCau.ketQuaCu && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kết quả cũ
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Mã lớp học phần:</span>
                        <span className="text-xs text-gray-900 font-medium">{selectedYeuCau.ketQuaCu.maLopHocPhan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Điểm quá trình:</span>
                        <span className="text-xs text-gray-900">{selectedYeuCau.ketQuaCu.diemQuaTrinh.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Điểm thành phần:</span>
                        <span className="text-xs text-gray-900">{selectedYeuCau.ketQuaCu.diemThanhPhan.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Điểm thi:</span>
                        <span className="text-xs text-gray-900">{selectedYeuCau.ketQuaCu.diemThi.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Điểm TBCHP:</span>
                        <span className="text-xs font-bold text-gray-900">{selectedYeuCau.ketQuaCu.diemTBCHP.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"> 
                  Lý do <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.lyDo}
                  onChange={(e) => {
                    setFormData({ ...formData, lyDo: e.target.value });
                    if (modalErrors.lyDo) {
                      setModalErrors({ ...modalErrors, lyDo: undefined });
                    }
                  }}
                  placeholder="Nhập lý do..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-500 text-black ${
                    modalErrors.lyDo ? 'border-red-500 text-red-500' : 'border-gray-300 text-black'
                  }`}
                  rows={4}
                />
                {modalErrors.lyDo && (
                  <p className="text-xs text-red-500 mt-1">{modalErrors.lyDo}</p>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Modal Xác nhận huỷ */}
        <Modal
          isOpen={isHuyModalOpen}
          onClose={() => setIsHuyModalOpen(false)}
          title="Xác nhận huỷ yêu cầu"
          icon={faExclamationTriangle}
          iconColor="bg-yellow-100 text-yellow-700"
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsHuyModalOpen(false)}>
                Không
              </Button>
              <Button variant="primary" onClick={handleHuy}>
                Xác nhận huỷ
              </Button>
            </div>
          }
        >
          {selectedYeuCau && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn huỷ yêu cầu đăng ký học phần này không?
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{selectedYeuCau.monHoc.tenMonHoc}</p>
                <p className="text-xs text-gray-500 font-mono">{selectedYeuCau.monHoc.maMonHoc}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {loaiYeuCauConfig[selectedYeuCau.loaiYeuCau]?.label}
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal Xem chi tiết */}
        <Modal
          isOpen={isChiTietModalOpen}
          onClose={() => setIsChiTietModalOpen(false)}
          title="Chi tiết yêu cầu"
          icon={faEye}
          iconColor="bg-blue-100 text-blue-700"
          size="full"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsChiTietModalOpen(false)}>
                Đóng
              </Button>
            </div>
          }
        >
          {selectedYeuCau && (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                  Thông tin cơ bản
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Loại yêu cầu</p>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${loaiYeuCauConfig[selectedYeuCau.loaiYeuCau]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {loaiYeuCauConfig[selectedYeuCau.loaiYeuCau]?.label || selectedYeuCau.loaiYeuCau}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Trạng thái</p>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${trangThaiConfig[selectedYeuCau.trangThai]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {trangThaiConfig[selectedYeuCau.trangThai]?.label || selectedYeuCau.trangThai}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Ngày tạo</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedYeuCau.ngayTao)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Ngày xử lý</p>
                      <p className="text-sm text-gray-900">{selectedYeuCau.ngayXuLy ? formatDate(selectedYeuCau.ngayXuLy) : 'Không có'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Lý do</p>
                      <p className="text-sm text-gray-900">{selectedYeuCau.lyDo || 'Không có'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-medium text-gray-600 mb-1">Ghi chú phòng đào tạo</p>
                      <p className="text-sm text-gray-900">{selectedYeuCau.ghiChuPhongDaoTao || 'Không có'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin môn học */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBook} className="text-blue-600" />
                  Thông tin môn học
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Mã môn học</p>
                      <p className="text-sm text-gray-900 font-mono">{selectedYeuCau.monHoc.maMonHoc}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Tên môn học</p>
                      <p className="text-sm text-gray-900">{selectedYeuCau.monHoc.tenMonHoc}</p>
                    </div>
                    {selectedYeuCau.monHoc.soTinChi && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Số tín chỉ</p>
                        <p className="text-sm text-gray-900">{selectedYeuCau.monHoc.soTinChi}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin chương trình đào tạo */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600" />
                  Chương trình đào tạo
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Mã chương trình</p>
                      <p className="text-sm text-gray-900 font-mono">{selectedYeuCau.chuongTrinhDaoTao.maChuongTrinh}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Tên chương trình</p>
                      <p className="text-sm text-gray-900">{selectedYeuCau.chuongTrinhDaoTao.tenChuongTrinh}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Thứ tự học kỳ</p>
                      <p className="text-sm text-gray-900">{selectedYeuCau.thuTuHocKy || 'Không có'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kết quả cũ */}
              {selectedYeuCau.ketQuaCu && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-600" />
                    Kết quả cũ
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Mã lớp học phần</p>
                        <p className="text-sm text-gray-900 font-mono">{selectedYeuCau.ketQuaCu.maLopHocPhan}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Điểm quá trình</p>
                        <p className="text-sm text-gray-900">{selectedYeuCau.ketQuaCu.diemQuaTrinh.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Điểm thành phần</p>
                        <p className="text-sm text-gray-900">{selectedYeuCau.ketQuaCu.diemThanhPhan.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Điểm thi</p>
                        <p className="text-sm text-gray-900">{selectedYeuCau.ketQuaCu.diemThi.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Điểm TBCHP</p>
                        <p className="text-sm font-bold text-gray-900">{selectedYeuCau.ketQuaCu.diemTBCHP.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lớp học phần đã duyệt */}
              {selectedYeuCau.lopHocPhanDaDuyet && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600" />
                    Lớp học phần đã duyệt
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Mã lớp học phần</p>
                        <p className="text-sm text-gray-900 font-mono">{selectedYeuCau.lopHocPhanDaDuyet.maLopHocPhan}</p>
                      </div>
                      {selectedYeuCau.lopHocPhanDaDuyet.mucUuTien && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Mức ưu tiên</p>
                          <p className="text-sm text-gray-900">{selectedYeuCau.lopHocPhanDaDuyet.mucUuTien}</p>
                        </div>
                      )}
                      {selectedYeuCau.lopHocPhanDaDuyet.siSo !== undefined && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Sĩ số</p>
                          <p className="text-sm text-gray-900">{selectedYeuCau.lopHocPhanDaDuyet.siSo}</p>
                        </div>
                      )}
                      {selectedYeuCau.lopHocPhanDaDuyet.siSoSauKhiGan !== undefined && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Sĩ số sau khi gán</p>
                          <p className="text-sm text-gray-900">{selectedYeuCau.lopHocPhanDaDuyet.siSoSauKhiGan}</p>
                        </div>
                      )}
                      {selectedYeuCau.lopHocPhanDaDuyet.hocKy && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Học kỳ</p>
                          <p className="text-sm text-gray-900">
                            Học kỳ {selectedYeuCau.lopHocPhanDaDuyet.hocKy.hocKy} - {selectedYeuCau.lopHocPhanDaDuyet.hocKy.namHoc.namBatDau}/{selectedYeuCau.lopHocPhanDaDuyet.hocKy.namHoc.namKetThuc}
                          </p>
                        </div>
                      )}
                      {selectedYeuCau.lopHocPhanDaDuyet.nganh && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Ngành</p>
                          <p className="text-sm text-gray-900">
                            {selectedYeuCau.lopHocPhanDaDuyet.nganh.maNganh} - {selectedYeuCau.lopHocPhanDaDuyet.nganh.tenNganh}
                          </p>
                        </div>
                      )}
                      {selectedYeuCau.lopHocPhanDaDuyet.nienKhoa && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Niên khóa</p>
                          <p className="text-sm text-gray-900">
                            {selectedYeuCau.lopHocPhanDaDuyet.nienKhoa.maNienKhoa} - {selectedYeuCau.lopHocPhanDaDuyet.nienKhoa.tenNienKhoa}
                          </p>
                        </div>
                      )}
                      {selectedYeuCau.lopHocPhanDaDuyet.giangVien && (
                        <div className="col-span-2">
                          <p className="text-xs font-medium text-gray-600 mb-1">Giảng viên</p>
                          <p className="text-sm text-gray-900">
                            {selectedYeuCau.lopHocPhanDaDuyet.giangVien.maGiangVien} - {selectedYeuCau.lopHocPhanDaDuyet.giangVien.hoTen}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Người xử lý */}
              {selectedYeuCau.nguoiXuLy && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                    Người xử lý
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Tên đăng nhập</p>
                        <p className="text-sm text-gray-900">{selectedYeuCau.nguoiXuLy.tenDangNhap}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Loại người xử lý</p>
                        <p className="text-sm text-gray-900">
                          {selectedYeuCau.nguoiXuLy.loaiNguoiXuLy === 'CAN_BO_PHONG_DAO_TAO' ? 'Cán bộ phòng đào tạo' : 'Giảng viên'}
                        </p>
                      </div>
                      {selectedYeuCau.nguoiXuLy.giangVien && (
                        <div className="col-span-2">
                          <p className="text-xs font-medium text-gray-600 mb-1">Thông tin giảng viên</p>
                          <p className="text-sm text-gray-900">
                            {selectedYeuCau.nguoiXuLy.giangVien.maGiangVien} - {selectedYeuCau.nguoiXuLy.giangVien.hoTen}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Modal Môn đã học */}
        <Modal
          isOpen={isMonDaHocModalOpen}
          onClose={() => setIsMonDaHocModalOpen(false)}
          title="Danh sách môn đã học"
          icon={faBook}
          iconColor="bg-blue-100 text-blue-700"
          size="full"
        >
          <div className="space-y-4">
            {ketQuaHocTap && ketQuaHocTap.ketQuaTheoMon.length > 0 ? (
              <Table
                columns={[
                  {
                    key: 'maMonHoc',
                    header: 'Mã môn học',
                    render: (value, row: KetQuaTheoMon) => (
                      <span className="font-mono text-sm">{row.maMonHoc}</span>
                    )
                  },
                  {
                    key: 'tenMonHoc',
                    header: 'Tên môn học',
                    render: (value, row: KetQuaTheoMon) => (
                      <span className="font-medium">{row.tenMonHoc}</span>
                    )
                  },
                  {
                    key: 'soTinChi',
                    header: 'Số tín chỉ',
                    align: 'center',
                    render: (value, row: KetQuaTheoMon) => (
                      <span>{row.soTinChi}</span>
                    )
                  },
                  {
                    key: 'diemTBCHPCaoNhat',
                    header: 'Điểm TBCHP cao nhất',
                    render: (value, row: KetQuaTheoMon) => {
                      if (!row.lopHocPhans || row.lopHocPhans.length === 0) {
                        return <span className="text-gray-400">-</span>;
                      }
                      const maxLHP = row.lopHocPhans.reduce((max, lhp) => 
                        lhp.tbchp > max.tbchp ? lhp : max
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{maxLHP.tbchp.toFixed(1)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${diemChuColors[maxLHP.diemChu] || 'bg-gray-500 text-white'}`}>
                            {maxLHP.diemChu}
                          </span>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'lopHocPhanCaoNhat',
                    header: 'Lớp học phần (điểm cao nhất)',
                    render: (value, row: KetQuaTheoMon) => {
                      if (!row.lopHocPhans || row.lopHocPhans.length === 0) {
                        return <span className="text-gray-400">-</span>;
                      }
                      const maxLHP = row.lopHocPhans.reduce((max, lhp) => 
                        lhp.tbchp > max.tbchp ? lhp : max
                      );
                      return (
                        <div className="space-y-1">
                          <span className="font-mono text-sm text-gray-900">{maxLHP.maLopHocPhan}</span>
                          <div className="text-xs text-gray-500">
                            HK{maxLHP.hocKy} - {maxLHP.tenNamHoc}
                          </div>
                        </div>
                      );
                    }
                  }
                ]}
                data={ketQuaHocTap.ketQuaTheoMon}
                emptyMessage="Không có môn học nào"
                striped
                hoverable
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faBook} className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500">Không có môn học nào</p>
              </div>
            )}
          </div>
        </Modal>

        {/* Modal Môn chưa học */}
        <Modal
          isOpen={isMonChuaHocModalOpen}
          onClose={() => setIsMonChuaHocModalOpen(false)}
          title="Danh sách môn chưa học"
          icon={faClipboardList}
          iconColor="bg-yellow-100 text-yellow-700"
          size="full"
        >
          <div className="space-y-4">
            {monHocChuaHoc.length > 0 ? (
              <Table
                columns={[
                  {
                    key: 'maMonHoc',
                    header: 'Mã môn học',
                    render: (value, row: MonHocCTDT) => (
                      <span className="font-mono text-sm">{row.monHoc.maMonHoc}</span>
                    )
                  },
                  {
                    key: 'tenMonHoc',
                    header: 'Tên môn học',
                    render: (value, row: MonHocCTDT) => (
                      <span className="font-medium">{row.monHoc.tenMonHoc}</span>
                    )
                  },
                  {
                    key: 'soTinChi',
                    header: 'Số tín chỉ',
                    align: 'center',
                    render: (value, row: MonHocCTDT) => (
                      <span>{row.monHoc.soTinChi || '-'}</span>
                    )
                  },
                  {
                    key: 'thuTuHocKy',
                    header: 'Thứ tự học kỳ',
                    render: (value, row: MonHocCTDT) => (
                      <span>Học kỳ {row.thuTuHocKy}</span>
                    )
                  },
                  {
                    key: 'ghiChu',
                    header: 'Ghi chú',
                    render: (value, row: MonHocCTDT) => (
                      <span className="text-gray-600">{row.ghiChu || '-'}</span>
                    )
                  }
                ]}
                data={monHocChuaHoc}
                emptyMessage="Không có môn học nào"
                striped
                hoverable
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faClipboardList} className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500">Không có môn học nào</p>
              </div>
            )}
          </div>
        </Modal>

        {/* Modal Môn có thể cải thiện */}
        <Modal
          isOpen={isMonCoTheCaiThienModalOpen}
          onClose={() => setIsMonCoTheCaiThienModalOpen(false)}
          title="Danh sách môn có thể cải thiện"
          icon={faCheckCircle}
          iconColor="bg-orange-100 text-orange-700"
          size="full"
        >
          <div className="space-y-4">
            {monHocDaHocCoDiem.length > 0 ? (
              <Table
                columns={[
                  {
                    key: 'maMonHoc',
                    header: 'Mã môn học',
                    render: (value, row: KetQuaTheoMon) => (
                      <span className="font-mono text-sm">{row.maMonHoc}</span>
                    )
                  },
                  {
                    key: 'tenMonHoc',
                    header: 'Tên môn học',
                    render: (value, row: KetQuaTheoMon) => (
                      <span className="font-medium">{row.tenMonHoc}</span>
                    )
                  },
                  {
                    key: 'soTinChi',
                    header: 'Số tín chỉ',
                    align: 'center',
                    render: (value, row: KetQuaTheoMon) => (
                      <span>{row.soTinChi}</span>
                    )
                  },
                  {
                    key: 'diemTBCHPCaoNhat',
                    header: 'Điểm TBCHP cao nhất',
                    render: (value, row: KetQuaTheoMon) => {
                      const lhpCoDiem = row.lopHocPhans.filter(lhp => lhp.khoaDiem && lhp.diemChu);
                      if (lhpCoDiem.length === 0) {
                        return <span className="text-gray-400">-</span>;
                      }
                      const maxLHP = lhpCoDiem.reduce((max, lhp) => 
                        lhp.tbchp > max.tbchp ? lhp : max
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{maxLHP.tbchp.toFixed(1)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${diemChuColors[maxLHP.diemChu] || 'bg-gray-500 text-white'}`}>
                            {maxLHP.diemChu}
                          </span>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'lopHocPhanCaoNhat',
                    header: 'Lớp học phần (điểm cao nhất)',
                    render: (value, row: KetQuaTheoMon) => {
                      const lhpCoDiem = row.lopHocPhans.filter(lhp => lhp.khoaDiem && lhp.diemChu);
                      if (lhpCoDiem.length === 0) {
                        return <span className="text-gray-400">-</span>;
                      }
                      const maxLHP = lhpCoDiem.reduce((max, lhp) => 
                        lhp.tbchp > max.tbchp ? lhp : max
                      );
                      return (
                        <div className="space-y-1">
                          <span className="font-mono text-sm text-gray-900">{maxLHP.maLopHocPhan}</span>
                          <div className="text-xs text-gray-500">
                            HK{maxLHP.hocKy} - {maxLHP.tenNamHoc}
                          </div>
                        </div>
                      );
                    }
                  }
                ]}
                data={monHocDaHocCoDiem}
                emptyMessage="Không có môn học nào"
                striped
                hoverable
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500">Không có môn học nào</p>
              </div>
            )}
          </div>
        </Modal>

        {/* Modal Xác nhận xóa */}
        <Modal
          isOpen={isXoaModalOpen}
          onClose={() => setIsXoaModalOpen(false)}
          title="Xác nhận xóa yêu cầu"
          icon={faTrash}
          iconColor="bg-red-100 text-red-700"
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsXoaModalOpen(false)}>
                Không
              </Button>
              <Button variant="primary" onClick={handleXoa}>
                Xác nhận xóa
              </Button>
            </div>
          }
        >
          {selectedYeuCau && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa yêu cầu đăng ký học phần này không? Hành động này không thể hoàn tác.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">{selectedYeuCau.monHoc.tenMonHoc}</p>
                <p className="text-xs text-gray-500 font-mono">{selectedYeuCau.monHoc.maMonHoc}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {loaiYeuCauConfig[selectedYeuCau.loaiYeuCau]?.label}
                </p>
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
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
    </div>
  </div>
);

export default DangKyHocPage;
