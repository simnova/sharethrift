import { Button, Image, Popconfirm } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Dashboard } from '@sthrift/ui-components';
import type { MyListingData } from '../../../../my-listings/components/my-listings-dashboard.types.ts';
import { TitleFilter } from './admin-listings-table.title-filter';
import { StatusFilter } from './admin-listings-table.status-filter';
import { StatusTag } from './admin-listings-table.status-tag';
import { formatDate } from './admin-listings-table.utils';

export interface AdminListingsTableProps {
  readonly data: ReadonlyArray<MyListingData>;
  readonly searchText: string;
  readonly statusFilters: ReadonlyArray<string>;
  readonly sorter: { readonly field: string | null; readonly order: 'ascend' |  'descend' | null };
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

export function AdminListingsTable({
  data,
  searchText,
  statusFilters,
  onSearch,
  sorter,
  currentPage,
  pageSize,
  total,
  loading = false,
  onStatusFilter,
  onTableChange,
  onPageChange,
  onAction,
}: AdminListingsTableProps) {
  let publishedAtSortOrder: 'ascend' | 'descend' | null = null;
  if (sorter?.field === 'publishedAt') publishedAtSortOrder = sorter.order === 'ascend' ? 'ascend' : 'descend';

  let reservationPeriodSortOrder: 'ascend' | 'descend' | null = null;
  if (sorter?.field === 'reservationPeriod') reservationPeriodSortOrder = sorter.order === 'ascend' ? 'ascend' : 'descend';

  const columns: TableProps<MyListingData>['columns'] = [
    {
      title: 'Listing',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <TitleFilter
          searchText={searchText}
          onSearch={onSearch}
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
        />
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
      sortOrder: publishedAtSortOrder,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Reservation Period',
      dataIndex: 'reservationPeriod',
      key: 'reservationPeriod',
      sorter: true,
      sortOrder: reservationPeriodSortOrder,
      render: (period: string) => period,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filterDropdown: ({ confirm }) => (
        <StatusFilter statusFilters={[...statusFilters]} onStatusFilter={onStatusFilter} confirm={confirm} />
      ),
      filterIcon: (filtered: boolean) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (status: string) => <StatusTag status={status} />,
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
          {(record.status === 'Blocked') && (
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
      data={[...data]}
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
