import { useParams, useNavigate } from "react-router-dom";
import { ProfileView } from "../../account/profile/components/profile-view.tsx";
import { useQuery } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import {
  type ItemListing,
  HomeViewUserProfileContainerUserByIdDocument,
} from "../../../../../generated.tsx";

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

  const handleListingClick = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  if (!userId) {
    return <div>User ID is required</div>;
  }

  const viewedUser = userQueryData?.userById;

  const buildProfileUser = () => {
    if (!viewedUser) return null;

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
  };

  // For viewing other users' profiles, we don't show their listings
  // This would require a backend query to fetch public listings by user ID
  const listings: ItemListing[] = [];

  const profileUser = buildProfileUser();

  return (
    <ComponentQueryLoader
      loading={userLoading}
      error={userError}
      hasData={profileUser}
      hasDataComponent={
        <ProfileView
          user={profileUser!}
          listings={listings}
          isOwnProfile={false}
          onEditSettings={() => {}}
          onListingClick={handleListingClick}
        />
      }
    />
  );
};
