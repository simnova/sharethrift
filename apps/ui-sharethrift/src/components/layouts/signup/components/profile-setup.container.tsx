import { type FC, useCallback } from "react";
import { ProfileSetup } from "./profile-setup.tsx";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
  type PersonalUserUpdateInput,
  ProfileSetUpContainerPersonalUserUpdateDocument,
} from "../../../../generated.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const ProfileSetupContainer: FC = () => {
  const { data, loading: userLoading, error } = useQuery(ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument);
  const [updateUser, { loading: updateUserLoading }] = useMutation(ProfileSetUpContainerPersonalUserUpdateDocument);
  const navigate = useNavigate();
  const handleSaveAndContinue = useCallback(
    async (values: PersonalUserUpdateInput) => {
      try {
        const result = await updateUser({ variables: { input: values } });
        if (result.data?.personalUserUpdate.status.success) {
          message.success("Profile updated successfully");
          navigate("/signup/terms");
        } else {
          message.error(`Failed to update profile: ${result.data?.personalUserUpdate.status.errorMessage}`);
        }
      } catch {
        message.error("Failed to save account setup");
      }
    },
    [updateUser, navigate]
  );
  return (
    <ComponentQueryLoader
      loading={userLoading || updateUserLoading}
      error={error}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      hasDataComponent={
        <ProfileSetup
          loading={updateUserLoading}
          currentPersonalUserData={data?.currentPersonalUserAndCreateIfNotExists}
          onSaveAndContinue={handleSaveAndContinue}
        />
      }
    />
  );
};
