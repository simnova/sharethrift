import type React from 'react';
import { Tag } from 'antd';

interface ReservationStatusTagProps {
	status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED' | 'CANCELLED';
}

const ReservationStatusTagColorMap = {
	REQUESTED: 'blue',
	ACCEPTED: 'green',
	REJECTED: 'red',
	CLOSED: 'purple',
	CANCELLED: 'default',
};

export const ReservationStatusTag: React.FC<ReservationStatusTagProps> = ({
	status,
}) => {
	const color = ReservationStatusTagColorMap[status];
	const statusTextFormatted = status // Removes Underscores and Capitalizes First Letter of Each Word
		.toLowerCase()
		.replaceAll('_', ' ')
		.replaceAll(/\b\w/g, (c) => c.toUpperCase());

	return <Tag color={color}>{statusTextFormatted}</Tag>;
};

