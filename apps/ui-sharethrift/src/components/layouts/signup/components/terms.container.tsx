import { type FC, useCallback } from "react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useQuery, useMutation } from "@apollo/client/react";
import { Terms } from "./terms.tsx";
import { TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument, TermsContainerPersonalUserUpdateDocument } from "../../../../generated.tsx";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export const TermsContainer: FC = () => {
  const { loading: userLoading, data, error: errorMessage } = useQuery(TermsContainerCurrentPersonalUserAndCreateIfNotExistsDocument);
  const [updateUser] = useMutation(TermsContainerPersonalUserUpdateDocument);

  const navigate = useNavigate();

  const handleSaveAndContinue = useCallback(async () => {
    if (data?.currentPersonalUserAndCreateIfNotExists.account?.accountType === "verified-personal-plus") {
      navigate("/signup/payment");
    } else {
      const result = await updateUser({
        variables: {
          input: {
            id: data?.currentPersonalUserAndCreateIfNotExists.id,
            hasCompletedOnboarding: true,
          },
        },
      });
      if (result.data?.personalUserUpdate.status.success) {
        message.success("Welcome to ShareThrift! Your account has been created.");
        navigate("/");
      } else {
        // Handle error case if needed
        message.error("Failed to update user. Please try again.");
      }
    }
  }, [data, navigate, updateUser]);

  return (
    <ComponentQueryLoader
      loading={userLoading}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      error={errorMessage}
      hasDataComponent={<Terms loading={userLoading} onSaveAndContinue={handleSaveAndContinue} />}
    />
  );
};
