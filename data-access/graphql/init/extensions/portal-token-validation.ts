import { OpenIdConfig, VerifiedTokenService } from "./verified-token-service";

 export class PortalTokenValidation {
  private tokenVerifier: VerifiedTokenService;
  private Portal: Map<string,string>;
  private tokenSettings: Map<string,OpenIdConfig>;
  
  /**
   * @param refreshInterval The number of seconds to wait between refreshing the keystore, defaults to 5 minutes
   * @param openIdConfigs A map of key and enviornment variable prefix, when a JWT is verified, the matching key is returned with the verified JWT
   * 
   * Expects to have 3 environment variables set:
   * - [prefix]_OIDC_ENDPOINT
   * - [prefix]_OIDC_ISSUER
   * - [prefix]_OIDC_AUDIENCE  
   **/
  constructor(portal: Map<string, string>, refreshInterval: number) {
    this.tokenSettings = new Map<string,OpenIdConfig>();
    this.Portal = portal;
    for(let portalKey of [...this.Portal.keys()]){
      var envPrefix = this.Portal.get(portalKey)
      this.tokenSettings.set(
        portalKey,
        {
          oidcEndpoint: process.env[envPrefix + '_OIDC_ENDPOINT'],
          issuerUrl: process.env[envPrefix + '_OPENID_ISSUER'],          
          audience: process.env[envPrefix + '_OIDC_AUDIENCE'],
        } as OpenIdConfig
      );
    }
    this.tokenVerifier = new VerifiedTokenService(this.tokenSettings,refreshInterval);
  }

  public Start(){
    this.tokenVerifier.Start();
  }

  public GetVerifiedUser (bearerToken:string): {VerifiedJWT:any,OpenIdConfigKey:string}|null {
    for(let openIdConfigKey of this.tokenSettings.keys()){
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