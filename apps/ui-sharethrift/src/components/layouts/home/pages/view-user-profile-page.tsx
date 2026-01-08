import { UserProfileViewContainer } from '../components/view-user-profile/user-profile-view.container.tsx';

/**
 * Page component for viewing a user's public profile.
 * This is a public route - no authentication required.
 * @returns JSX element containing the user profile view
 */
export const ViewUserProfile: React.FC = () => {
	return <UserProfileViewContainer />;
};
