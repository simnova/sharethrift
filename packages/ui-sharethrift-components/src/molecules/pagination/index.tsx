import React from 'react';
import { Pagination as AntdPagination } from 'antd';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import styles from './index.module.css';

export type PaginationProps = AntdPaginationProps;

export const Pagination: React.FC<PaginationProps> = (props) => {
  return <AntdPagination {...props} className={styles.pagination} />;
};
