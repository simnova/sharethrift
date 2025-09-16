import { Routes, Route } from 'react-router-dom';
import { MyReservationsMain } from './pages/my-reservations.tsx';

function MyReservationsMainWrapper() {
	return <MyReservationsMain />;
}

export default function MyReservationsRoutes() {
	return (
		<Routes>
			<Route path="" element={<MyReservationsMainWrapper />} />{' '}
			{/*Here for show purposes*/}
			<Route path="user/:userId" element={<MyReservationsMainWrapper />} />
		</Routes>
	);
}
