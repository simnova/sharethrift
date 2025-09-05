import type { FC } from "react";
import { SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsDocument, type PersonalUser } from "../../../generated.tsx";
import { useQuery } from "@apollo/client";
import { SectionLayout } from "./section-layout";
import { ComponentQueryLoader } from "@sthrift/ui-sharethrift-components";
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface SectionLayoutContainerProps {}

export const SectionLayoutContainer: FC<SectionLayoutContainerProps> = (_props) => {
  const { data, loading, error } = useQuery(SignUpSectionLayoutContainerCurrentPersonalUserAndCreateIfNotExistsDocument);

  return (
    <ComponentQueryLoader
      loading={loading}
      error={error}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      hasDataComponent={<SectionLayout personalData={data?.currentPersonalUserAndCreateIfNotExists as PersonalUser} />}
    />
  );
};
