
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

const RequireAuth:any = (params:any) => {
   let navigate = useNavigate();
   useEffect(() => {
      if (typeof params.isAuthenticated !== 'undefined' && !params.isAuthenticated) {
         navigate('/');
      }
    }, [params.isAuthenticated]);
    return <div>Checking Authentication...</div>
}
export default RequireAuth;