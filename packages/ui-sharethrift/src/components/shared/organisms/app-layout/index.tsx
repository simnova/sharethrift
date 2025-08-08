import React from 'react';
import { Layout } from 'antd';
import { Header } from '../../molecules/header/index';
import { Navigation } from '../../molecules/navigation/index';
import { Footer } from '../../molecules/footer/index';
import styles from './index.module.css';

export interface AppLayoutProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onSignUp?: () => void;
  onNavigate?: (route: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
  onSignUp,
  onNavigate,
  children,
}) => {
  return (
    <Layout className={styles.appLayout}>
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={onLogin}
        onSignUp={onSignUp}
      />
        <div className={styles.bodyWrapper}>
        <Navigation
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
            onNavigate={onNavigate}
        />
        <main className={styles.content}>{children}</main>
        </div>
         <Footer />
    </Layout>
  );
};
