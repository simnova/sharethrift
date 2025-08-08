import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import heroImage from '../../../../assets/hero/hero.png';

export interface HeroSectionProps {
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchValue }) => {
  return (
    <div 
      className="relative h-96 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative z-10 text-center text-white max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Wherever you are, borrow what you need.
        </h1>
        <div className="max-w-md mx-auto">
          <Input.Search
            placeholder="Search for items..."
            size="large"
            prefix={<SearchOutlined />}
            value={searchValue}
            onSearch={onSearch}
            onChange={(e) => onSearch?.(e.target.value)}
            className="shadow-lg"
            style={{
              borderRadius: '8px',
            }}
          />
        </div>
      </div>
    </div>
  );
};