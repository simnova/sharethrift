import Row from 'antd/es/row';
import Col from 'antd/es/col';
import type { ItemListing } from '../../../../../../../generated.tsx';

interface ListingInformationProps {
	listing: ItemListing;
	className?: string;
}

export const ListingInformation: React.FC<ListingInformationProps> = ({
	listing,
	className = '',
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
			<Col span={24}>
				<div
					style={{
						padding: '16px 18px',
						borderRadius: '12px',
						backgroundColor: 'rgba(232, 229, 220, 0.55)',
						border: '1px solid rgba(92, 138, 138, 0.25)',
					}}
				>
					<div
						style={{
							fontWeight: 700,
							marginBottom: 6,
							color: 'var(--color-message-text)',
						}}
					>
						Admin view only
					</div>
					<div
						style={{
							fontSize: '14px',
							lineHeight: 1.5,
							color: 'var(--color-message-text)',
						}}
					>
						Reservations are disabled in the admin portal. Admins can review
						listing details here, but borrower and sharer actions stay in the
						main user portal.
					</div>
				</div>
			</Col>
		</Row>
	);
};
