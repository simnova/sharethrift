import React, { FC, ReactNode, useEffect } from 'react';
import MsalContext from './msal-context';
import * as msal from '@azure/msal-browser';
import { MsalApp } from './msal-app';

export enum ConfigType {
  Popup = "popup",
  Redirect = "redirect",
  Map = "map"
}

export interface MsalMinimalSilentRequestConfig {
  scopes: Array<string>;
  claims?: string;
  autority?: string;
  forceRquest?: boolean;
  redirectUri?: string;
}

export interface MsalProviderPopupConfig {
  type: ConfigType.Popup;
  msalConfig: msal.Configuration;
  silentRequestConfig: msal.SilentRequest;
  endSessionRequestConfig?: msal.EndSessionRequest;
  loginRequestConfig?: msal.PopupRequest;
}

export interface MsalProviderRedirectConfig {
  type: ConfigType.Redirect;
  msalConfig: msal.Configuration;
  silentRequestConfig: msal.SilentRequest;
  endSessionRequestConfig?: msal.EndSessionRequest;
  redirectRequestConfig?: msal.RedirectRequest;
}

export interface MsalProviderConfigMap {
  type: ConfigType.Map;
  config: Map<string, (MsalProviderPopupConfig | MsalProviderRedirectConfig)>;
}

export type MsalProps = {
  config: MsalProviderPopupConfig | MsalProviderRedirectConfig | MsalProviderConfigMap;
  children: ReactNode;
};

const MsalProvider: FC<MsalProps> =  (props: MsalProps): JSX.Element => {

  let createApp = (identifer:string,config:MsalProviderPopupConfig | MsalProviderRedirectConfig): [string, MsalApp] => {
    return [
      identifer,
      new MsalApp(
        new msal.PublicClientApplication(
          config.msalConfig
        ), 
        config)
      ];
  }
  
  let getMsalInstances = () => {
    if(props.config.type !== ConfigType.Map)
    {
      return new Map([ createApp("default",props.config) ])
    } else {
      var values: Array<[string,MsalApp]> = [] ;
      (props.config).config.forEach(
        (config,identifer) => {
          values.push([
            identifer,
            new MsalApp(
              new msal.PublicClientApplication(
                config.msalConfig
              ), 
              config
            )
          ])
        }
      );
      return new Map<string,MsalApp>(values);
    }
  }

  const msalInstances : Map<string,MsalApp>  = getMsalInstances();

  useEffect(() => {
    msalInstances.forEach((msalApp,key) => {
      msalApp.MsalInstance.handleRedirectPromise().then(async (authResult) => {
        console.log('handle-redirect');
        await msalApp.handleRedirectResult(authResult);
      });
    })
  }, [msalInstances]); // eslint-disable-line react-hooks/exhaustive-deps

  let findInstance =  (identifer:string | undefined) => {
    if(props.config.type !== ConfigType.Map && msalInstances.has("default")){
      return msalInstances.get("default")
    }else if(typeof identifer !== "undefined" && msalInstances.has(identifer)){
      return msalInstances.get(identifer);
    }else {
      throw new Error("need to supply identifier")
    }
  }
  
  return  (
    <MsalContext.Provider
      value={{
        getAuthToken:  (identifier:string|undefined) =>  findInstance(identifier)?.getAuthToken() ?? new Promise<undefined>(() => {return undefined}),
        getAuthResult: (identifier:string|undefined) => findInstance(identifier)?.getAuthResult() ?? new Promise<undefined>(() => {return undefined}),
        getIsLoggedIn: (identifier:string|undefined) => findInstance(identifier)?.IsLoggedIn ?? false,
        logout: (identifier:string|undefined) => findInstance(identifier)?.logout() ?? new Promise<void>(() => {return}),
        login:  (identifier:string|undefined) => findInstance(identifier)?.login() ?? new Promise<undefined>(() => {return undefined}),
      }}
    >
      {props.children}
    </MsalContext.Provider>
  );
};

export default MsalProvider;