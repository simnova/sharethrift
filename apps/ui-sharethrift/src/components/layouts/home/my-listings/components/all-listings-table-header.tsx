
import { Input } from 'antd';
const { Search } = Input;

interface ListingTitleFilterDropdownProps {
  readonly onSearch: (value: string) => void;
  readonly searchText: string;
  readonly setSelectedKeys: (selectedKeys: React.Key[]) => void;
  readonly selectedKeys: React.Key[];
  readonly confirm: () => void;
}

export function ListingTitleFilterDropdown({
  onSearch,
  searchText,
  setSelectedKeys,
  selectedKeys,
  confirm,
}: ListingTitleFilterDropdownProps): React.ReactNode {
  return (
    <div style={{ padding: 8 }}>
      <Search
        placeholder="Search listings"
        value={selectedKeys.length ? (selectedKeys[0] as string) : searchText}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        onSearch={(value) => {
          confirm();
          onSearch(value);
        }}
        style={{ width: 200 }}
        allowClear
      />
    </div>
  );
}
