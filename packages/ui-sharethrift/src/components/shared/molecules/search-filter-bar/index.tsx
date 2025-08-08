import React from 'react';
import { Input, Button, Select, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { LISTING_CATEGORIES } from '../../../../types/listing';
import styles from './index.module.css';

export interface SearchFilterBarProps {
  searchValue?: string;
  selectedCategory?: string;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (category: string) => void;
  onSearch?: (query: string) => void;
  onCreateListing?: () => void;
  showCreateButton?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue = '',
  selectedCategory = 'All',
  onSearchChange,
  onCategoryChange,
  onSearch,
  onCreateListing,
  showCreateButton = false,
}) => {
  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const categoryOptions = LISTING_CATEGORIES.map(category => ({
    label: category,
    value: category,
  }));

  return (
    <div className={styles.searchFilterContainer}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={showCreateButton ? 16 : 20} lg={showCreateButton ? 16 : 20}>
          <div className={styles.searchSection}>
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
        </Col>
        {showCreateButton && (
          <Col xs={24} sm={24} md={8} lg={8}>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={onCreateListing}
              className={styles.createButton}
              block
            >
              Create a Listing
            </Button>
          </Col>
        )}
      </Row>
      
      <Row className={styles.filterSection}>
        <Col span={24}>
          <div className={styles.categoryFilter}>
            <span className={styles.categoryLabel}>Category: </span>
            <Select
              value={selectedCategory}
              onChange={onCategoryChange}
              options={categoryOptions}
              className={styles.categorySelect}
              size="middle"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};