import { TokenIssuer, VerifiedTokenService } from "./verified-token-service";

 export class PortalTokenValidation {
  private tokenVerifier: VerifiedTokenService;
  private Portal: Map<string,string>;
  private tokenSettings: Map<string,TokenIssuer>;
  
  constructor(portal: Map<string, string>, refreshInterval: number) {
    this.Portal = portal;

    for(let portalItem in this.Portal){
      this.tokenSettings.set(
        this.Portal[portalItem],
        {
          issuerUrl: process.env[this.Portal[portalItem] + '_OIDC_ENDPOINT'],
          audience: process.env[this.Portal[portalItem] + '_OIDC_AUDIENCE'],
        } as TokenIssuer
      );
    }

    this.tokenVerifier = new VerifiedTokenService(this.tokenSettings,refreshInterval);
  }
  public Start(){
    this.tokenVerifier.Start();
  }
  public GetVerifiedUser (bearerToken:string): {user:any,portal:string}|null {
    
    for(let portalItem of this.tokenSettings.keys()){
      let user = this.tokenVerifier.GetVerifiedJwt(bearerToken,portalItem);
      if(user){
        return {
          user:user,
          portal:this.Portal[portalItem]
        }
      }
    };
    return null;
  }
}