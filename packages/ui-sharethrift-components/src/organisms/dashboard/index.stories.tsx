import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './index';
import type { ColumnsType } from 'antd/es/table';

// Mock data
const mockData = [
  { id: '1', name: 'Item 1', description: 'Description for Item 1' },
  { id: '2', name: 'Item 2', description: 'Description for Item 2' },
  { id: '3', name: 'Item 3', description: 'Description for Item 3' },
];

const mockColumns: ColumnsType<typeof mockData[0]> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
];

const meta: Meta<typeof Dashboard> = {
  title: 'Organisms/Dashboard',
  component: Dashboard,
  argTypes: {
    renderGridItem: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default table view
export const TableView: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
    rowKey: 'id',
    showPagination: false,
  },
};

// Grid view
export const GridView: Story = {
  args: {
    data: mockData,
    renderGridItem: (item) => (
      <div style={{ border: '1px solid #ccc', padding: '16px' }}>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    ),
    rowKey: 'id',
    showPagination: false,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    data: [],
    emptyText: 'No items available',
  },
};

// With pagination
export const WithPagination: Story = {
  args: {
    data: mockData,
    columns: mockColumns,
    rowKey: 'id',
    showPagination: true,
    currentPage: 1,
    pageSize: 2,
    total: mockData.length,
    onPageChange: (page) => console.log('Page changed to:', page),
  },
};
