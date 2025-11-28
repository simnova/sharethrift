import { useNavigate, useParams } from "react-router-dom";
import { ProfileView } from "./profile-view.tsx";
import { useQuery, useMutation } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import {
  HomeAccountViewUserProfileBlockUserDocument,
  HomeAccountViewUserProfileCurrentUserDocument,
  HomeAccountViewUserProfileUnblockUserDocument,
  HomeAccountViewUserProfileUserByIdDocument,
} from "../../../../../../generated.tsx";
import { useState } from "react";
import { message } from "antd";
import type { ItemListing } from "../../../../../../generated.tsx";

export const ViewUserProfileContainer: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [unblockModalVisible, setUnblockModalVisible] = useState(false);

  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useQuery(HomeAccountViewUserProfileCurrentUserDocument);

  const {
    data: userQueryData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery(HomeAccountViewUserProfileUserByIdDocument, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  const [blockUser, { loading: blockLoading }] = useMutation(
    HomeAccountViewUserProfileBlockUserDocument,
    {
      onCompleted: () => {
        message.success("User blocked successfully");
        setBlockModalVisible(false);
        refetchUser();
      },
      onError: (err) => {
        message.error(`Failed to block user: ${err.message}`);
      },
    }
  );

  const [unblockUser, { loading: unblockLoading }] = useMutation(
    HomeAccountViewUserProfileUnblockUserDocument,
    {
      onCompleted: () => {
        message.success("User unblocked successfully");
        setUnblockModalVisible(false);
        refetchUser();
      },
      onError: (err) => {
        message.error(`Failed to unblock user: ${err.message}`);
      },
    }
  );

  // Check if userId is missing after all hooks
  if (!userId) {
    navigate("/account/profile");
    return null;
  }

  const handleEditSettings = () => {
    navigate("/account/settings");
  };

  const handleListingClick = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const handleBlockUser = (data: { reason: string; description: string }) => {
    console.log("Block user:", data);
    // If the mutation supports reason/description, include them in variables.
    // Currently we send only userId to match existing schema.
    blockUser({ variables: { userId } });
  };

  const handleUnblockUser = () => {
    unblockUser({ variables: { userId } });
  };

  const currentUser = currentUserData?.currentUser;
  const viewedUser = userQueryData?.userById;

  // Check if current user is admin with permission to block users
  const isAdmin =
    currentUser?.__typename === "AdminUser" &&
    currentUser?.role?.permissions?.userPermissions?.canBlockUsers;

  // Check if current user can view this profile
  const canViewProfile =
    currentUser?.__typename === "AdminUser" &&
    currentUser?.role?.permissions?.userPermissions?.canViewAllUsers;

  // Blocked users can only be viewed by admins
  if (viewedUser?.isBlocked && !canViewProfile) {
    message.error("This user profile is not available");
    navigate("/home");
    return null;
  }

  if (!viewedUser || !currentUser) {
    return null;
  }

  const { account, createdAt, isBlocked } = viewedUser;
  const isOwnProfile = currentUser.id === viewedUser.id;

  const profileUser = {
    id: viewedUser.id,
    firstName: account?.profile?.firstName || "",
    lastName: account?.profile?.lastName || "",
    username: account?.username || "",
    email: account?.email || "",
    accountType: account?.accountType || "",
    location: {
      city: account?.profile?.location?.city || "",
      state: account?.profile?.location?.state || "",
    },
    createdAt: createdAt || "",
  };

  // TODO need to show other user's listing
  const listings: ItemListing[] = [];

  return (
    <ComponentQueryLoader
      loading={userLoading || currentUserLoading}
      error={userError ?? currentUserError}
      hasData={viewedUser && currentUser}
      hasDataComponent={
        <ProfileView
          user={profileUser}
          listings={listings}
          isOwnProfile={isOwnProfile}
          isBlocked={isBlocked ?? false}
          isAdmin={isAdmin ?? false}
          canBlockUser={isAdmin ?? false}
          onEditSettings={handleEditSettings}
          onListingClick={handleListingClick}
          onBlockUser={() => setBlockModalVisible(true)}
          onUnblockUser={() => setUnblockModalVisible(true)}
          blockModalVisible={blockModalVisible}
          unblockModalVisible={unblockModalVisible}
          onBlockModalCancel={() => setBlockModalVisible(false)}
          onUnblockModalCancel={() => setUnblockModalVisible(false)}
          onBlockModalConfirm={handleBlockUser}
          onUnblockModalConfirm={handleUnblockUser}
          blockLoading={blockLoading}
          unblockLoading={unblockLoading}
        />
      }
    />
  );
};
