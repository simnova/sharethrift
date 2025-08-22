import { Table, Input, Checkbox, Button, Image, Pagination, Popconfirm } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { StatusTag } from '@sthrift/ui-sharethrift-components';
import type { MyListing } from '../mock-data';

const { Search } = Input;

export interface AllListingsTableProps {
  data: MyListing[];
  searchText: string;
  statusFilters: string[];
  sorter: { field: string | null; order: 'ascend' | 'descend' | null };
  currentPage: number;
  pageSize: number;
  total: number;
  onSearch: (value: string) => void;
  onStatusFilter: (checkedValues: string[]) => void;
  onTableChange: TableProps<MyListing>['onChange'];
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

export function AllListingsTable({
  data,
  searchText,
  statusFilters,
  sorter,
  currentPage,
  pageSize,
  total,
  onSearch,
  onStatusFilter,
  onTableChange,
  onPageChange,
  onAction,
  onViewAllRequests,
}: AllListingsTableProps) {
  
  const getActionButtons = (record: MyListing) => {
    const buttons = [];
    
    // Conditional actions based on status
    if (record.status === 'Active' || record.status === 'Reserved') {
      buttons.push(
        <Button key="pause" type="link" size="small" onClick={() => onAction('pause', record._id)}>
          Pause
        </Button>
      );
    }
    
    if (record.status === 'Paused' || record.status === 'Expired') {
      buttons.push(
        <Button key="reinstate" type="link" size="small" onClick={() => onAction('reinstate', record._id)}>
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
          onConfirm={() => onAction('appeal', record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" size="small">Appeal</Button>
        </Popconfirm>
      );
    }
    
    if (record.status === 'Draft') {
      buttons.push(
        <Button key="publish" type="link" size="small" onClick={() => onAction('publish', record._id)}>
          Publish
        </Button>
      );
    }
    
    // Always available actions
    buttons.push(
      <Button key="edit" type="link" size="small" onClick={() => onAction('edit', record._id)}>
        Edit
      </Button>
    );
    
    buttons.push(
      <Popconfirm
        key="delete"
        title="Delete this listing?"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={() => onAction('delete', record._id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="link" size="small" danger>Delete</Button>
      </Popconfirm>
    );
    
    return buttons;
  };

  const columns: ColumnsType<MyListing> = [
    {
      title: 'Listing',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Search listings"
            value={searchText}
            onChange={(e) => {
              setSelectedKeys([e.target.value]);
              onSearch(e.target.value);
            }}
            onSearch={() => confirm()}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (title, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src={record.images[0]}
            alt={title}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
          <span style={{ fontWeight: 500 }}>{title}</span>
        </div>
      ),
    },
    {
      title: 'Published At',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      sorter: true,
      sortOrder: sorter.field === 'publishedAt' ? sorter.order : null,
      render: (date: Date) => date.toLocaleDateString(),
    },
    {
      title: 'Reservation Period',
      key: 'reservationPeriod',
      sorter: (a, b) => a.sharingPeriodStart.getTime() - b.sharingPeriodStart.getTime(),
      sortOrder: sorter.field === 'sharingPeriodStart' ? sorter.order : null,
      render: (_, record) => (
        <span>
          {record.sharingPeriodStart.toLocaleDateString()} - {record.sharingPeriodEnd.toLocaleDateString()}
        </span>
      ),
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
              onStatusFilter(checkedValues as string[]);
              confirm();
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          />
        </div>
      ),
      filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      render: (status: string) => (
        <StatusTag status={status as any} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {getActionButtons(record)}
        </div>
      ),
    },
    {
      title: 'Pending Requests',
      dataIndex: 'pendingRequests',
      key: 'pendingRequests',
      sorter: true,
      sortOrder: sorter.field === 'pendingRequests' ? sorter.order : null,
      render: (count: number, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{count}</span>
          {count > 0 && (
            <Button 
              type="link" 
              size="small" 
              style={{ padding: 0, height: 'auto' }}
              onClick={() => onViewAllRequests(record._id)}
            >
              <div style={{
                backgroundColor: '#ff4d4f',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                {count}
              </div>
              <span style={{ marginLeft: 4, color: '#1890ff' }}>View all</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={false}
        onChange={onTableChange}
        style={{ marginBottom: 16 }}
      />
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={false}
          showQuickJumper={false}
        />
      </div>
    </div>
  );
}