import type { FC } from "react";
import { PaymentForm } from "../../../shared/payment/payment-form.tsx";
import {
  PaymentContainerPersonalUserCybersourcePublicKeyIdDocument,
  type ProcessPaymentInput,
  SignUpPaymentContainerPersonalUserProcessPaymentDocument,
} from "../../../../generated.tsx";
import { useQuery, useMutation } from "@apollo/client/react";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { countriesMockData } from "./countries-mock-data.ts";
import { message } from "antd";

export const PaymentContainer: FC = () => {
  const { data, loading, error } = useQuery(PaymentContainerPersonalUserCybersourcePublicKeyIdDocument);
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
  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data}
      hasDataComponent={
        <PaymentForm
          cyberSourcePublicKey={data?.personalUserCybersourcePublicKeyId ?? ""}
          countries={countriesMockData}
          onSubmitPayment={handleSubmitPayment}
        />
      }
    />
  );
};
