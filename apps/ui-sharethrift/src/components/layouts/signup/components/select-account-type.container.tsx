import { useCallback } from "react";
import { SelectAccountType } from "./select-account-type.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
  SignupSelectAccountTypePersonalUserUpdateDocument,
} from "../../../../generated.tsx";
import { message } from "antd";

export default function SelectAccountTypeContainer() {
  const navigate = useNavigate();

  const {
    data: currentUserData,
    loading: loadingUser,
    error: userError,
  } = useQuery(SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument);

  const [updateAccountType, { loading: savingAccountType, error: updateError }] = useMutation(SignupSelectAccountTypePersonalUserUpdateDocument);

  const handleUpdateAccountType = useCallback(
    async (accountType: string) => {
      if (savingAccountType) {
        return;
      }
      try {
        const userId = currentUserData?.currentPersonalUserAndCreateIfNotExists?.id;
        if (!userId) {
          return;
        }
        const result = await updateAccountType({
          variables: {
            input: {
              account: { accountType },
              id: userId,
            },
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
    [currentUserData, updateAccountType, navigate, savingAccountType]
  );

  const errorMessage = userError || updateError;

  return (
    <ComponentQueryLoader
      loading={loadingUser || savingAccountType}
      hasData={currentUserData}
      error={errorMessage}
      hasDataComponent={
        <SelectAccountType
          currentUserData={currentUserData?.currentPersonalUserAndCreateIfNotExists}
          loadingUser={loadingUser}
          handleUpdateAccountType={handleUpdateAccountType}
          savingAccountType={savingAccountType}
        />
      }
    />
  );
}
