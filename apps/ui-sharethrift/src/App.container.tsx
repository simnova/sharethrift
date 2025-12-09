import type { FC } from "react";
import { useQuery } from "@apollo/client/react";
import { AppContainerCurrentUserDocument } from "./generated.tsx";
import { App } from "./App.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useAuth } from "react-oidc-context";
import { UserIdProvider } from "./components/shared/user-context.tsx";

export const AppContainer: FC = () => {
  const auth = useAuth();

  const { data, loading, error } = useQuery(AppContainerCurrentUserDocument, {
    skip: !auth.isAuthenticated,
  });

  if (!auth.isAuthenticated) {
    return <App hasCompletedOnboarding={false} isAuthenticated={false} />;
  }

  const user = data?.currentUser;
  const userId = user?.id;
  const hasCompletedOnboarding =
    user?.userType === 'personal-user'
      ? (user as { hasCompletedOnboarding?: boolean }).hasCompletedOnboarding ?? false
      : true; // Admins and other types don't need onboarding

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
