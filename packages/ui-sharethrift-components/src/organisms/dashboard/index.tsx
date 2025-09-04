import React from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.css';

const { Text } = Typography;

export interface DashboardProps<T> {
  data: T[];
  columns?: ColumnsType<T>;
  renderGridItem?: (item: T) => React.ReactNode;
  rowKey?: keyof T;
  emptyText?: string;
}

export const Dashboard = <T extends object>({
  data,
  columns,
  renderGridItem,
  rowKey = 'id' as keyof T,
  emptyText = 'No data found',
}: DashboardProps<T>) => {
  return (
    <>
      <div className={styles.desktopOnly}>
        <Table
          columns={columns as ColumnsType<T>}
          dataSource={data}
          rowKey={rowKey as string}
          pagination={false}
          locale={{
            emptyText,
          }}
          rowClassName={() => styles.tableRow}
        />
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