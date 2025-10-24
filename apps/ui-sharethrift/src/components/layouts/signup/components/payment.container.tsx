import { type FC, useMemo } from "react";
import {
  type PaymentContainerAccountPlansFieldsFragment,
  PaymentContainerPersonalUserCybersourcePublicKeyIdDocument,
  type ProcessPaymentInput,
  PaymentContainerAccountPlansDocument,
  PaymentContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
  SignUpPaymentContainerPersonalUserProcessPaymentDocument,
} from "../../../../generated.tsx";
import { useQuery, useMutation } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { countriesMockData } from "./countries-mock-data.ts";
import { message } from "antd";
import { Payment } from "./payment.tsx";

export const PaymentContainer: FC = () => {
  const {
    data: personalUserCybersourcePublicKeyIdData,
    loading: personalUserCybersourcePublicKeyIdLoading,
    error: personalUserCybersourcePublicKeyIdError,
  } = useQuery(PaymentContainerPersonalUserCybersourcePublicKeyIdDocument);

  const {
    data: currentPersonalUserData,
    loading: currentPersonalUserLoading,
    error: currentPersonalUserError,
  } = useQuery(PaymentContainerCurrentPersonalUserAndCreateIfNotExistsDocument);

  const { data: accountPlansData, loading: accountPlansLoading, error: accountPlansError } = useQuery(PaymentContainerAccountPlansDocument);

  const [processPayment] = useMutation(SignUpPaymentContainerPersonalUserProcessPaymentDocument);

  const handleSubmitPayment = async (paymentData: ProcessPaymentInput) => {
    console.log("Payment data submitted:", paymentData);
    const result = await processPayment({ variables: { input: paymentData } });
    if (result.data?.processPayment.success) {
      message.success("Payment processed successfully");
    } else {
      message.error(`Payment failed: ${result.data?.processPayment || "Unknown error"}`);
    }
  };

  const selectedAccountPlan = useMemo(() => {
    const selectedPlanName = currentPersonalUserData?.currentPersonalUserAndCreateIfNotExists.account?.accountType;
    return accountPlansData?.accountPlans?.find((plan) => plan?.name === selectedPlanName) || null;
  }, [currentPersonalUserData, accountPlansData]);

  return (
    <ComponentQueryLoader
      loading={personalUserCybersourcePublicKeyIdLoading || currentPersonalUserLoading || accountPlansLoading}
      error={personalUserCybersourcePublicKeyIdError || currentPersonalUserError || accountPlansError}
      hasData={personalUserCybersourcePublicKeyIdData && currentPersonalUserData && accountPlansData}
      hasDataComponent={
        <Payment
          cyberSourcePublicKey={personalUserCybersourcePublicKeyIdData?.personalUserCybersourcePublicKeyId ?? ""}
          countries={countriesMockData}
          onSubmitPayment={handleSubmitPayment}
          selectedAccountPlan={selectedAccountPlan as PaymentContainerAccountPlansFieldsFragment}
        />
      }
    />
  );
};
