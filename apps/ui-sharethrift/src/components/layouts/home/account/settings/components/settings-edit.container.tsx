import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { message } from "antd";
import { SettingsEdit } from "../pages/settings-edit.tsx";
import { HomeAccountSettingsViewContainerCurrentUserDocument } from "../../../../../../generated.tsx";
import { HomeAccountSettingsEditContainerUpdatePersonalUserDocument } from "../../../../../../generated.tsx";
import type { SettingsUser } from "../components/settings-view.types.ts";
// export interface EditSettingsFormData {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   aboutMe?: string;
//   address1?: string;
//   address2?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   zipCode?: string;
// }

// export interface EditSettingsContainerProps {
//   mappedUser?: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     username: string;
//     email: string;
//     accountType?: string;
//     location: {
//       address1?: string | null;
//       address2?: string | null;
//       city?: string | null;
//       state?: string | null;
//       country?: string | null;
//       zipCode?: string | null;
//     };
//     createdAt?: string;
//   };
//   isLoading: boolean;
//   isSaving: boolean;
//   onSave: (values: EditSettingsFormData) => Promise<void>;
//   onCancel: () => void;
// }

function SettingsEditLoader() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Query current user data
  const { data: userData, loading: userLoading } =
    useQuery<CurrentUserSettingsQueryData>(
      HomeAccountSettingsViewContainerCurrentUserDocument
    );

  // Mutation for updating user profile
  const [updateUserMutation] = useMutation(
    HomeAccountSettingsEditContainerUpdatePersonalUserDocument
  );

  if (!userLoading && !userData?.currentPersonalUserAndCreateIfNotExists) {
    return <div>User not found</div>;
  }

  const user = userData.currentPersonalUserAndCreateIfNotExists;

  const mappedUser: SettingsUser = {
    id: user.id,
    firstName: user.account.profile.firstName,
    lastName: user.account.profile.lastName,
    username: user.account.username,
    email: user.account.email,
    accountType: user.account.accountType,
    aboutMe: user.account.profile.aboutMe ?? "",
    location: {
      address1: user.account.profile.location.address1,
      address2: user.account.profile.location.address2,
      city: user.account.profile.location.city,
      state: user.account.profile.location.state,
      country: user.account.profile.location.country,
      zipCode: user.account.profile.location.zipCode,
    },
    billing: user.account.profile.billing,
    createdAt: user.createdAt,
  };

  const handleSave = async (values: SettingsUser) => {
    if (!user) {
      message.error("User not found");
      return;
    }

    try {
      setIsSaving(true);

      await updateUserMutation({
        variables: {
          input: {
            id: user.id,
            account: {
              username: values.username,
              profile: {
                firstName: values.firstName,
                lastName: values.lastName,
                aboutMe: values.aboutMe ?? "",
                location: {
                  address1: values.location?.address1 ?? "",
                  address2: values.location?.address2 ?? "",
                  city: values.location?.city ?? "",
                  state: values.location?.state ?? "",
                  country: values.location?.country ?? "",
                  zipCode: values.location?.zipCode ?? "",
                },
              },
            },
          },
        },
        refetchQueries: [
          { query: HomeAccountSettingsViewContainerCurrentUserDocument },
        ],
      });

      message.success("Settings updated successfully!");
      navigate("/account/settings");
    } catch (error) {
      message.error("Failed to update settings. Please try again.");
      console.error("Error updating settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/account/settings");
  };

  if (userLoading || !mappedUser) {
    return <div>Loading account settings...</div>;
  }

  return (
    <SettingsEdit
      user={mappedUser}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      isLoading={userLoading}
    />
  );
}

export function SettingsEditContainer() {
  return <SettingsEditLoader />;
}
