import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
  HomeOutlined,
  ContainerOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import '../../../../styles/theme.css';


export interface NavigationProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
}

const { Sider } = Layout;

const navItems = [
  { key: 'home', icon: <HomeOutlined />, label: 'Home' },
  { key: 'listings', icon: <ContainerOutlined />, label: 'My Listings' },
  { key: 'reservations', icon: <CalendarOutlined />, label: 'My Reservations' },
  { key: 'messages', icon: <MessageOutlined />, label: 'Messages' },
  {
    key: 'account',
    icon: <UserOutlined />, label: 'Account',
    children: [
      { key: 'profile', label: 'Profile' },
      { key: 'bookmarks', label: 'Bookmarks' },
      { key: 'settings', label: 'Settings' },
    ],
  },
];

export const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, onLogout, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = (e: any) => {
    if (onNavigate) onNavigate(e.key);
    setMobileOpen(false);
  };

  // Responsive: show Drawer on mobile, Sider on desktop
  return (
    <>
      {/* Hamburger for mobile (top right) - only if authenticated */}
      {isAuthenticated && (
        <div className={styles.hamburgerContainer} style={{ zIndex: 1020 }}>
          <Button
            className={styles.hamburger}
            icon={mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setMobileOpen(!mobileOpen)}
            type="text"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          />
        </div>
      )}
      {/* Desktop Sider */}
      {isAuthenticated && (
        <Sider
          className={styles.sidebar}
          breakpoint="md"
          collapsedWidth="0"
          width={240}
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ minHeight: '100vh', position: 'fixed', left: 0, top: 64, zIndex: 1000 }}
        >
          <Menu
            mode="inline"
            items={navItems}
            onClick={handleMenuClick}
            style={{ border: 'none', flex: 1 }}
          />
          <Button
            className={styles.logoutDesktop}
            icon={<LogoutOutlined />}
            type="link"
            onClick={onLogout}
            style={{ width: '100%', marginTop: 24 }}
          >
            Log Out
          </Button>
        </Sider>
      )}
      {/* Mobile Drawer */}
      {isAuthenticated && (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={240}
          className={styles.mobileDrawer}
        >
          <Menu
            mode="inline"
            items={navItems}
            onClick={handleMenuClick}
            style={{ border: 'none', flex: 1 }}
          />
          <Button
            className={styles.logoutMobile}
            icon={<LogoutOutlined />}
            type="link"
            onClick={onLogout}
            style={{ width: '100%', marginTop: 24 }}
          >
            Log Out
          </Button>
        </Drawer>
      )}
    </>
  );
};
