import React from 'react';
import { Checkbox } from 'antd';

const STATUS_OPTIONS = [
  { label: 'Appealed', value: 'Appeal Requested' },
  { label: 'Blocked', value: 'Blocked' },
];

type StatusFilterProps = {
  statusFilters: string[];
  onStatusFilter: (vals: string[]) => void;
  confirm: () => void;
};

export const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilters, onStatusFilter, confirm }) => {
  return (
    <div style={{ padding: 16, width: 200 }}>
      <div style={{ marginBottom: 8, fontWeight: 500 }}>Filter by Status</div>
      <Checkbox.Group
        options={STATUS_OPTIONS}
        value={[...statusFilters]}
        onChange={(vals) => {
          onStatusFilter((vals as Array<string | number>).map(String));
          confirm();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      />
    </div>
  );
};

