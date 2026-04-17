import { Route, Routes } from 'react-router-dom';
import { AdminListingOperationsPage } from './components/pages/admin-listing-operations/pages/admin-listing-operations-page.tsx';
import { SectionLayout } from './section-layout.tsx';

const ListingOperationsRoutes: React.FC = () => {
	return (
		<Routes>
			<Route element={<SectionLayout />}>
				<Route path="" element={<AdminListingOperationsPage />} />
			</Route>
		</Routes>
	);
};

export default ListingOperationsRoutes;
