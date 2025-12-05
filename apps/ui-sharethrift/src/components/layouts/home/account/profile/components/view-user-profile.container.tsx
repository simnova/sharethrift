import { useEffect, useState } from "react";
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
import { message } from "antd";
import type { ItemListing } from "../../../../../../generated.tsx";
import type { BlockUserFormValues } from "../../../../../shared/user-modals/block-user-modal.tsx";
import { BlockUserModal, UnblockUserModal } from "../../../../../shared/user-modals";

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

    useEffect(() => {
        if (!userId) {
            console.error("User ID is missing in URL parameters");
            navigate("/account/profile");
        }
    }, [userId, navigate]);

    const viewedUser = userQueryData?.userById;
    const currentUser = currentUserData?.currentUser;

    const canViewProfile =
        currentUser?.__typename === "AdminUser" &&
        currentUser?.role?.permissions?.userPermissions?.canViewAllUsers;

    useEffect(() => {
        if (viewedUser?.isBlocked && !canViewProfile) {
            message.error("This user profile is not available");
            navigate("/home");
        }
    }, [viewedUser, canViewProfile, navigate]);


    const handleEditSettings = () => {
        navigate("/account/settings");
    };

    const handleListingClick = (listingId: string) => {
        navigate(`/listing/${listingId}`);
    };

    const handleBlockUser = (data: BlockUserFormValues) => {
        console.log("Block user:", data);
        blockUser({ variables: { userId } });
    };

    const handleUnblockUser = () => {
        unblockUser({ variables: { userId } });
    };

    const isAdmin =
        currentUser?.__typename === "AdminUser" &&
        currentUser?.role?.permissions?.userPermissions?.canBlockUsers;

    const isOwnProfile = currentUser?.id === viewedUser?.id;

    const { account, createdAt, isBlocked } = viewedUser ?? {};

    const profileUser = {
        id: viewedUser?.id,
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
                    adminControls={
                        (isAdmin ?? false) && (
                            <>
                                <BlockUserModal
                                    visible={blockModalVisible}
                                    userName={`${profileUser.firstName} ${profileUser.lastName}`}
                                    onConfirm={handleBlockUser}
                                    onCancel={() => setBlockModalVisible(false)}
                                    loading={blockLoading}
                                />
                                <UnblockUserModal
                                    visible={unblockModalVisible}
                                    userName={`${profileUser.firstName} ${profileUser.lastName}`}
                                    onConfirm={handleUnblockUser}
                                    onCancel={() => setUnblockModalVisible(false)}
                                    loading={unblockLoading}
                                />
                            </>
                        )
                    }
                />
            }
        />
    );
};
