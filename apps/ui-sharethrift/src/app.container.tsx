import type { FC } from "react";
import { useQuery } from "@apollo/client/react";
import { AppContainerCurrentUserDocument } from "./generated.tsx";
import { App } from "./app.tsx";
import { ComponentQueryLoader, UserIdProvider } from "@sthrift/ui-components";
import { useAuth } from "react-oidc-context";

export const AppContainer: FC = () => {
  const auth = useAuth();

  const { data, loading, error } = useQuery(AppContainerCurrentUserDocument, {
    skip: !auth.isAuthenticated,
  });

  if (!auth.isAuthenticated) {
    return <App hasCompletedOnboarding={false} isAuthenticated={false} />;
  }

  const user = data?.currentUserAndCreateIfNotExists;
  const userId = user?.__typename === 'PersonalUser' ? user.id : undefined;
  const hasCompletedOnboarding =
    (user?.__typename === 'PersonalUser' && user.hasCompletedOnboarding) ?? false;

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={user}
      error={error}
      hasDataComponent={
        <UserIdProvider userId={userId}>
          <App
            hasCompletedOnboarding={hasCompletedOnboarding}
            isAuthenticated={auth.isAuthenticated}
          />
        </UserIdProvider>
      }
    />
  );
};
