import { JWT, JWKS } from "jose";
import { Issuer } from "openid-client";

export type TokenIssuer = {
  issuerUrl:string;
  audience: any;
  /**
   * The number of seconds to allow the current time to be off from the token's, 
   * (defalts to 5 minutes if not specified)
   */
  clockTolerance?: string;

  ignoreNbf?: boolean;
}

export class VerifiedTokenService  {
  tokenIssuers: Map<string,TokenIssuer>;
  refreshInterval:number;
  keyStoreCollection:  Map<string,JWKS.KeyStore>;
  timerInstance:NodeJS.Timer;

  constructor(tokenIssuers:Map<string,TokenIssuer>, refreshInterval:number) {
    this.tokenIssuers = tokenIssuers;
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
   * For each issuer, either create a new keystore or refresh the existing one.
   * Keys in the keystore expire over time, so it is important to refresh the keystore periodically
   */
  async refreshCollection() {
    for(let tokenIssuer of  [...this.tokenIssuers.keys()]) {
      if(!this.keyStoreCollection.has(tokenIssuer) || !this.keyStoreCollection.get(tokenIssuer)) {
        let newKeyStore = await this.getKeyStore(this.tokenIssuers.get(tokenIssuer).issuerUrl);
        if(newKeyStore) {
          if(this.keyStoreCollection.has(tokenIssuer)) {
            this.keyStoreCollection.delete(tokenIssuer); // remove old keystore if it exists
          };
          this.keyStoreCollection.set(tokenIssuer, newKeyStore); //Update keystore with new one or add it if it doesn't exist
        }
      } 
    }
  }

  async getKeyStore(issuerUrl:string) : Promise<JWKS.KeyStore> {
    let issuer = await Issuer.discover(issuerUrl);
    return await issuer.keystore(true);
  }

  public GetVerifiedJwt(bearerToken:string, issuerKey:string) : any {
    if(!this.timerInstance) {
      throw new Error("ContextUserFromMsal not started");
    }
    if(!this.keyStoreCollection.has(issuerKey)) {
      throw new Error("Invalid issuer key");
    }
    let issuer = this.tokenIssuers.get(issuerKey);
    return JWT.verify(
      bearerToken,
      this.keyStoreCollection.get(issuerKey), 
      {
        audience: issuer.audience,
        issuer: issuer.issuerUrl,
        ignoreNbf: issuer.ignoreNbf??true,
        clockTolerance: issuer.clockTolerance?? "5 minutes",
      });
  }

}