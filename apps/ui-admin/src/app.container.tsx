import type { FC } from "react";
import { useQuery } from "@apollo/client/react";
import { AppContainerCurrentUserDocument } from "./generated.tsx";
import { App } from "./app.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";
import { useAuth } from "react-oidc-context";
import { UserIdProvider } from "./components/shared/user-context.tsx";

export const AppContainer: FC = () => {
  const auth = useAuth();

  const { data, loading, error } = useQuery(AppContainerCurrentUserDocument, {
    skip: !auth.isAuthenticated,
  });

  if (!auth.isAuthenticated) {
    return <App isAuthenticated={false} />;
  }

  const user = data?.currentUserAndCreateIfNotExists;
  if (user?.__typename !== 'AdminUser') {
    return <App isAuthenticated={false} />;
  }
  const userId = user.id;

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={user}
      error={error}
      hasDataComponent={
        <UserIdProvider userId={userId}>
          <App isAuthenticated={auth.isAuthenticated} />
        </UserIdProvider>
      }
    />
  );
};
