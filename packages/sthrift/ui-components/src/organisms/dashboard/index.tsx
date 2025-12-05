import type React from 'react';
import { Table, Typography, Pagination, Skeleton, ConfigProvider } from 'antd';
import type { TableProps } from 'antd';
import styles from './index.module.css';

const { Text } = Typography;

interface DashboardProps<T> {
	data: T[];
	columns?: TableProps<T>['columns'];
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
}: DashboardProps<T>): React.ReactElement => {
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
				<ConfigProvider
					theme={{
						components: {
							Table: {
								headerBg: 'var(--color-background-2)',
								headerSortActiveBg: 'var(--color-background-2)',
								headerSortHoverBg: 'var(--color-background-2)',
								bodySortBg: 'var(--color-background)',
								rowHoverBg: 'var(--color-background)',
								headerBorderRadius: 0,
							},
						},
					}}
				>
					<Table
						columns={columns}
						dataSource={data}
						rowKey={rowKey as string}
						pagination={false}
						{...(onChange ? { onChange } : {})}
						locale={{ emptyText }}
						rowClassName={styles.tableRow}
						className={styles.tableContainer}
					/>
				</ConfigProvider>
			</div>

			<div className={styles.gridContainer}>
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

			{showPagination && onPageChange && (
				<div
					style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}
				>
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
		</>
	);
};

