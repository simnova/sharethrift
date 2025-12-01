import type { FC } from "react";
import { AccountSetup } from "./account-setup.tsx";
import {
  AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
  AccountSetUpContainerPersonalUserUpdateDocument,
  type PersonalUserUpdateInput,
} from "../../../../generated.tsx";
import { useQuery, useMutation } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export const AccountSetUpContainer: FC = () => {
  const { data, loading: userLoading, error } = useQuery(AccountSetUpContainerCurrentPersonalUserAndCreateIfNotExistsDocument);
  const [updateUser, { loading: updateUserLoading }] = useMutation(AccountSetUpContainerPersonalUserUpdateDocument);
  const navigate = useNavigate();

  const handleSaveAndContinue = async (values: PersonalUserUpdateInput) => {
    try {
      const result = await updateUser({ variables: { input: values } });
      if (result.data?.personalUserUpdate.status.success) {
        message.success("Account updated successfully");
        navigate("/signup/profile-setup");
      } else {
        message.error(`Failed to update user: ${result.data?.personalUserUpdate.status.errorMessage}`);
      }
    } catch {
      message.error("Failed to save account setup");
    }
  };
  return (
    <ComponentQueryLoader
      loading={userLoading}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      error={error}
      hasDataComponent={
        <AccountSetup
          loading={updateUserLoading}
          currentPersonalUserData={data?.currentPersonalUserAndCreateIfNotExists}
          onSaveAndContinue={handleSaveAndContinue}
        />
      }
    />
  );
};
