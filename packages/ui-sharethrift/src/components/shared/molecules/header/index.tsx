import React from "react";
import { Layout, Button } from "antd";
import { CreateListingButton } from '../../atoms/create-listing-button';
import styles from "./index.module.css";
import "../../../../styles/theme.css";
import { useAuth } from "react-oidc-context";
import { HandleLogoutMockForMockAuth } from "../../handle-logout";

export interface HeaderProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onSignUp?: () => void;
}

const { Header: AntHeader } = Layout;

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogin, onSignUp }) => {
  const auth = useAuth();

  const handleLogout = () => {
    // Handle logout logic here
   HandleLogoutMockForMockAuth(auth);
  };

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logoSection}>
        <img src="../../../src/assets/logo/logo-icon.svg" alt="Sharethrift Logo" className={styles.logo} />
        <span className={styles.logoText}>sharethrift</span>
      </div>
      <nav className={styles.authSection}>
        {!isAuthenticated ? (
          <>
            <CreateListingButton></CreateListingButton>
            <Button type="link" className={styles.authButton} onClick={onSignUp}>
              Sign Up
            </Button>
            <span className={styles.divider}>|</span>
            <Button type="link" className={styles.authButton} onClick={onLogin}>
              Log In
            </Button>
          </>
        ) : (
          <>
            <Button type="link" className={styles.authButton} onClick={handleLogout}>
              Log Out
            </Button>
          </>
        )}
      </nav>
    </AntHeader>
  );
};
