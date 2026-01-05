import { Tag } from 'antd';

import { getStatusTagClass } from './status-tag-class.ts';

export function AllListingsTableStatus({
	status,
}: Readonly<{
	status: string;
}>): React.ReactNode {
	return <Tag className={getStatusTagClass(status)}>{status}</Tag>;
}
