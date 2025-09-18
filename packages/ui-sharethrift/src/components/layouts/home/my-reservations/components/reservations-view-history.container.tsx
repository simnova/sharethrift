import { ReservationsView } from './reservations-view';
import type { ReservationRequest } from '../pages/index.ts';

export const MOCK_HISTORY_RESERVATIONS: ReservationRequest[] = [
	{
		id: '3',
		state: 'CANCELLED',
		reservationPeriodStart: '2025-07-01',
		reservationPeriodEnd: '2025-07-05',
		createdAt: '2025-06-25',
		updatedAt: '2025-07-05',
		listingId: 'listing3',
		reserverId: 'user3',
		closeRequested: false,
		listing: {
			id: 'listing3',
			title: 'DJI Mavic Air 2 Drone',
			imageUrl:
				'https://png.pngtree.com/png-vector/20231104/ourmid/pngtree-dji-mavic-air-2-drone-png-image_10477627.png',
		},
		reserver: {
			id: 'user3',
			firstName: 'Charlie',
			lastName: 'Lee',
			name: 'Charlie Lee',
		},
	},
	{
		id: '4',
		state: 'ACCEPTED',
		reservationPeriodStart: '2025-06-10',
		reservationPeriodEnd: '2025-06-15',
		createdAt: '2025-06-01',
		updatedAt: '2025-06-15',
		listingId: 'listing4',
		reserverId: 'user4',
		closeRequested: true,
		listing: {
			id: 'listing4',
			title: 'GoPro HERO10',
			imageUrl:
				'https://www.uwphotographyguide.com/sites/default/files/header-images/gopro10.png',
		},
		reserver: {
			id: 'user4',
			firstName: 'Sam',
			lastName: 'White',
			name: 'Sam White',
		},
	},
];

export const ReservationsViewHistoryContainer: React.FC = () => {
	// const [reservations, setReservations] = React.useState(MOCK_ACTIVE_RESERVATIONS);
	// const loading = false;
	// const error: string | null = null;
	// const cancelLoading = false;
	// const closeLoading = false;

	return (
		<ReservationsView
			reservations={MOCK_HISTORY_RESERVATIONS}
			showActions={false}
			emptyText="No past reservations"
			loading={false} //temporarily literal values
			error={null}
		/>
	);
};

export default ReservationsViewHistoryContainer;
