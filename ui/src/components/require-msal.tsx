import RequireAuth from './require-auth';
import React, { useEffect, useState, useRef } from "react";
import { useMsal } from './msal-react-lite';

const RequireMsal:any = (params:any) => {
  const { getAuthResult } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  let isRendered = useRef(false); //Used to make Async code not get called on every render.
  useEffect(() => {
    (async () => {
      // IIFE to make async code work in a non-async Functional Component
      if (!isRendered.current) {
        var authResult = await getAuthResult(params.identifier);
        debugger;
        console.log(`authResult:${JSON.stringify(authResult)}`);
        setIsAuthenticated(authResult ? true : false);
      }
    })();

    return () => {
      isRendered.current = true;
    };
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return(
    <RequireAuth isAuthenticated={isAuthenticated}>{params.children}</RequireAuth>
  )
}
export default RequireMsal;