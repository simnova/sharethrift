
import { Navigate } from 'react-router-dom'

const RequireAuth:any = (params:any) => {
   if(typeof params.isAuthenticated === 'undefined'){
      //still loading
      return <div>Checking auth...</div>
  }
  return (params.isAuthenticated === true ?  (params.children): (<Navigate to='/' />) );
}
export default RequireAuth;