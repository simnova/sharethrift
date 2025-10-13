import { Input, Checkbox, Button, Image, Popconfirm, Tag } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-components';
import type { MyListingData } from '../../../my-listings/components/my-listings-dashboard.types.ts';

const { Search } = Input;

export interface AdminListingsTableProps {
  readonly data: ReadonlyArray<MyListingData>;
  readonly searchText: string;
  readonly statusFilters: ReadonlyArray<string>;
  readonly sorter: { readonly field: string | null; readonly order: 'ascend' | 'descend' | null };
  readonly currentPage: number;
  readonly pageSize: number;
  readonly total: number;
  readonly loading?: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (checkedValues: string[]) => void;
  onTableChange: TableProps<MyListingData>['onChange'];
  onPageChange: (page: number) => void;
  onAction: (action: string, listingId: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'Appealed', value: 'Appeal Requested' },
  { label: 'Blocked', value: 'Blocked' },
];

export function AdminListingsTable({
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
}: AdminListingsTableProps) {
  const columns: TableProps<MyListingData>['columns'] = [
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
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
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
          if (!date) return 'N/A';
          const d = new Date(date);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return (
            <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 100, display: 'inline-block' }}>
              {`${yyyy}-${mm}-${dd}`}
            </span>
          );
        },
      },
      {
        title: 'Reservation Period',
        dataIndex: 'reservationPeriod',
        key: 'reservationPeriod',
        sorter: true,
        sortOrder: sorter.field === 'reservationPeriod' ? sorter.order : null,
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
              value={statusFilters as string[]}
              onChange={(checkedValues: Array<string | number>) => {
                onStatusFilter(checkedValues.map(String));
                confirm();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            />
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        render: (status: string) => {
          const normalized = status === 'Appeal Requested' ? 'Appealed' : status;
          const color = normalized === 'Appealed' ? 'gold' : 'purple';
          return <Tag color={color}>{normalized}</Tag>;
        },
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 240,
        render: (_: unknown, record: MyListingData) => (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start' }}>
            <Button type="link" size="small" onClick={() => onAction('view', record.id)}>
              View
            </Button>
            {(record.status === 'Blocked' || record.status === 'Appeal Requested') && (
              <Button type="link" size="small" onClick={() => onAction('unblock', record.id)}>
                Unblock
              </Button>
            )}
            <Popconfirm
              title="Remove this listing?"
              description="This action cannot be undone."
              onConfirm={() => onAction('remove', record.id)}
              okText="Remove"
              cancelText="Cancel"
            >
              <Button type="link" size="small" danger>
                Remove
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ];

  return (
    <Dashboard
      data={data as MyListingData[]}
      columns={columns}
      loading={loading}
      currentPage={currentPage}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      showPagination={true}
      onChange={onTableChange}
    />
  );
}
