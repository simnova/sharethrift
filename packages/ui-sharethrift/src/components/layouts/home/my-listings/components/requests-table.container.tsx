import { useState, useMemo } from 'react';
import { Dashboard } from '@sthrift/ui-sharethrift-components';
import { Input, Checkbox, Button, Image, Popconfirm } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { StatusTag } from '@sthrift/ui-sharethrift-components';
import { MOCK_LISTING_REQUESTS, type ListingRequest } from '../mock-data';

const { Search } = Input;

const REQUEST_STATUS_OPTIONS = [
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Closed', value: 'Closed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Closing', value: 'Closing' },
];

export function RequestsTableContainer({ currentPage, onPageChange }: { currentPage: number, onPageChange: (page: number) => void }) {
  const [searchText, setSearchText] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sorter, setSorter] = useState<{
    field: string | null;
    order: 'ascend' | 'descend' | null;
  }>({ field: null, order: null });
  const pageSize = 6;

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = MOCK_LISTING_REQUESTS;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(request =>
        request.listing.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(request =>
        statusFilters.includes(request.status)
      );
    }

    // Apply sorting
    if (sorter.field && sorter.order) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        if (sorter.field === 'requestedBy') {
          aValue = a.requestedBy;
          bValue = b.requestedBy;
        } else if (sorter.field === 'requestedOn') {
          aValue = a.requestedOn;
          bValue = b.requestedOn;
        } else if (sorter.field === 'reservationPeriodStart') {
          aValue = a.reservationPeriodStart;
          bValue = b.reservationPeriodStart;
        } else {
          aValue = a[sorter.field as keyof ListingRequest];
          bValue = b[sorter.field as keyof ListingRequest];
        }
        
        let comparison = 0;
        if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }
        
        return sorter.order === 'ascend' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [searchText, statusFilters, sorter]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    onPageChange(1);
  };

  const handleStatusFilter = (checkedValues: string[]) => {
    setStatusFilters(checkedValues);
    onPageChange(1);
  };

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    setSorter({
      field: sorter.field || null,
      order: sorter.order || null,
    });
    onPageChange(1);
  };

  const handleAction = (action: string, requestId: string) => {
    // TODO: Implement actual actions in future PRs
    console.log(`Action: ${action}, Request ID: ${requestId}`);
  };

  const getActionButtons = (record: ListingRequest) => {
    const buttons = [];
    
    // Conditional actions based on status
    if (record.status === 'Cancelled' || record.status === 'Rejected') {
      buttons.push(
        <Popconfirm
          key="delete"
          title="Delete this request?"
          description="Are you sure you want to delete this request? This action cannot be undone."
          onConfirm={() => handleAction('delete', record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" size="small" danger>Delete</Button>
        </Popconfirm>
      );
    }
    
    if (record.status === 'Closed' || record.status === 'Accepted') {
      buttons.push(
        <Button key="message" type="link" size="small" onClick={() => handleAction('message', record._id)}>
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
          onConfirm={() => handleAction('close', record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" size="small">Close</Button>
        </Popconfirm>
      );
    }
    
    if (record.status === 'Pending') {
      buttons.push(
        <Button key="accept" type="link" size="small" onClick={() => handleAction('accept', record._id)}>
          Accept
        </Button>
      );
      buttons.push(
        <Button key="reject" type="link" size="small" onClick={() => handleAction('reject', record._id)}>
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
              handleSearch(e.target.value);
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
              handleStatusFilter(checkedValues as string[]);
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
    <Dashboard
      data={paginatedData}
      columns={columns}
      currentPage={currentPage}
      pageSize={pageSize}
      total={filteredAndSortedData.length}
      onPageChange={onPageChange}
      showPagination={true}
      onChange={handleTableChange}
      rowKey="_id"
      tableClassName="requests-table"
      emptyText="No requests found"
    />
  );
}