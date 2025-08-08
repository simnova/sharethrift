import React from 'react';
import { Input, Select, Row, Col } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { CATEGORIES } from '../../../../data/mockListings';

const { Option } = Select;

export interface SearchFilterBarProps {
  searchValue?: string;
  selectedCategory?: string;
  location?: string;
  onSearch?: (value: string) => void;
  onCategoryChange?: (category: string) => void;
  onLocationChange?: (location: string) => void;
  showLocation?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue = '',
  selectedCategory = 'All',
  location = 'Philadelphia, PA',
  onSearch,
  onCategoryChange,
  onLocationChange,
  showLocation = true
}) => {
  return (
    <div className="bg-white p-4 shadow-sm border-b">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={12} lg={14}>
          <Input.Search
            placeholder="Search for items..."
            size="large"
            prefix={<SearchOutlined />}
            value={searchValue}
            onSearch={onSearch}
            onChange={(e) => onSearch?.(e.target.value)}
            allowClear
          />
        </Col>
        
        <Col xs={12} sm={12} md={6} lg={5}>
          <Select
            size="large"
            value={selectedCategory}
            onChange={onCategoryChange}
            style={{ width: '100%' }}
            placeholder="Category"
          >
            {CATEGORIES.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Col>
        
        {showLocation && (
          <Col xs={12} sm={12} md={6} lg={5}>
            <Select
              size="large"
              value={location}
              onChange={onLocationChange}
              style={{ width: '100%' }}
              placeholder="Location"
              suffixIcon={<EnvironmentOutlined />}
            >
              <Option value="Philadelphia, PA">Philadelphia, PA · 10 mi</Option>
              <Option value="New York, NY">New York, NY · 15 mi</Option>
              <Option value="Boston, MA">Boston, MA · 20 mi</Option>
            </Select>
          </Col>
        )}
      </Row>
    </div>
  );
};