import { useEffect, type JSX } from "react";
import { hasAuthParams, useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
  redirectPath: string;
  forceLogin?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = (props) => {
  const auth = useAuth();

  // automatically sign-in
  useEffect(() => {
    if (!hasAuthParams() && props.forceLogin === true && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && !auth.error) {
      window.sessionStorage.setItem("redirectTo", `${location.pathname}${location.search}`);

      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect, auth.error, props.forceLogin, auth]);

  // automatically refresh token
  useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      auth.signinSilent({
        redirect_uri: import.meta.env["VITE_B2C_REDIRECT_URI"] ?? "",
      });
    });

    // *** Suggestion from sourcery that needs investigation
    // const handleAccessTokenExpiring = () => {
    //   auth.signinSilent({
    //     redirect_uri: import.meta.env.VITE_B2C_REDIRECT_URI ?? "",
    //   });
    // };
    // auth.events.addAccessTokenExpiring(handleAccessTokenExpiring);
    // return () => {
    //   auth.events.removeAccessTokenExpiring(handleAccessTokenExpiring);
    // };
  }, [auth, auth.events, auth.signinSilent]);

  let result: JSX.Element;
  if (auth.isAuthenticated) {
    result = props.children;
  } else if (auth.error) {
    result = <Navigate to="/" />;
  } else {
    return <div>Checking auth2...</div>;
  }

  return result;
};
