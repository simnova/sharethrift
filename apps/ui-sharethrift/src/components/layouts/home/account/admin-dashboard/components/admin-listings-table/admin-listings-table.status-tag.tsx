import React from 'react';
import { Tag } from 'antd';

type StatusTagProps = { status?: string };

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const normalized = status === 'Blocked' ? 'Blocked' : status ?? 'N/A';
  const color = normalized === 'Blocked' ? 'red' : 'purple';
  return <Tag color={color}>{normalized}</Tag>;
};

export default StatusTag;
