import { OpenIdConfig, VerifiedTokenService } from "./verified-token-service";

 export class PortalTokenValidation {
  private tokenVerifier: VerifiedTokenService;
  
  private tokenSettings: Map<string,OpenIdConfig>;
  
  /**
   * @param refreshInterval The number of seconds to wait between refreshing the keystore, defaults to 5 minutes
   * @param openIdConfigs A map of key and enviornment variable prefix, when a JWT is verified, the matching key is returned with the verified JWT
   * 
   * Expects to have 2 environment variables set:
   * - [prefix]_OIDC_ENDPOINT
   * - [prefix]_OIDC_AUDIENCE  
   **/
  constructor(portal: Map<string, string>, refreshInterval: number  = 1000*60*5) {
    this.tokenSettings = new Map<string,OpenIdConfig>();
    
    for(let [portalKey, envPrefix] of portal){
      this.tokenSettings.set(
        portalKey,
        {
          oidcEndpoint: this.tryGetConfigValue(envPrefix + '_OIDC_ENDPOINT'),    
          audience: this.tryGetConfigValue(envPrefix + '_OIDC_AUDIENCE'),
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

  public GetVerifiedUser (bearerToken:string): {VerifiedJWT:any,OpenIdConfigKey:string}|null {
    for(let [openIdConfigKey] of this.tokenSettings){
      let verifedJWT = this.tokenVerifier.GetVerifiedJwt(bearerToken,openIdConfigKey);
      if(verifedJWT){
        return {
          VerifiedJWT:verifedJWT,
          OpenIdConfigKey:openIdConfigKey
        }
      }
    }
    return null;
  }

}