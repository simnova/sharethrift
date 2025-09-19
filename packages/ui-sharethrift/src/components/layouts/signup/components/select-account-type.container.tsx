import { useCallback } from "react";
import { SelectAccountType } from "./select-account-type";
import { ComponentQueryLoader } from "@sthrift/ui-sharethrift-components";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
  SignupSelectAccountTypePersonalUserUpdateDocument,
} from "../../../../generated.tsx";

export default function SelectAccountTypeContainer() {
  const navigate = useNavigate();

  const {
    data: currentUserData,
    loading: loadingUser,
    error: userError,
  } = useQuery(
    SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument
  );

  const [
    updateAccountType,
    { loading: savingAccountType, error: updateError },
  ] = useMutation(SignupSelectAccountTypePersonalUserUpdateDocument);

  const handleUpdateAccountType = useCallback(
    async (accountType: string) => {
      if (savingAccountType) {return};
      try {
        const userId =
          currentUserData?.currentPersonalUserAndCreateIfNotExists?.id;
        if (!userId) {return};
        const result = await updateAccountType({
          variables: {
            input: {
              account: { accountType },
              id: userId,
            },
          },
          refetchQueries: [
            {
              query:
                SignupSelectAccountTypeCurrentPersonalUserAndCreateIfNotExistsDocument,
            },
          ],
        });

        if (result.data?.personalUserUpdate) {
          navigate("/signup/account-setup");
        }
      } catch (e) {
        // Error is handled below
        console.log("Error updating account type:", e);
      }
    },
    [currentUserData, updateAccountType, navigate, savingAccountType]
  );

  const errorMessage = userError || updateError

  return (
    <ComponentQueryLoader
      loading={loadingUser || savingAccountType}
      hasData={currentUserData}
      error={errorMessage}
      hasDataComponent={
        <SelectAccountType
          currentUserData={
            currentUserData?.currentPersonalUserAndCreateIfNotExists
          }
          loadingUser={loadingUser}
          handleUpdateAccountType={handleUpdateAccountType}
          savingAccountType={savingAccountType}
        />
      }
    />
  );
}
