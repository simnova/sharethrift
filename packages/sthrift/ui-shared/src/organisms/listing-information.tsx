import { Row, Col } from 'antd';

interface ListingInformationListing {
	title: string;
	description: string;
	location: string;
	category: string;
	state?: string | null;
}

interface ListingInformationProps {
	listing: ListingInformationListing;
	className?: string;
	actionSlot?: React.ReactNode;
}

export type { ListingInformationListing };

export const ListingInformation: React.FC<ListingInformationProps> = ({
	listing,
	className = '',
	actionSlot,
}) => {
	if (listing.state !== 'Active') {
		return (
			<div className="p-4">
				<button
					type="button"
					disabled
					className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
				>
					Listing Not Available
				</button>
			</div>
		);
	}

	return (
		<Row gutter={[0, 12]} style={{ width: '100%' }} className={className}>
			<Col span={24}>
				{/* Title at top, using title42 class */}
				<div className="title42">{listing.title}</div>
			</Col>
			<Col span={24}>
				{/* Location and Category */}
				<Row gutter={16} align="middle">
					<Col
						span={8}
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							height: '100%',
						}}
					>
						<h5 style={{ marginBottom: 8, marginTop: 0, lineHeight: '18px' }}>
							Located in
						</h5>
						<h5 style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}>
							Category
						</h5>
					</Col>
					<Col
						span={16}
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							height: '100%',
						}}
					>
						<div
							className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]"
							style={{ marginBottom: 8, marginTop: 0, lineHeight: '18px' }}
						>
							<p style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}>
								{listing.location}
							</p>
						</div>
						<div
							className="font-urbanist text-[14px] text-[rgba(0,0,0,0.85)]"
							style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}
						>
							<p style={{ marginBottom: 0, marginTop: 0, lineHeight: '18px' }}>
								{listing.category}
							</p>
						</div>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				{/* Description */}
				<Row>
					<Col span={24}>
						<div
							className="font-urbanist text-[14px] text-[#333333] w-full max-w-[499px]"
							style={{ marginBottom: 8 }}
						>
							<p style={{ marginBottom: 8 }}>{listing.description}</p>
						</div>
					</Col>
				</Row>
			</Col>
			{actionSlot && (
				<Col span={24}>
					{actionSlot}
				</Col>
			)}
		</Row>
	);
};
