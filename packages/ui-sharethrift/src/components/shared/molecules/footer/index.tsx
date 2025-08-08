
import React from 'react';
import { Layout } from 'antd';
import { FacebookFilled, TwitterSquareFilled } from '@ant-design/icons';
import styles from './index.module.css';

export interface FooterProps {
  onFacebookClick?: () => void;
  onTwitterClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onFacebookClick, onTwitterClick }) => {
  return (
    <Layout.Footer className={styles.footer}>
      <div className={styles.row}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" onClick={onFacebookClick}>
          <FacebookFilled className={styles.icon} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" onClick={onTwitterClick}>
          <TwitterSquareFilled className={styles.icon} />
        </a>
      </div>
      <div className={styles.row}>
        <a href="/privacy" className={styles.link}>Privacy Policy</a>
        <span className={styles.divider}>|</span>
        <a href="/terms" className={styles.link}>Terms and Conditions</a>
        <span className={styles.divider}>|</span>
        <a href="/contact" className={styles.link}>Contact</a>
      </div>
      <div className={styles.row}>
        <span className={styles.copyright}>©2024 sharethrift All Rights Reserved</span>
      </div>
    </Layout.Footer>
  );
};
