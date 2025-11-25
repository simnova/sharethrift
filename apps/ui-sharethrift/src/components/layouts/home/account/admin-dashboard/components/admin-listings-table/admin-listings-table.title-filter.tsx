import React from 'react';
import { Input } from 'antd';
const { Search } = Input;

type TitleFilterProps = {
  searchText: string;
  onSearch: (value: string) => void;
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
};

export const TitleFilter: React.FC<TitleFilterProps> = ({
  searchText,
  onSearch,
  setSelectedKeys,
  selectedKeys,
  confirm,
}) => {
  return (
    <div style={{ padding: 8 }}>
      <Search
        placeholder="Search listings"
        value={selectedKeys.length ? (selectedKeys[0] as string) : searchText}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onSearch={(value) => {
          confirm();
          onSearch(value);
        }}
        style={{ width: 250 }}
        allowClear
      />
    </div>
  );
};
