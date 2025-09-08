import React from 'react';
import { Table, Typography, Pagination, Skeleton } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import styles from './index.module.css';

const { Text } = Typography;

export interface DashboardProps<T> {
  data: T[];
  columns?: ColumnsType<T>;
  renderGridItem?: (item: T) => React.ReactNode;
  rowKey?: keyof T;
  emptyText?: string;
  // Extended props for My Listings functionality
  loading?: boolean;
  // Pagination props
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  // Table props
  onChange?: TableProps<T>['onChange'];
  // Optional styling
  tableClassName?: string;
}

export const Dashboard = <T extends object>({
  data,
  columns,
  renderGridItem,
  rowKey = 'id' as keyof T,
  emptyText = 'No data found',
  loading = false,
  currentPage = 1,
  pageSize = 6,
  total,
  onPageChange,
  showPagination = false,
  onChange,
  tableClassName,
}: DashboardProps<T>) => {
  // Show loading skeleton
  if (loading) {
    return (
      <div className={styles.desktopOnly}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <>
      <div className={styles.desktopOnly}>
        <Table
          columns={columns as ColumnsType<T>}
          dataSource={data}
          rowKey={rowKey as string}
          pagination={showPagination ? false : { pageSize, className: styles.pagination }}
          {...(onChange ? { onChange } : {})}
          locale={{
            emptyText,
          }}
          rowClassName={() => styles.tableRow}
          {...(tableClassName ? { className: tableClassName } : {})}
        />
        
        {showPagination && onPageChange && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total || data.length}
              onChange={onPageChange}
              showSizeChanger={false}
              showQuickJumper={false}
            />
          </div>
        )}
      </div>

      <div className={`${styles.gridContainer} ${styles.mobileOnly}`}>
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item[rowKey] as React.Key} className={styles.gridItem}>
              {renderGridItem?.(item)}
            </div>
          ))
        ) : (
          <div className={styles.emptyText}>
            <Text type="secondary">{emptyText}</Text>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;