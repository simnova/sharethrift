import type { FC } from "react";
import { ProfileSetup } from "./profile-setup.tsx";
import { useQuery, useMutation } from "@apollo/client";
import {
  ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
  type PersonalUserUpdateInput,
  ProfileSetUpContainerPersonalUserUpdateDocument,
} from "../../../../generated.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const ProfileSetupContainer: FC = () => {
  const { data, loading, error } = useQuery(ProfileSetupContainerCurrentPersonalUserAndCreateIfNotExistsDocument);
  const [updateUser] = useMutation(ProfileSetUpContainerPersonalUserUpdateDocument);
  const navigate = useNavigate();
  const handleSaveAndContinue = async (_values: PersonalUserUpdateInput) => {
    // Implement the save logic here, e.g., call a mutation to save the profile data
    try {
      const result = await updateUser({ variables: { input: _values } });
      if (result.data?.personalUserUpdate.status.success) {
        message.success("Profile updated successfully");
        navigate("/signup/terms");
      } else {
        // Handle update failure, e.g., show an error message
        message.error(`Failed to update profile: ${result.data?.personalUserUpdate.status.errorMessage}`);
      }
    } catch {
      message.error("Failed to save account setup");
    }
  };
  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      hasDataComponent={
        <ProfileSetup currentPersonalUserData={data?.currentPersonalUserAndCreateIfNotExists} onSaveAndContinue={handleSaveAndContinue} />
      }
    />
  );
};
