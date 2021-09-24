import { Redirect } from 'react-router-dom';
import React from 'react';

 const RequireAuth:any = (params:any) => {
    console.log(`params.isAuthenticated :${params.isAuthenticated }`);
    console.log(params);
    if(typeof params.isAuthenticated === 'undefined'){
        //still loading
        return <div>Checking Authentication...</div>
    }
    return (params.isAuthenticated === true ?  (params.children): (<Redirect to='/' />) );
}
export default RequireAuth;