import pem from 'pem';
import fs from 'fs';
import path from 'path';

export default class TokenSigningCertificateManager {
  public certificate: any;
  callBack: any;

  constructor(callBack: any) {
    this.callBack = callBack; 
  }
  
  GetSigningCredentials = async () => {
    const pfx = fs.readFileSync(path.resolve(__dirname, './certs/localhost-magic-link-cert.pfx'));

    var result = await pem.readPkcs12(pfx, { p12Password: process.env.B2C_MAGIC_LINK_CERT_PASSWORD }, (err, cert) => {
      console.log('RESULT-CERRT', cert);
      this.certificate = cert;
      this.callBack(err, cert);
      return cert;
    });

    console.log('RESULT', result);
    console.log('CERT', this.certificate);

    return this.certificate;
  }
}