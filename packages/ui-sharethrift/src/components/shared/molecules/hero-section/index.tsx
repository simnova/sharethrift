import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import heroImage from '../../../../assets/hero/hero.png';

export interface HeroSectionProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onSearch, 
  searchValue = '', 
  onSearchChange 
}) => {
  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <div className={styles.heroContainer}>
      <img src={heroImage} alt="Hero background" className={styles.heroImage} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Wherever you are,<br />
          borrow what you need.
        </h1>
        <div className={styles.searchContainer}>
          <Input
            size="large"
            placeholder="Search listings..."
            value={searchValue}
            onChange={handleInputChange}
            className={styles.searchInput}
            suffix={
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={() => handleSearch(searchValue)}
                className={styles.searchButton}
              />
            }
            onPressEnter={() => handleSearch(searchValue)}
          />
        </div>
      </div>
    </div>
  );
};