import { FilterOutlined } from '@ant-design/icons';

	readonly filtered: boolean;
}

export function StatusFilterIcon({ filtered }: Readonly<StatusFilterIconProps>): React.ReactNode {
	return <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
}
