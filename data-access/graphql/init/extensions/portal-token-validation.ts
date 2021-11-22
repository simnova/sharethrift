import { OpenIdConfig, VerifiedTokenService } from './verified-token-service';

 export class PortalTokenValidation {
  private tokenVerifier: VerifiedTokenService;
  private tokenSettings: Map<string,OpenIdConfig>;
  
  /**
   * @param refreshInterval The number of seconds to wait between refreshing the keystore, defaults to 5 minutes
   * @param openIdConfigs A map of key and enviornment variable prefix, when a JWT is verified, the matching key is returned with the verified JWT
   * 
   * Expects to have 3 environment variables set:
   * - [prefix]_OIDC_ENDPOINT
   * - [prefix]_OIDC_AUDIENCE  
   * - [prefix]_OIDC_ISSUER
   **/
  constructor(portal: Map<string, string>, refreshInterval: number  = 1000*60*5) {
    this.tokenSettings = new Map<string,OpenIdConfig>();
    
    for(let [portalKey, envPrefix] of portal){
      this.tokenSettings.set(
        portalKey,
        {
          oidcEndpoint: this.tryGetConfigValue(envPrefix + '_OIDC_ENDPOINT'),    
          audience: this.tryGetConfigValue(envPrefix + '_OIDC_AUDIENCE'),
          issuerUrl: this.tryGetConfigValue(envPrefix + '_OIDC_ISSUER')
        } as OpenIdConfig
      );
    }
    this.tokenVerifier = new VerifiedTokenService(this.tokenSettings,refreshInterval);
  }

  public tryGetConfigValue(configKey:string){
    if(process.env.hasOwnProperty(configKey)){
      return process.env[configKey];
    }else{
      throw new Error(`Environment variable ${configKey} not set`);
    }
  }

  public Start(){
    this.tokenVerifier.Start();
  }

  public async GetVerifiedUser (bearerToken:string): Promise<{VerifiedJWT:any,OpenIdConfigKey:string}|null>{ 
    for await(let [openIdConfigKey] of this.tokenSettings){
      let verifedJWT = await this.tokenVerifier.GetVerifiedJwt(bearerToken,openIdConfigKey);
      console.log(`for ${openIdConfigKey} with bearerToken: ${bearerToken} verifiedJWT: ${JSON.stringify(verifedJWT)}`)
      if(verifedJWT){
        return {
          VerifiedJWT:verifedJWT.payload,
          OpenIdConfigKey:openIdConfigKey
        }
      }
    }
    return null;
  }

}