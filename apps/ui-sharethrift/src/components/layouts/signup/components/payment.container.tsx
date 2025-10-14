import type { FC } from "react";
import { PaymentForm } from "../../../shared/payment/index.tsx";
import { PaymentContainerPersonalUserCybersourcePublicKeyIdDocument } from "../../../../generated.tsx";
import { useQuery } from "@apollo/client";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { countriesMockData } from "./countries-mock-data.ts";

export const PaymentContainer: FC = () => {
  const { data, loading, error } = useQuery(PaymentContainerPersonalUserCybersourcePublicKeyIdDocument);

  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data}
      hasDataComponent={<PaymentForm cyberSourcePublicKey={data?.personalUserCybersourcePublicKeyId ?? ""} countries={countriesMockData} />}
    />
  );
};
