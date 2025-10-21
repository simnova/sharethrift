import { useCallback } from "react";
import { SelectAccountType } from "./select-account-type.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
  SelectAccountTypePersonalUserUpdateDocument,
  type PersonalUserUpdateInput,
} from "../../../../generated.tsx";
import { message } from "antd";

export const SelectAccountTypeContainer: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: currentUserData,
    loading: loadingUser,
    error: userError,
  } = useQuery(SelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument);

  const [updateUser, { loading: updateUserLoading, error: updateError }] = useMutation(SelectAccountTypePersonalUserUpdateDocument);

  // TODO: add query to fetch available plans

  const handleSaveAndContinue = useCallback(
    async (values: PersonalUserUpdateInput) => {
      if (updateUserLoading) {
        return;
      }
      try {
        const userId = currentUserData?.currentPersonalUserAndCreateIfNotExists?.id;
        if (!userId) {
          return;
        }
        const result = await updateUser({
          variables: {
            input: values,
          },
        });

        if (result.data?.personalUserUpdate.status.success) {
          message.success("Account type updated successfully");
          navigate("/signup/account-setup");
        } else {
          message.error(`Failed to update account type: ${result.data?.personalUserUpdate.status.errorMessage}`);
        }
      } catch {
        // Error is handled below
        message.error(`Failed to update account type`);
      }
    },
    [currentUserData, updateUser, navigate, updateUserLoading]
  );

  const errorMessage = userError || updateError;

  return (
    <ComponentQueryLoader
      loading={loadingUser}
      hasData={currentUserData}
      error={errorMessage}
      hasDataComponent={
        <SelectAccountType
          currentUserData={currentUserData?.currentPersonalUserAndCreateIfNotExists}
          loading={updateUserLoading}
          onSaveAndContinue={handleSaveAndContinue}
        />
      }
    />
  );
};
