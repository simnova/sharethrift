import type { FC } from "react";
import { useQuery } from "@apollo/client";
import { AppCurrentPersonalUserAndCreateIfNotExistsDocument } from "./generated.tsx";
import { App } from "./App.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useAuth } from "react-oidc-context";

export const AppContainer: FC = () => {
  const auth = useAuth();
  const { data, loading, error } = useQuery(AppCurrentPersonalUserAndCreateIfNotExistsDocument, { skip: auth.isAuthenticated === false });

  if (auth.isAuthenticated === false) {
    return <App hasCompletedOnboarding={false} isAuthenticated={auth.isAuthenticated} />;
  }

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={data?.currentPersonalUserAndCreateIfNotExists}
      error={error}
      hasDataComponent={
        <App
          hasCompletedOnboarding={data?.currentPersonalUserAndCreateIfNotExists?.hasCompletedOnboarding === true}
          isAuthenticated={auth.isAuthenticated}
        />
      }
    />
  );
};
