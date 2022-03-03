import RequireAuth from './require-auth';
import React, { useEffect, useState } from "react";
import { useMsal } from './msal-react-lite';

const RequireMsal:React.FC<any> = (params:any) => {
  const { getIsLoggedIn, registerCallback } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getIsLoggedIn(params.identifier));

  useEffect(() => {
    registerCallback(params.identifier, setIsAuthenticated)
  }, [params.identifier,registerCallback]);
  
  return(
    <RequireAuth isAuthenticated={isAuthenticated}>{params.children}</RequireAuth>
  )
}
export default RequireMsal;