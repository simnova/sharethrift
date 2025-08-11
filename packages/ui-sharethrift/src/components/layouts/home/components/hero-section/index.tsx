import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import { SearchBar } from '../../../../shared/molecules/search-bar';
import heroImage from '../../../../../assets/hero/hero.png';

export interface HeroSectionProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onSearch, 
  searchValue = ''
}) => {
  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  return (
    <div className={styles.heroContainer}>
      <img src={heroImage} alt="Hero background" className={styles.heroImage} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Wherever you are,<br />
          borrow what you need.
        </h1>
        <SearchBar
          searchValue={searchValue}
          onSearchChange={handleSearch}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};