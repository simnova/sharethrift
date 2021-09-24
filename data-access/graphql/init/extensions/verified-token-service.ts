import { JWT, JWKS } from "jose";
import { Issuer } from "openid-client";

export type OpenIdConfig = {
  issuerUrl:string;
  oidcEndpoint:string;
  audience: any;
  /**
   * The number of seconds to allow the current time to be off from the token's, 
   * (defalts to 5 minutes if not specified)
   */
  clockTolerance?: string;

  ignoreNbf?: boolean;
}

export class VerifiedTokenService  {
  openIdConfigs: Map<string,OpenIdConfig>;
  refreshInterval:number;
  keyStoreCollection:  Map<string,JWKS.KeyStore>;
  timerInstance:NodeJS.Timer;

  /**
   * @param refreshInterval The number of seconds to wait between refreshing the keystore, defaults to 5 minutes
   * @param openIdConfigs A map of key to OpenIdConfig, when a JWT is verified, the matching key is returned with the verified JWT
   **/
  constructor(openIdConfigs:Map<string,OpenIdConfig>, refreshInterval:number = 1000*60*5) {
    if(!openIdConfigs) {throw new Error("openIdConfigs is required");}
    this.keyStoreCollection = new Map<string,JWKS.KeyStore>();
    this.openIdConfigs = openIdConfigs;
    this.refreshInterval = refreshInterval;
  }

  /**
   * 
   * Refresh the keystore collection periodically
   * 
   **/
  public Start() {
    if(this.timerInstance) {
      return; // already running
    }
    this.timerInstance = setInterval(() =>  {
      (async () => {
      await this.refreshCollection();
      })();
    }, this.refreshInterval);
  }

  /**
   * For each OIDC Endpoint, either create a new keystore or refresh the existing one.
   * Keys in the keystore expire over time, so it is important to refresh the keystore periodically
   */
  async refreshCollection() {
    if(!this.openIdConfigs){return}
    for(let configKey of  [...this.openIdConfigs.keys()]) {
      if(!this.keyStoreCollection.has(configKey) || !this.keyStoreCollection.get(configKey)) {
        let newKeyStore = await this.getKeyStore(this.openIdConfigs.get(configKey).oidcEndpoint);
        if(newKeyStore) {
          if(this.keyStoreCollection.has(configKey)) {
            this.keyStoreCollection.delete(configKey); // remove old keystore if it exists
          };
          this.keyStoreCollection.set(configKey, newKeyStore); //Update keystore with new one or add it if it doesn't exist
        }
      } 
    }
  }

  async getKeyStore(issuerUrl:string) : Promise<JWKS.KeyStore> {
    let issuer = await Issuer.discover(issuerUrl);
    return issuer.keystore(true);
  }

  public GetVerifiedJwt(bearerToken:string, configKey:string) : any {
    if(!this.timerInstance) {
      throw new Error("ContextUserFromMsal not started");
    }
    if(!this.keyStoreCollection.has(configKey)) {
      throw new Error("Invalid issuer key");
    }
    let openIdConfig = this.openIdConfigs.get(configKey);
    console.log(`Issurer: ${JSON.stringify(openIdConfig)}`);
    return JWT.verify(
      bearerToken,
      this.keyStoreCollection.get(configKey), 
      {
        audience: openIdConfig.audience,
        issuer: openIdConfig.issuerUrl,
        ignoreNbf: openIdConfig.ignoreNbf??true,
        clockTolerance: openIdConfig.clockTolerance?? "5 minutes",
      });
  }

}