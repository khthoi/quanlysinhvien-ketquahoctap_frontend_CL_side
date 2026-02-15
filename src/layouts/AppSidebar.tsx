'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap,
    faHome,
    faUser,
    faBook,
    faCalendarAlt,
    faClipboardList,
    faChartBar,
    faBell,
    faCog,
    faSignOutAlt,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faUserGraduate,
    faBookOpen,
    faFileAlt,
    faCreditCard,
    faQuestionCircle,
    faHeadset,
    faAward,
    faClock,
    faEnvelope,
    faBullhorn,
    faLock,
    faPalette,
    faGlobe,
    faMoon,
    faSun,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';

// Interface cho thông tin sinh viên
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
    lop: {
        id: number;
        maLop: string;
        tenLop: string;
        nganh: {
            id: number;
            maNganh: string;
            tenNganh: string;
            moTa: string;
            khoa: {
                id: number;
                maKhoa: string;
                tenKhoa: string;
                moTa: string;
                ngayThanhLap: string;
            };
        };
        nienKhoa: {
            id: number;
            maNienKhoa: string;
            tenNienKhoa: string;
            namBatDau: number;
            namKetThuc: number;
            moTa: string;
        };
    };
    khenThuongKyLuat: any[];
}

// Interface cho JWT payload
interface JWTPayload {
    sub: string;
    vaiTro: string;
    exp: number;
    iat: number;
}

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    href?: string;
    badge?: string | number;
    badgeColor?: string;
    children?: MenuItem[];
}

