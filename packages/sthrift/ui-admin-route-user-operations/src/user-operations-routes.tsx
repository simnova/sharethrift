import { Route, Routes } from 'react-router-dom';
import { AdminUserOperationsPage } from './components/pages/admin-user-operations/pages/admin-user-operations-page.tsx';
import { SectionLayout } from './section-layout.tsx';

const UserOperationsRoutes: React.FC = () => {
	return (
		<Routes>
			<Route element={<SectionLayout />}>
				<Route path="" element={<AdminUserOperationsPage />} />
			</Route>
		</Routes>
	);
};

export default UserOperationsRoutes;
