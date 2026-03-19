import { Routes, Route } from 'react-router-dom';
import { MyReservationsMain } from './pages/my-reservations.tsx';

function MyReservationsMainWrapper() {
	return <MyReservationsMain />;
}

export const MyReservationsRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="" element={<MyReservationsMainWrapper />} />{' '}
			{/*Here for show purposes*/}
			<Route path="user/:userId" element={<MyReservationsMainWrapper />} />
		</Routes>
	);
};
