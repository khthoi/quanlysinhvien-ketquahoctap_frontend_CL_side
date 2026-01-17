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
    faSun
} from '@fortawesome/free-solid-svg-icons';

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
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['academic']);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Lưu trạng thái collapsed vào localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebar_collapsed');
        if (saved !== null) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        // Đóng tất cả submenu khi collapse
        if (!isCollapsed) {
            setExpandedMenus([]);
        }
    };

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

    const handleItemClick = (itemId: string, href?: string) => {
        setActiveItem(itemId);
        if (href) {
            window.location.href = href;
        }
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
            href: '/profile'
        },
        {
            id: 'academic',
            label: 'Học tập',
            icon: faBookOpen,
            children: [
                {
                    id: 'schedule',
                    label: 'Thời khóa biểu',
                    icon: faCalendarAlt,
                    href: '/schedule'
                },
                {
                    id: 'courses',
                    label: 'Đăng ký học phần',
                    icon: faClipboardList,
                    href: '/courses',
                    badge: 'Mới',
                    badgeColor: 'bg-green-500'
                },
                {
                    id: 'grades',
                    label: 'Kết quả học tập',
                    icon: faChartBar,
                    href: '/grades'
                },
                {
                    id: 'curriculum',
                    label: 'Chương trình đào tạo',
                    icon: faBook,
                    href: '/curriculum'
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
            w-full flex items-center justify-between px-3 py-2. 5 rounded-xl text-left transition-all duration-200 group relative
            ${isChild ? 'pl-10' : ''}
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
                        <FontAwesomeIcon icon={faUserGraduate} className="text-red-700" />
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-red-700 text-lg" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">Trần Tấn Khá</h3>
                            <p className="text-xs text-gray-500 truncate">MSV: 222001459</p>
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <span className="w-1. 5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                Đang học
                            </span>
                        </div>
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
                        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        window.location.href = '/login';
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
                className="absolute -right-3 top-24 w-6 h-6 top-[180px] bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-700 hover:border-red-200 transition-all z-50"
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