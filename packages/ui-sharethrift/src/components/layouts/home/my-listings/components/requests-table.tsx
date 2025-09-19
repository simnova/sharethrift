import { Input, Checkbox, Button, Image, Popconfirm, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Dashboard } from '@sthrift/ui-sharethrift-components';
import { RequestsCard } from './requests-card';
import type { ListingRequestData } from './my-listings-dashboard.types';
import { getStatusTagClass, getActionButtons } from './requests-status-helpers';

const { Search } = Input;

export interface RequestsTableProps {
  data: ListingRequestData[];
  searchText: string;
  statusFilters: string[];
  sorter: { field: string | null; order: 'ascend' | 'descend' | null };
  currentPage: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (checkedValues: string[]) => void;
  onTableChange: TableProps<ListingRequestData>['onChange'];
  onPageChange: (page: number) => void;
  onAction: (action: string, requestId: string) => void;
}

const REQUEST_STATUS_OPTIONS = [
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Closed', value: 'Closed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Closing', value: 'Closing' },
];

// getStatusTagClass and getActionButtons moved to requests-status-helpers.tsx

export function RequestsTable({
  data,
  searchText,
  statusFilters,
  sorter,
  currentPage,
  pageSize,
  total,
  loading = false,
  onSearch,
  onStatusFilter,
  onTableChange,
  onPageChange,
  onAction,
}: RequestsTableProps) {
  const columns: ColumnsType<ListingRequestData> = [
    {
      title: 'Listing',
      key: 'listing',
      width: 300,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src={record.image ?? ''}
            alt={record.title}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
          <span>{record.title}</span>
        </div>
      ),
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      sorter: true,
      sortOrder: sorter.field === 'requestedBy' ? sorter.order : null,
      render: (username: string) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>{username}</span>
      ),
    },
    {
      title: 'Requested On',
      dataIndex: 'requestedOn',
      key: 'requestedOn',
      sorter: true,
      sortOrder: sorter.field === 'requestedOn' ? sorter.order : null,
      render: (date: string) => new Date(date).toISOString().slice(0, 10),
    },
    {
      title: 'Reservation Period',
      dataIndex: 'reservationPeriod',
      key: 'reservationPeriod',
      sorter: true,
      sortOrder: sorter.field === 'reservationPeriod' ? sorter.order : null,
      render: (period: string) => {
        if (!period) {
          return 'N/A';
        }
        // Expect format 'yyyy-mm-dd - yyyy-mm-dd' or similar
        // If not, try to parse and format
        let start = '', end = '';
        if (period.includes(' - ')) {
          [start, end] = period.split(' - ');
        } else {
          start = period;
        }
        // Try to format both as yyyy-mm-dd
        function formatDate(str: string) {
          const d = new Date(str);
          if (isNaN(d.getTime())) {
            return str;
          }
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        const formattedStart = formatDate(start);
        const formattedEnd = end ? formatDate(end) : '';
        return (
          <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit', minWidth: 220, display: 'inline-block', textAlign: 'left' }}>
            {formattedStart}{formattedEnd ? ` - ${formattedEnd}` : ''}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filterDropdown: ({ confirm }) => (
        <div style={{ padding: 16, width: 200 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Filter by Status</div>
          <Checkbox.Group
            options={REQUEST_STATUS_OPTIONS}
            value={statusFilters}
            onChange={(checkedValues) => {
              onStatusFilter(checkedValues as string[]);
              confirm();
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          />
        </div>
      ),
      filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (status: string) => (
        <Tag className={getStatusTagClass(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {getActionButtons(record, onAction)}
        </div>
      ),
    },
  ];

  return (
    <Dashboard
      data={data}
      columns={columns}
      loading={loading}
      currentPage={currentPage}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      showPagination={true}
      onChange={onTableChange}
      renderGridItem={(listing) => (
        <RequestsCard listing={listing} onAction={onAction} />
      )}
    />
  );
}