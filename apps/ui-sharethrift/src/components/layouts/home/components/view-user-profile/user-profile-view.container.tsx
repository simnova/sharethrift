import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { ProfileView } from "../../account/profile/components/profile-view.tsx";
import { useQuery } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import {
  type ItemListing,
  HomeViewUserProfileContainerUserByIdDocument,
} from "../../../../../generated.tsx";

/**
 * Container component for viewing another user's public profile.
 * Fetches user data and renders the ProfileView in read-only mode.
 * This route is publicly accessible without authentication.
 * @returns JSX element containing the user profile view with loading/error states
 */
export const UserProfileViewContainer: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    data: userQueryData,
    loading: userLoading,
    error: userError,
  } = useQuery(HomeViewUserProfileContainerUserByIdDocument, {
    variables: { userId: userId ?? "" },
    skip: !userId,
  });

  const viewedUser = userQueryData?.userById;

  const handleListingClick = useCallback((listingId: string) => {
    navigate(`/listing/${listingId}`);
  }, [navigate]);

	const handleEditSettings = useCallback(() => undefined, []);

  // Build profile user data from the query response - memoized for performance
  const profileUser = useMemo(() => {
    if (!viewedUser) return null;

    // viewedUser is a union type (PersonalUser | AdminUser) - both have the same account structure
    if (!('account' in viewedUser)) return null;

    const { account, createdAt } = viewedUser;
    return {
      id: viewedUser.id,
      firstName: account?.profile?.firstName || "",
      lastName: account?.profile?.lastName || "",
      username: account?.username || "",
      email: "", // Don't expose email for other users
      accountType: account?.accountType || "",
      location: {
        city: account?.profile?.location?.city || "",
        state: account?.profile?.location?.state || "",
      },
      createdAt: createdAt || "",
    };
  }, [viewedUser]);

  // TODO: Implement public listings query for user profiles
  // Currently, viewing other users' profiles doesn't show their listings.
  // This would require a backend query to fetch public listings by user ID.
  const listings: ItemListing[] = [];

  const profileView = profileUser ? (
    <ProfileView
      user={profileUser}
      listings={listings}
      isOwnProfile={false}
      onEditSettings={handleEditSettings}
      onListingClick={handleListingClick}
    />
  ) : (
    <></>
  );

	if (!userId) {
		return <div>User ID is required</div>;
	}

  return (
    <ComponentQueryLoader
      loading={userLoading}
      error={userError}
      hasData={profileUser}
      hasDataComponent={profileView}
    />
  );
};
