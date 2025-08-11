import { Card } from 'antd';
import type { MockListingData } from '../../utils/mock-listings-data';

export interface ListingCardProps {
	listing: MockListingData;
	onClick?: () => void;
}

export default function ListingCard({ listing, onClick }: ListingCardProps) {
	const formatDateRange = (start: Date, end: Date): string => {
		const startDate = start.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		const endDate = end.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		return `${startDate} → ${endDate}`;
	};

	return (
		<Card
			hoverable
			className="w-57 cursor-pointer" // 228px = w-57 in Tailwind
			style={{ width: '228px' }}
			cover={
				<div className="h-57 overflow-hidden"> {/* Square aspect ratio */}
					<img
						alt={listing.title}
						src={listing.thumbnailImage}
						className="w-full h-full object-cover"
						onError={(e) => {
							// Fallback to a placeholder if image fails to load
							e.currentTarget.src = '/src/assets/item-images/list.png';
						}}
					/>
				</div>
			}
			onClick={onClick}
		>
			<Card.Meta
				title={
					<div className="text-lg font-semibold truncate" title={listing.title}>
						{listing.title}
					</div>
				}
				description={
					<div className="space-y-1">
						<div className="text-sm text-gray-600">
							{formatDateRange(listing.sharingPeriodStart, listing.sharingPeriodEnd)}
						</div>
						<div className="text-sm text-gray-500">{listing.location}</div>
					</div>
				}
			/>
		</Card>
	);
}