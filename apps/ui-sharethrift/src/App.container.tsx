import type { FC } from "react";
import { useQuery } from "@apollo/client";
import { AppCurrentPersonalUserAndCreateIfNotExistsDocument } from "./generated.tsx";
import { App } from "./App.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";

export const AppContainer: FC = () => {
  const { data, loading, error } = useQuery(AppCurrentPersonalUserAndCreateIfNotExistsDocument);

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      error={error}
      hasDataComponent={<App hasCompletedOnboarding={data?.currentPersonalUserAndCreateIfNotExists?.hasCompletedOnboarding === true} />}
    />
  );
};
