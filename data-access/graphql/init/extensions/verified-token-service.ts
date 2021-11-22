import { jwtVerify, createRemoteJWKSet,  JWSHeaderParameters, FlattenedJWSInput } from 'jose';
import { GetKeyFunction, JWTVerifyResult, ResolvedKey } from 'jose/dist/types/types';
import { Issuer } from 'openid-client';

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
  keyStoreCollection:  Map<string,{keyStore: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>, issuerUrl: string}>;
  timerInstance:NodeJS.Timer;

  /**
   * @param openIdConfigs A map of key to OpenIdConfig, when a JWT is verified, the matching key is returned with the verified JWT
   * @param refreshInterval The number of seconds to wait between refreshing the keystore, defaults to 5 minutes
   **/
  constructor(openIdConfigs:Map<string,OpenIdConfig>, refreshInterval:number = 1000*60*5) {
    if(!openIdConfigs) {throw new Error('openIdConfigs is required');}
    this.keyStoreCollection = new Map<string,{keyStore: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>, issuerUrl: string}>();
    this.openIdConfigs = openIdConfigs;
    this.refreshInterval = refreshInterval;
  }

  /**
   * 
   * Refresh the keystore collection periodically
   * 
   **/
  public Start() {
    console.log('Starting VerifiedTokenService');
    if(this.timerInstance) {
      return; // already running
    }
    //need to run immediately...
    (async () => {
      await this.refreshCollection();
    })();
    //..as setInterval only runs after the timer runs out
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
      let newKeyStore = {
        keyStore: createRemoteJWKSet(new URL(this.openIdConfigs.get(configKey).oidcEndpoint)),
        issuerUrl:  this.openIdConfigs.get(configKey).issuerUrl
      }
      if(newKeyStore) {
        if(this.keyStoreCollection.has(configKey)) {
          this.keyStoreCollection.delete(configKey); // remove old keystore if it exists
        }
        this.keyStoreCollection.set(configKey, newKeyStore); //Update keystore with new one or add it if it doesn't exist
      }
    }
  }
  


  public async GetVerifiedJwt(bearerToken:string, configKey:string) : Promise<JWTVerifyResult & ResolvedKey> {
    if(!this.timerInstance) {
      throw new Error('ContextUserFromMsal not started');
    }
    if(!this.keyStoreCollection.has(configKey)) {
      throw new Error('Invalid OpenIdConfig Key');
    }
    let openIdConfig = this.openIdConfigs.get(configKey);
    return jwtVerify(
      bearerToken,
      this.keyStoreCollection.get(configKey).keyStore,
     // createRemoteJWKSet(new URL(this.openIdConfigs.get(configKey).oidcEndpoint)), 
      {
        audience: openIdConfig.audience,
        issuer: openIdConfig.issuerUrl,
        //ignoreNbf: openIdConfig.ignoreNbf??true,
        clockTolerance: openIdConfig.clockTolerance?? '5 minutes',
      }
    )
  }

}