import React from 'react';
import { Tag } from 'antd';

type StatusTagProps = { status?: string };

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const normalized = status === 'Appeal Requested' ? 'Appealed' : status ?? 'N/A';
  const color = normalized === 'Appealed' ? 'gold' : 'purple';
  return <Tag color={color}>{normalized}</Tag>;
};

export default StatusTag;
