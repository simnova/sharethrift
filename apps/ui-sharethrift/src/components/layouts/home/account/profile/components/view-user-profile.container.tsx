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

interface ProfilePermissions {
    isBlocked: boolean;
    isAdminViewer: boolean;
    canBlockUser: boolean;
}

interface UseProfileBlockingOptions {
    onBlockUser?: (values: BlockUserFormValues) => Promise<unknown> | void;
    onUnblockUser?: () => Promise<unknown> | void;
}

const useProfileBlocking = ({
    onBlockUser,
    onUnblockUser,
}: UseProfileBlockingOptions) => {
    const [blockModalVisible, setBlockModalVisible] = useState(false);
    const [unblockModalVisible, setUnblockModalVisible] = useState(false);

    const handleOpenBlockModal = () => setBlockModalVisible(true);
    const handleOpenUnblockModal = () => setUnblockModalVisible(true);

    const handleConfirmBlockUser = async (values: BlockUserFormValues) => {
        if (!onBlockUser) {
            return;
        }
        try {
            await onBlockUser(values);
            setBlockModalVisible(false);
        } catch {
            message.error("Failed to block user. Please try again.");
        }
    };

    const handleConfirmUnblockUser = async () => {
        if (!onUnblockUser) {
            return;
        }
        try {
            await onUnblockUser();
            setUnblockModalVisible(false);
        } catch {
            message.error("Failed to unblock user. Please try again.");
        }
    };

    return {
        blockModalVisible,
        unblockModalVisible,
        handleOpenBlockModal,
        handleOpenUnblockModal,
        handleConfirmBlockUser,
        handleConfirmUnblockUser,
        closeBlockModal: () => setBlockModalVisible(false),
        closeUnblockModal: () => setUnblockModalVisible(false),
    };
};

export const ViewUserProfileContainer: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();

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

    const isAdmin = Boolean(currentUser?.userIsAdmin);

    // Derive permissions using fine-grained role permissions when available.
    // Fall back to userIsAdmin for now so behavior remains compatible while
    // the schema is being wired through more broadly.
    const canBlockUsersFromRole =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentUser as any)?.role?.permissions?.userPermissions?.canBlockUsers;

    const canBlockUsers = Boolean(
        typeof canBlockUsersFromRole === "boolean"
            ? canBlockUsersFromRole
            : isAdmin,
    );

    const isAdminViewer = isAdmin;

    useEffect(() => {
        if (viewedUser?.isBlocked && !isAdminViewer) {
            message.error("This user profile is not available");
            navigate("/home");
        }
    }, [viewedUser, isAdminViewer, navigate]);


    const handleEditSettings = () => {
        navigate("/account/settings");
    };

    const handleListingClick = (listingId: string) => {
        navigate(`/listing/${listingId}`);
    };

    const handleBlockUser = async (
        _blockUserFormValues: BlockUserFormValues,
    ): Promise<unknown> => {
        // TODO: wire _blockUserFormValues's values through to the backend when supported
        if (!userId) {
            return Promise.reject(new Error("Missing userId for blockUser"));
        }
        return blockUser({ variables: { userId } });
    };

    const handleUnblockUser = async (): Promise<unknown> => {
        if (!userId) {
            return Promise.reject(new Error("Missing userId for unblockUser"));
        }
        return unblockUser({ variables: { userId } });
    };

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

    const permissions: ProfilePermissions = {
        isBlocked: Boolean(isBlocked),
        isAdminViewer,
        canBlockUser: canBlockUsers,
    };

    const blocking = useProfileBlocking({
        onBlockUser: handleBlockUser,
        onUnblockUser: handleUnblockUser,
    });

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
                        permissions={permissions}
                        onEditSettings={handleEditSettings}
                        onListingClick={handleListingClick}
                        blocking={blocking}
                        blockUserLoading={blockLoading}
                        unblockUserLoading={unblockLoading}
                    />
                }
            />
    );
};
