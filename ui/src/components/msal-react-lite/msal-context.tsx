import { createContext } from 'react';
import * as msal from "@azure/msal-browser";

export interface MsalContextInterface {
  getAuthToken:  (identifier:string|undefined) => Promise<string|undefined>, 
  getAuthResult: (identifier:string|undefined) => Promise<msal.AuthenticationResult|undefined>,
  getSilentAuthResult: (identifier:string|undefined) => Promise<msal.AuthenticationResult|undefined>,
  getIsLoggedIn: (identifier:string|undefined) => boolean,
  logout:        (identifier:string|undefined) => Promise<void>;
  login:         (identifier:string|undefined,params?:Map<string,string>) => Promise<msal.AuthenticationResult|undefined>;
  registerCallback: (identifier:string|undefined,callback:(isLoggedIn:boolean) => void) => void;
} 

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <MsalProvider>.');
};

const initialContext = {
  getAuthToken:   stub,
  getAuthResult:  stub,
  getSilentAuthResult:  stub,
  getIsLoggedIn:  stub,
  logout:         stub,
  login:          stub,
  registerCallback: stub,
};
  
const MsalContext = createContext<MsalContextInterface>(initialContext);
  
export default MsalContext;