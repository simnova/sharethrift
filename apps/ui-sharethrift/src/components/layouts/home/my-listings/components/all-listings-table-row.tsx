import { Badge, Button, Image } from 'antd';

import type { HomeAllListingsTableContainerListingFieldsFragment } from '../../../../../generated.tsx';

export function AllListingsTableListingCell({
	title,
	imageSrc,
}: Readonly<{
	title: string;
	imageSrc: string;
}>): React.ReactNode {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
			<Image
				src={imageSrc}
				alt={title}
				width={72}
				height={72}
				style={{ objectFit: 'cover', borderRadius: 4 }}
				preview={false}
			/>
			<span>{title}</span>
		</div>
	);
}

export function AllListingsTablePublishedAtCell({
	date,
}: Readonly<{
	date?: string;
}>): React.ReactNode {
	if (!date) {
		return 'N/A';
	}

	const d = new Date(date);
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	const formatted = `${yyyy}-${mm}-${dd}`;

	return (
		<span
			style={{
				fontVariantNumeric: 'tabular-nums',
				fontFamily: 'inherit',
				minWidth: 100,
				display: 'inline-block',
				textAlign: 'left',
			}}
		>
			{formatted}
		</span>
	);
}

export function AllListingsTableReservationPeriodCell({
	startDate,
	endDate,
}: Readonly<{
	startDate: HomeAllListingsTableContainerListingFieldsFragment['sharingPeriodStart'];
	endDate: HomeAllListingsTableContainerListingFieldsFragment['sharingPeriodEnd'];
}>): React.ReactNode {
	if (!startDate || !endDate) {
		return 'N/A';
	}

	const start =
		typeof startDate === 'string'
			? startDate.slice(0, 10)
			: new Date(startDate).toISOString().slice(0, 10);
	const end =
		typeof endDate === 'string'
			? endDate.slice(0, 10)
			: new Date(endDate).toISOString().slice(0, 10);
	const period = `${start} - ${end}`;

	return (
		<span
			style={{
				fontVariantNumeric: 'tabular-nums',
				fontFamily: 'inherit',
				minWidth: 200,
				display: 'inline-block',
				textAlign: 'left',
			}}
		>
			{period}
		</span>
	);
}

export function AllListingsTablePendingRequestsCell({
	count,
	listingId,
	onViewAllRequests,
}: Readonly<{
	count: number;
	listingId: string;
	onViewAllRequests: (listingId: string) => void;
}>): React.ReactNode {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: 60,
			}}
		>
			<Badge count={count} showZero />
			{count > 0 && (
				<Button
					type="link"
					size="small"
					onClick={() => onViewAllRequests(listingId)}
					style={{ marginTop: 4 }}
				>
					View All
				</Button>
			)}
		</div>
	);
}
