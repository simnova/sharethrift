import jwt, { Secret } from "jsonwebtoken";

export default class IdTokenHintBuilder {
  //configuration: any;
  tokenSigningCertificateManager: any;

  constructor(tokenSigningCertificateManager: any) {
    this.tokenSigningCertificateManager = tokenSigningCertificateManager;
  }

  buildIdToken = async (userEmail: any) => {
    const audience = process.env.B2C_MAGIC_LINK_AUDIENCE;
    const expirationInMinutes = +process.env.B2C_MAGIC_LINK_EXPIRATION_IN_MINUTES;
    const issuer = process.env.B2C_MAGIC_LINK_ISSUER;

    console.log('audience', audience);
    console.log('expirationInMinutes', expirationInMinutes);
    console.log('issuer', issuer);

    const cert = await this.tokenSigningCertificateManager.GetSigningCredentials();
    console.log('CERT-Build-this', this.tokenSigningCertificateManager.certificate);
    console.log('CERT-Build', cert);
  }


}
