import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { HomeOutlined, ContainerOutlined, CalendarOutlined, MessageOutlined, UserOutlined, LogoutOutlined, MenuOutlined, CloseOutlined, } from '@ant-design/icons';
import styles from './index.module.css';
import '../../styles/theme.css';
const { Sider } = Layout;
const navItems = [
    { key: 'home', icon: _jsx(HomeOutlined, {}), label: 'Home' },
    { key: 'listings', icon: _jsx(ContainerOutlined, {}), label: 'My Listings' },
    { key: 'reservations', icon: _jsx(CalendarOutlined, {}), label: 'My Reservations' },
    { key: 'messages', icon: _jsx(MessageOutlined, {}), label: 'Messages' },
    {
        key: 'account',
        icon: _jsx(UserOutlined, {}), label: 'Account',
        children: [
            { key: 'profile', label: 'Profile' },
            { key: 'settings', label: 'Settings' },
        ],
    },
];
export const Navigation = ({ isAuthenticated, onLogout, onNavigate, selectedKey }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleMenuClick = (e) => {
        // Use keyPath for nested menu items
        let { key } = e;
        const accountSubTabs = ['profile', 'settings'];
        if (e.keyPath && e.keyPath.length > 1 && e.keyPath[1] === 'account' && accountSubTabs.includes(e.key)) {
            key = `account/${e.key}`;
        }
        if (onNavigate)
            onNavigate(key);
        setMobileOpen(false);
    };
    // Responsive: show Drawer on mobile, Sider on desktop
    return (_jsxs(_Fragment, { children: [isAuthenticated && (_jsx("div", { className: styles["hamburgerContainer"], style: { zIndex: 1020 }, children: _jsx(Button, { className: styles["hamburger"] ?? "", icon: mobileOpen ? _jsx(CloseOutlined, {}) : _jsx(MenuOutlined, {}), onClick: () => setMobileOpen(!mobileOpen), type: "text", "aria-label": mobileOpen ? 'Close navigation' : 'Open navigation' }) })), isAuthenticated && (_jsxs(Sider, { className: styles["sidebar"] ?? "", breakpoint: "md", collapsedWidth: "0", width: 240, trigger: null, collapsible: true, collapsed: collapsed, onCollapse: setCollapsed, style: { position: 'fixed', left: 0, top: 64, zIndex: 1000 }, children: [_jsx(Menu, { mode: "inline", items: navItems, onClick: handleMenuClick, style: { border: 'none', flex: 1 }, selectedKeys: [selectedKey || 'home'] }), _jsx(Button, { className: styles["logoutDesktop"] ?? "", icon: _jsx(LogoutOutlined, {}), type: "link", onClick: onLogout, style: { width: '100%', marginTop: 24 }, children: "Log Out" })] })), isAuthenticated && (_jsxs(Drawer, { placement: "left", open: mobileOpen, onClose: () => setMobileOpen(false), width: 240, className: styles["mobileDrawer"] ?? "", children: [_jsx(Menu, { mode: "inline", items: navItems, onClick: handleMenuClick, style: { border: 'none', flex: 1 }, selectedKeys: [selectedKey || 'home'] }), _jsx(Button, { className: styles["logoutMobile"] ?? "", icon: _jsx(LogoutOutlined, {}), type: "link", onClick: onLogout, style: { width: '100%', marginTop: 24 }, children: "Log Out" })] }))] }));
};
//# sourceMappingURL=index.js.map