
interface ListingTitleFilterIconProps {
	readonly filtered: boolean;
}

export function ListingTitleFilterIcon({ filtered }: Readonly<ListingTitleFilterIconProps>): React.ReactNode {
	return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
}
