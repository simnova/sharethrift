import { Table, Input, Checkbox, Button, Image, Pagination, Popconfirm } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { StatusTag } from '@sthrift/ui-sharethrift-components';
import type { ListingRequest } from '../mock-data';

const { Search } = Input;

export interface RequestsTableProps {
  data: ListingRequest[];
  searchText: string;
  statusFilters: string[];
  sorter: { field: string | null; order: 'ascend' | 'descend' | null };
  currentPage: number;
  pageSize: number;
  total: number;
  onSearch: (value: string) => void;
  onStatusFilter: (checkedValues: string[]) => void;
  onTableChange: TableProps<ListingRequest>['onChange'];
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

export function RequestsTable({
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
}: RequestsTableProps) {
  
  const getActionButtons = (record: ListingRequest) => {
    const buttons = [];
    
    // Conditional actions based on status
    if (record.status === 'Cancelled' || record.status === 'Rejected') {
      buttons.push(
        <Popconfirm
          key="delete"
          title="Delete this request?"
          description="Are you sure you want to delete this request? This action cannot be undone."
          onConfirm={() => onAction('delete', record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" size="small" danger>Delete</Button>
        </Popconfirm>
      );
    }
    
    if (record.status === 'Closed' || record.status === 'Accepted') {
      buttons.push(
        <Button key="message" type="link" size="small" onClick={() => onAction('message', record._id)}>
          Message
        </Button>
      );
    }
    
    if (record.status === 'Accepted') {
      buttons.push(
        <Popconfirm
          key="close"
          title="Close this request?"
          description="Are you sure you want to close this request?"
          onConfirm={() => onAction('close', record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" size="small">Close</Button>
        </Popconfirm>
      );
    }
    
    if (record.status === 'Pending') {
      buttons.push(
        <Button key="accept" type="link" size="small" onClick={() => onAction('accept', record._id)}>
          Accept
        </Button>
      );
      buttons.push(
        <Button key="reject" type="link" size="small" onClick={() => onAction('reject', record._id)}>
          Reject
        </Button>
      );
    }
    
    return buttons;
  };

  const columns: ColumnsType<ListingRequest> = [
    {
      title: 'Listing',
      key: 'listing',
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
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src={record.listing.images[0]}
            alt={record.listing.title}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
          <span style={{ fontWeight: 500 }}>{record.listing.title}</span>
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
      render: (date: Date) => date.toISOString().slice(0, 10),
    },
    {
      title: 'Reservation Period',
      key: 'reservationPeriod',
      sorter: (a, b) => a.reservationPeriodStart.getTime() - b.reservationPeriodStart.getTime(),
      sortOrder: sorter.field === 'reservationPeriodStart' ? sorter.order : null,
      render: (_, record) => (
        <span>
          {record.reservationPeriodStart.toISOString().slice(0, 10)} - {record.reservationPeriodEnd.toISOString().slice(0, 10)}
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
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
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