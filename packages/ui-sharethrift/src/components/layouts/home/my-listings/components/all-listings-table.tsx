import { Input, Checkbox, Button, Image, Popconfirm, Tag, Badge } from 'antd';
import type { TableProps, ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-sharethrift-components';
import type { MyListingData } from './my-listings-dashboard.types';
import { AllListingsCard } from './all-listings-card';
import { getStatusTagClass } from './status-tag-class';

const { Search } = Input;

export interface AllListingsTableProps {
  data: MyListingData[];
  searchText: string;
  statusFilters: string[];
  sorter: { field: string | null; order: 'ascend' | 'descend' | null };
  currentPage: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (checkedValues: string[]) => void;
  onTableChange: TableProps<MyListingData>['onChange'];
  onPageChange: (page: number) => void;
  onAction: (action: string, listingId: string) => void;
  onViewAllRequests: (listingId: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Paused', value: 'Paused' },
  { label: 'Reserved', value: 'Reserved' },
  { label: 'Expired', value: 'Expired' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Blocked', value: 'Blocked' },
];

// getStatusTagClass moved to shared helper status-tag-class.ts

export function AllListingsTable({
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
  onViewAllRequests,
}: AllListingsTableProps) {
  
  const getActionButtons = (record: MyListingData) => {
    const buttons = [];
    
    // Conditional actions based on status
    if (record.status === 'Active' || record.status === 'Reserved') {
      buttons.push(
        <Button key="pause" type="link" size="small" onClick={() => onAction('pause', record.id)}>
          Pause
        </Button>
      );
    }
    
    if (record.status === 'Paused' || record.status === 'Expired') {
      buttons.push(
        <Button key="reinstate" type="link" size="small" onClick={() => onAction('reinstate', record.id)}>
          Reinstate
        </Button>
      );
    }
    
    if (record.status === 'Blocked') {
      buttons.push(
        <Popconfirm
          key="appeal"
          title="Appeal this listing?"
          description="Are you sure you want to appeal the block on this listing?"
          onConfirm={() => onAction('appeal', record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" size="small">Appeal</Button>
        </Popconfirm>
      );
    }
    
    if (record.status === 'Draft') {
      buttons.push(
        <Button key="publish" type="link" size="small" onClick={() => onAction('publish', record.id)}>
          Publish
        </Button>
      );
    }
    
    // Always available actions
    buttons.push(
      <Button key="edit" type="link" size="small" onClick={() => onAction('edit', record.id)}>
        Edit
      </Button>
    );
    
    buttons.push(
      <Popconfirm
        key="delete"
        title="Delete this listing?"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={() => onAction('delete', record.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="link" size="small" danger>Delete</Button>
      </Popconfirm>
    );
    
    return buttons;
  };

  const columns: ColumnsType<MyListingData> = [
    {
      title: 'Listing',
      dataIndex: 'title',
      key: 'title',
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
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (title: string, record: MyListingData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src={record.image ?? ''}
            alt={title}
            width={72}
            height={72}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
          <span>{title}</span>
        </div>
      ),
    },
    {
      title: 'Published At',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      sorter: true,
      sortOrder: sorter.field === 'publishedAt' ? sorter.order : null,
      render: (date?: string) => {
        if (!date) {
          return 'N/A';
        }
        // Format as yyyy-mm-dd and align digits
        const d = new Date(date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        return (
          <span style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit', minWidth: 100, display: 'inline-block', textAlign: 'left' }}>{formatted}</span>
        );
      },
    },
    {
      title: 'Reservation Period',
      dataIndex: 'reservationPeriod',
      key: 'reservationPeriod',
      sorter: true,
      sortOrder: sorter.field === 'reservationPeriod' ? sorter.order : null,
      render: (period?: string) => {
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
          if (isNaN(d.getTime())) { return str; }
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
            options={STATUS_OPTIONS}
            value={statusFilters}
            onChange={(checkedValues) => {
              onStatusFilter(checkedValues);
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
      render: (_, record: MyListingData) => {
        const actions = getActionButtons(record);
        // Ensure at least 3 slots for alignment (first, middle, last)
        const minActions = 3;
        const paddedActions = [
          ...actions,
          ...Array(Math.max(0, minActions - actions.length)).fill(null)
        ];
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              minWidth: 220,
              gap: 0,
            }}
          >
            {paddedActions.map((btn, idx) => (
              <div
                key={btn?.key || idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent:
                    idx === 0
                      ? 'flex-start'
                      : idx === paddedActions.length - 1
                      ? 'flex-end'
                      : 'center',
                  minWidth: 60,
                  maxWidth: 100,
                }}
              >
                {btn}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Pending Requests',
      dataIndex: 'pendingRequestsCount',
      key: 'pendingRequestsCount',
      sorter: true,
      sortOrder: sorter.field === 'pendingRequestsCount' ? sorter.order : null,
      render: (count: number, record: MyListingData) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 60 }}>
          <Badge
            count={count}
            showZero
            style={{
              backgroundColor: count > 0 ? '#ff4d4f' : '#f5f5f5',
              color: count > 0 ? 'white' : '#808080',
              minWidth: 32,
              fontSize: 14,
            }}
          />
          {count > 0 && (
            <Button
              type="link"
              size="small"
              style={{ padding: 0, height: 'auto', marginTop: 0 }}
              onClick={() => onViewAllRequests(record.id)}
            >
              <span style={{ color: 'var(--color-action-foreground)', fontSize: 12 }}>View all</span>
            </Button>
          )}
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
      renderGridItem={(item) => (
        <AllListingsCard
          listing={item}
          onViewPendingRequests={onViewAllRequests}
          onAction={onAction}
        />
      )}
    />
  );
}