interface AppSidebarProps {
    defaultCollapsed?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ defaultCollapsed = false }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['academic']);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [userProfile, setUserProfile] = useState<SinhVienProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm lấy cookie theo tên
    const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    };

    // Hàm xóa cookie
    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // Hàm decode JWT token
    const decodeJWT = (token: string): JWTPayload | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    // Hàm redirect đến login
    const redirectToLogin = () => {
        deleteCookie('access_token');
        setUserProfile(null);
        router.push('/login');
    };

    // Hàm quy đổi trạng thái từ enum sang text tiếng Việt
    const getTinhTrangText = (tinhTrang: string): string => {
        const mapping: Record<string, string> = {
            'DA_TOT_NGHIEP': 'Đã tốt nghiệp',
            'DANG_HOC': 'Đang học',
            'BAO_LUU': 'Bảo lưu',
            'THOI_HOC': 'Thôi học'
        };
        return mapping[tinhTrang] || tinhTrang;
    };

    // Hàm lấy màu badge cho trạng thái
    const getTinhTrangBadgeColor = (tinhTrang: string): string => {
        const mapping: Record<string, string> = {
            'DA_TOT_NGHIEP': 'bg-blue-100 text-blue-700', // xanh dương
            'DANG_HOC': 'bg-green-100 text-green-700', // xanh lá cây
            'BAO_LUU': 'bg-orange-100 text-orange-700', // vàng cam nhạt
            'THOI_HOC': 'bg-red-100 text-red-700' // đỏ nhạt
        };
        return mapping[tinhTrang] || 'bg-gray-100 text-gray-700';
    };

    // Hàm lấy màu dot indicator cho trạng thái
    const getTinhTrangDotColor = (tinhTrang: string): string => {
        const mapping: Record<string, string> = {
            'DA_TOT_NGHIEP': 'bg-blue-500',
            'DANG_HOC': 'bg-green-500',
            'BAO_LUU': 'bg-orange-500',
            'THOI_HOC': 'bg-red-500'
        };
        return mapping[tinhTrang] || 'bg-gray-500';
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        // Đóng tất cả submenu khi collapse
        if (!isCollapsed) {
            setExpandedMenus([]);
        }
    };

    // Fetch thông tin sinh viên khi component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            
            const accessToken = getCookie('access_token');
            
            if (!accessToken) {
                setIsLoading(false);
                return;
            }

            // Decode token
            const payload = decodeJWT(accessToken);
            
            if (!payload) {
                setIsLoading(false);
                return;
            }

            // Kiểm tra token hết hạn
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTime) {
                console.log('Token expired');
                setIsLoading(false);
                return;
            }

            // Kiểm tra vai trò
            if (payload.vaiTro !== 'SINH_VIEN') {
                console.log('Invalid role:', payload.vaiTro);
                setIsLoading(false);
                return;
            }

            // Fetch thông tin sinh viên
            try {
                const response = await fetch('http://localhost:3000/sinh-vien/me/my-profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const profileData: SinhVienProfile = await response.json();
                setUserProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Tự động highlight theo route
    useEffect(() => {
        const findActiveId = (items: MenuItem[]): string | null => {
            for (const item of items) {
                if (item.href === pathname) return item.id;
                if (item.children) {
                    for (const child of item.children) {
                        if (child.href === pathname) {
                            setExpandedMenus(prev =>
                                prev.includes(item.id) ? prev : [...prev, item.id]
                            );
                            return child.id;
                        }
                    }
                }
            }
            return null;
        };

        const activeId = findActiveId(mainMenuItems);
        setActiveItem(activeId || 'dashboard');
    }, [pathname]);

    const toggleSubmenu = (menuId: string) => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setExpandedMenus([menuId]);
            return;
        }

        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const handleItemClick = (id: string, href?: string) => {
        setActiveItem(id);
        if (href) router.push(href);
    };


    // Menu items
    const mainMenuItems: MenuItem[] = [
        {
            id: 'dashboard',
            label: 'Tổng quan',
            icon: faHome,
            href: '/dashboard'
        },
        {
            id: 'profile',
            label: 'Hồ sơ cá nhân',
            icon: faUser,
            href: '/user-profile'
        },
        {
            id: 'academic',
            label: 'Học tập',
            icon: faBookOpen,
            children: [
                {
                    id: 'schedule',
                    label: 'Lớp học phần',
                    icon: faCalendarAlt,
                    href: '/lich-hoc'
                },
                {
                    id: 'grades',
                    label: 'Kết quả học tập',
                    icon: faChartBar,
                    href: '/ket-qua-hoc-tap'
                },
                {
                    id: 'curriculum',
                    label: 'Chương trình đào tạo',
                    icon: faBook,
                    href: '/chuong-trinh-dao-tao'
                },
                {
                    id: 'registration',
                    label: 'Đăng ký học',
                    icon: faUserGraduate,
                    href: '/dang-ky-hoc'
                }
            ]
        },
    ];

    // Render menu item
    const renderMenuItem = (item: MenuItem, isChild: boolean = false) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.id);
        const isActive = activeItem === item.id;

        return (
            <div key={item.id}>
                <button
                    onClick={() => hasChildren ? toggleSubmenu(item.id) : handleItemClick(item.id, item.href)}
                    className={`
            w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-all duration-200 group relative
            ${isChild ? 'pl-4' : ''}
            ${isActive
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
          `}
                    title={isCollapsed ? item.label : undefined}
                >
                    <div className="flex items-center space-x-3 min-w-0">
                        <div className={`
              w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
              ${isActive
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-600'
                            }
            `}>
                            <FontAwesomeIcon icon={item.icon} className="text-sm" />
                        </div>

                        {!isCollapsed && (
                            <span className={`font-medium text-sm truncate ${isActive ? 'text-red-700' : ''}`}>
                                {item.label}
                            </span>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="flex items-center space-x-2">
                            {item.badge && (
                                <span className={`
                  px-2 py-0.5 text-xs font-medium text-white rounded-full
                  ${item.badgeColor || 'bg-gray-500'}
                `}>
                                    {item.badge}
                                </span>
                            )}

                            {hasChildren && (
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`text-xs text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            )}
                        </div>
                    )}

                    {/* Collapsed badge */}
                    {isCollapsed && item.badge && (
                        <span className={`
              absolute -top-1 -right-1 w-5 h-5 text-xs font-medium text-white rounded-full flex items-center justify-center
              ${item.badgeColor || 'bg-gray-500'}
            `}>
                            {typeof item.badge === 'number' ? item.badge : '•'}
                        </span>
                    )}

                    {/* Active indicator */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-700 rounded-r-full"></div>
                    )}
                </button>

                {/* Children */}
                {hasChildren && !isCollapsed && (
                    <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
          `}>
                        <div className="ml-4 pl-3 border-l-2 border-gray-200 space-y-1">
                            {item.children!.map(child => renderMenuItem(child, true))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className={`
      fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40
      flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
            <div className='mt-4'></div>
            <div className='mt-4'></div>
            <div className='mt-4'></div>
            <div className='mt-4'></div>
            <div className='mt-4'></div>
            <div className='mt-4'></div>
            <div className='mt-5'></div>
            <div className='mt-5'></div>
            {/* Header */}
            <div className={`
        flex items-center h-20 px-4 border-b border-gray-100
        ${isCollapsed ? 'justify-center' : 'justify-between'}
      `}>
                <a href="/" className={`flex items-center space-x-3 group ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-11 h-11 bg-red-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-800 transition-colors shadow-md">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg" />
                    </div>
                    {!isCollapsed && (
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold text-gray-900 leading-tight truncate">
                                ĐẠI HỌC THỦ ĐÔ
                            </h1>
                            <p className="text-xs text-red-700 font-medium truncate">Cổng thông tin sinh viên</p>
                        </div>
                    )}
                </a>
            </div>

            {/* User Info */}
            <div className={`
        px-4 py-4 border-b border-gray-100
        ${isCollapsed ? 'flex justify-center' : ''}
      `}>
                {isCollapsed ? (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        {isLoading ? (
                            <FontAwesomeIcon icon={faSpinner} className="text-red-700 animate-spin" />
                        ) : (
                            <FontAwesomeIcon icon={faUserGraduate} className="text-red-700" />
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {isLoading ? (
                                <FontAwesomeIcon icon={faSpinner} className="text-red-700 text-lg animate-spin" />
                            ) : (
                                <FontAwesomeIcon icon={faUserGraduate} className="text-red-700 text-lg" />
                            )}
                        </div>
                        {isLoading ? (
                            <div className="min-w-0 flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-2/3"></div>
                                <div className="h-5 bg-gray-200 rounded-full animate-pulse w-20"></div>
                            </div>
                        ) : userProfile ? (
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{userProfile.hoTen}</h3>
                                <p className="text-xs text-gray-500 truncate">MSV: {userProfile.maSinhVien}</p>
                                {userProfile.tinhTrang && (
                                    <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTinhTrangBadgeColor(userProfile.tinhTrang)}`}>
                                        <span className={`w-1.5 h-1.5 ${getTinhTrangDotColor(userProfile.tinhTrang)} rounded-full mr-1.5`}></span>
                                        {getTinhTrangText(userProfile.tinhTrang)}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">Sinh viên</h3>
                                <p className="text-xs text-gray-500 truncate">Chưa đăng nhập</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* Menu Label */}
                {!isCollapsed && (
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Menu chính
                    </p>
                )}

                {mainMenuItems.map(item => renderMenuItem(item))}

                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>
            </nav>

            {/* Logout Button */}
            <div className={`px-3 py-3 border-t border-gray-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={() => {
                        // Handle logout
                        deleteCookie('access_token');
                        setUserProfile(null);
                        router.push('/login');
                    }}
                    className={`
            flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all group
            ${isCollapsed ? 'justify-center w-full' : 'w-full'}
          `}
                    title={isCollapsed ? 'Đăng xuất' : undefined}
                >
                    <div className="w-9 h-9 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-gray-500 group-hover:text-red-600 text-sm" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-medium text-sm">Đăng xuất</span>
                    )}
                </button>
            </div>

            {/* Collapse Toggle Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-700 hover:border-red-200 transition-all z-50"
                title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
            >
                <FontAwesomeIcon
                    icon={isCollapsed ? faChevronRight : faChevronLeft}
                    className="text-xs"
                />
            </button>

            {/* Version Info */}
            {!isCollapsed && (
                <div className="px-4 py-3 text-center">
                    <p className="text-xs text-gray-400">Phiên bản 2.0.1</p>
                </div>
            )}
        </aside>
    );
};

export default AppSidebar;