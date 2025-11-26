import { Tabs, Typography } from 'antd';
import styles from './my-reservations.module.css';
import { ReservationsViewActiveContainer } from '../components/reservations-view-active.container.tsx';
import { ReservationsViewHistoryContainer } from '../components/reservations-view-history.container.tsx';
const { Title } = Typography;

export interface MyReservationsMainProps {
	userId?: string;
}

export const MyReservationsMain: React.FC = () => {
	const tabItems = [
		{
			key: 'active',
			label: `Active Reservations`,
			children: <ReservationsViewActiveContainer />,
		},
		{
			key: 'history',
			label: `Reservation History`,
			children: <ReservationsViewHistoryContainer />,
		},
	];
	return (
		<div className={`p-6 ${styles['mainContent']}`}>
			<Title level={2} className={styles['pageTitle']}>
				My Reservations
			</Title>
			<Tabs defaultActiveKey="active" items={tabItems} />
		</div>
	);
};

export default MyReservationsMain;
