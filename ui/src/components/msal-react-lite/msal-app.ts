import {  MsalProviderPopupConfig, MsalProviderRedirectConfig } from '.';
import * as msal from '@azure/msal-browser';
import { ConfigType } from './msal-provider';

export class MsalApp {

  private msalInstance : msal.PublicClientApplication;
  private config : MsalProviderPopupConfig | MsalProviderRedirectConfig;
  private usePopup : boolean;
  private homeAccountId : string |undefined;
  private isLoggedIn : boolean = false;

  get IsLoggedIn() : boolean{
    console.log("getting logged in value");
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
  
  public async login() {
    if (this.usePopup) {
      var popupConfig = this.config as MsalProviderPopupConfig;
      return this.loginPopup(popupConfig.loginRequestConfig);
    } else {
      var redirectConfig = this.config as MsalProviderRedirectConfig;
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
    if (!authResult) {
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
    if (!usedHomeAccountId) return undefined;
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

  public async getAuthResult  (
    providedHomeAccountId?: string
  ): Promise<msal.AuthenticationResult | undefined>  {

    var fullSilentRequestConfig = this.getFullSilentRequestConfig(
      this.config.silentRequestConfig,
      providedHomeAccountId
    );

    if (!fullSilentRequestConfig) {
      this.isLoggedIn = false;
      return;
    }

    if (this.usePopup) {
      var popupConfig = this.config as MsalProviderPopupConfig;
      return this.authTokenPopup(
        fullSilentRequestConfig,
        popupConfig.loginRequestConfig
      );
    } else {
      var redirectConfig = this.config as MsalProviderRedirectConfig;
      return this.authTokenRedirect(
        fullSilentRequestConfig,
        redirectConfig?.redirectRequestConfig
      );
    }
  }

  private async authTokenPopup  (
    silentRequest: msal.SilentRequest,
    loginRequestConfig?: msal.PopupRequest | undefined
  ): Promise<msal.AuthenticationResult | undefined>  {
    var authResult: msal.AuthenticationResult;
    try {
      authResult = await this.msalInstance.acquireTokenSilent(silentRequest);
      console.log('logged in1');
      this.isLoggedIn = true;
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError) {
        console.log('logged in2');
        authResult = await this.msalInstance.acquireTokenPopup(silentRequest);
        this.isLoggedIn = true;
        return authResult;
      }
      return undefined;
    }
  }

  private async authTokenRedirect (
    silentRequest: msal.SilentRequest,
    redirectRequestConfig?: msal.RedirectRequest | undefined
  ): Promise<msal.AuthenticationResult | undefined>  {
    try {
      var authResult = await this.msalInstance.acquireTokenSilent(silentRequest);
      this.homeAccountId = authResult.account?.homeAccountId;
      this.isLoggedIn = true;
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError) {
        this.isLoggedIn = false;
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
    this.isLoggedIn = false;
  }

}