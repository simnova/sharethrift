import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.module.css';

export interface SearchBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchValue = '',
  onSearchChange,
  onSearch,
}) => {
  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  return (
    <div className={styles.search}>
      <Input
        placeholder="Search"
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className={styles.searchInput}
      />
      <Button
        onClick={handleSearch}
        className={styles.searchButton}
      >
        <SearchOutlined className={styles.searchIcon} />
      </Button>
    </div>
  );
};