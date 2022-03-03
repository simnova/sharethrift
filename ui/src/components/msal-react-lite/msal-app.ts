import {  MsalProviderPopupConfig, MsalProviderRedirectConfig } from '.';
import * as msal from '@azure/msal-browser';
import { ConfigType } from './msal-provider';
import { StringDict } from '@azure/msal-common';


export class MsalApp {

  private msalInstance : msal.PublicClientApplication;
  private config : MsalProviderPopupConfig | MsalProviderRedirectConfig;
  private usePopup : boolean;
  private homeAccountId : string |undefined;
  private isLoggedIn : boolean = false;
  private setLoginState: (isLoggedIn: boolean) => void = () => {};

  
  public registerCallback = (callback:(isLoggedIn: boolean)=>void) => {
    this.setLoginState = callback;
  }




  get IsLoggedIn() : boolean{
    this.isLoggedIn = this.msalInstance.getAllAccounts().length > 0 ;
    console.log("getting logged in value:",this.isLoggedIn);
    return this.isLoggedIn;
  }
  get MsalInstance() : msal.PublicClientApplication{
    return this.msalInstance;
  }
  
  constructor(msalInstance : msal.PublicClientApplication, config : MsalProviderPopupConfig | MsalProviderRedirectConfig){
    this.msalInstance = msalInstance;
    this.config = config;
    this.usePopup = config.type === ConfigType.Popup;
  }
  
  public async login(params?:Map<string,string>) {
    var queryParams:StringDict = {};
   
    if(params){
      params.forEach((value,key)=>{
        queryParams[key] = value;
      });
    }

    if (this.usePopup) {
      var popupConfig = this.config as MsalProviderPopupConfig;
      popupConfig.loginRequestConfig!.extraQueryParameters = queryParams;
      return this.loginPopup(popupConfig.loginRequestConfig);
    } else {
      var redirectConfig = this.config as MsalProviderRedirectConfig;
      redirectConfig.redirectRequestConfig!.extraQueryParameters = queryParams;
      await this.loginRedirect(redirectConfig?.redirectRequestConfig);
      return undefined;
    }
  }

  private async loginPopup(
    loginRequestConfig?: msal.PopupRequest
  )  : Promise<msal.AuthenticationResult | undefined> {
    try {
      const loginResponse = await this.msalInstance.loginPopup(loginRequestConfig);
      this.homeAccountId = loginResponse.account?.homeAccountId;
      return await this.getAuthResult();
    } catch (err) {
      console.error("Login error", err);
      this.isLoggedIn = false;
      this.setLoginState(false);
      return undefined;
    }
  }

  public async loginRedirect (
    redirectRequestConfig?: msal.RedirectRequest | undefined
  )  {
    try {
      await this.msalInstance.loginRedirect(redirectRequestConfig);
    } catch (err) {
      console.error("login redirect error",err);
      // handle error
    }
  }

  public async handleRedirectResult (
    authResult: msal.AuthenticationResult | null
  )  {
    if (!authResult && authResult !== null) {
      //may be called from loginTokenPopup or on a page load
      authResult = (await this.getAuthResult()) ?? null;
    }
    if (
        (
          authResult !== null &&
          authResult.account !== null &&
          authResult.account?.homeAccountId !== this.homeAccountId
        )
      ){
      this.homeAccountId = authResult.account?.homeAccountId;
      this.getAuthResult(authResult.account?.homeAccountId);
    } 
  }

  private getAccount (
    providedHomeAccountId?: string
  ): msal.AccountInfo | undefined  {
    let usedHomeAccountId = providedHomeAccountId ?? this.homeAccountId;
    if (!usedHomeAccountId) return this.msalInstance.getAllAccounts()[0];
    return this.msalInstance.getAccountByHomeId(usedHomeAccountId) ?? undefined;
  }

  private getFullSilentRequestConfig  (
    silentRequestConfig: msal.SilentRequest,
    providedHomeAccountId?: string
  ): msal.SilentRequest | undefined  {
    let account = this.getAccount(providedHomeAccountId) ?? ({} as msal.AccountInfo);
    if (typeof account === "undefined") return undefined;
    return {
      account,
      ...silentRequestConfig,
    } as msal.SilentRequest;
  }

  public async getAuthToken  (
    providedHomeAccountId?: string
  ): Promise<string | undefined> {
    return (await this.getAuthResult(providedHomeAccountId))?.accessToken;
  }

  private getAuthResults(
    providedHomeAccountId?: string,
    isSilent:boolean=false
  ): Promise<msal.AuthenticationResult | undefined>  {

    var fullSilentRequestConfig = this.getFullSilentRequestConfig(
      this.config.silentRequestConfig,
      providedHomeAccountId
    );

    if (!fullSilentRequestConfig) {
      this.isLoggedIn = false;
      return Promise.resolve(undefined);
    }

    if (this.usePopup) {
      var popupConfig = this.config as MsalProviderPopupConfig;
      return this.authTokenPopup(
        fullSilentRequestConfig,
        popupConfig.loginRequestConfig,
        true
      );
    } else {
      var redirectConfig = this.config as MsalProviderRedirectConfig;
      return this.authTokenRedirect(
        fullSilentRequestConfig,
        redirectConfig?.redirectRequestConfig,
        true
      );
    }
  }

  public async getAuthResult  (
    providedHomeAccountId?: string
  ): Promise<msal.AuthenticationResult | undefined>  {
    return this.getAuthResults(providedHomeAccountId);
  }

  public async getSilentAuthResult  (
    providedHomeAccountId?: string
  ): Promise<msal.AuthenticationResult | undefined>  {
    return this.getAuthResults(providedHomeAccountId, true);
  }

  private async authTokenPopup  (
    silentRequest: msal.SilentRequest,
    loginRequestConfig?: msal.PopupRequest | undefined,
    isSilent:boolean=false
  ): Promise<msal.AuthenticationResult | undefined>  {
    var authResult: msal.AuthenticationResult;
    try {
      authResult = await this.msalInstance.acquireTokenSilent(silentRequest);
      console.log('logged in1');
      this.isLoggedIn = true;
      this.setLoginState(true);
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError && !isSilent) {
        console.log('logged in2');
        authResult = await this.msalInstance.acquireTokenPopup(silentRequest);
        this.isLoggedIn = true;
        this.setLoginState(true)
        return authResult;
      }
      return undefined;
    }
  }

  private async authTokenRedirect (
    silentRequest: msal.SilentRequest,
    redirectRequestConfig?: msal.RedirectRequest | undefined,
    isSilent:boolean=false
  ): Promise<msal.AuthenticationResult | undefined>  {
    try {
      var authResult = await this.msalInstance.acquireTokenSilent(silentRequest);
      console.log('logged in1a');
      this.homeAccountId = authResult.account?.homeAccountId;
      this.isLoggedIn = true;
      this.setLoginState(true);
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError && !isSilent) {
        console.log('logged in2a');
        this.isLoggedIn = false;
        this.setLoginState(false);
        await this.msalInstance.acquireTokenRedirect(silentRequest);
      }
      return undefined;
    }
  }

  public async logout()  {
    if (!this.config.endSessionRequestConfig) {
      this.config.endSessionRequestConfig = {};
    }
    this.config.endSessionRequestConfig.account = this.getAccount();
    if (this.usePopup) {
      await this.msalInstance.logoutPopup(this.config.endSessionRequestConfig)
    }else{
      await this.msalInstance.logoutRedirect(this.config.endSessionRequestConfig)
    }
    this.setLoginState(false);
    this.isLoggedIn = false;
  }

}