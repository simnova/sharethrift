import React from 'react';
import { Layout, Button } from 'antd';
import styles from './index.module.css';

export interface HeaderProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onSignUp?: () => void;
}

const { Header: AntHeader } = Layout;

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogin, onLogout, onSignUp }) => {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.logoSection}>
        <img src="/logo.svg" alt="Sharethrift Logo" className={styles.logo} />
        <span className={styles.logoText}>sharethrift</span>
      </div>
      <nav className={styles.authSection}>
        {!isAuthenticated && (
          <>
            <Button type="link" className={styles.authButton} onClick={onSignUp}>Sign Up</Button>
            <span className={styles.divider}>|</span>
            <Button type="link" className={styles.authButton} onClick={onLogin}>Log In</Button>
          </>
        )}
      </nav>
    </AntHeader>
  );
};
