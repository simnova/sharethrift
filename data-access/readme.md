

To run app:
"C:\Program Files\Azure Cosmos DB Emulator\Microsoft.Azure.Cosmos.Emulator.exe" /EnableMongoDbEndpoint=4.0



local.settings.json

Each OIDC provider needs ENV variable Prefix and a key:
For example:
"AccountPortal" (as a key)
"ACCOUNT_PORTAL" as a prefix

You'd need to set 3 env variables: 
  "ACCOUNT_PORTAL_OIDC_ENDPOINT" : "https://sharethriftb2cdev.b2clogin.com/sharethriftb2cdev.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1a_signup_signin",
  "ACCOUNT_PORTAL_OIDC_AUDIENCE": "xxx...xxxx",
  "ACCOUNT_PORTAL_OIDC_ISSUER": "https://sharethriftb2cdev.b2clogin.com/b07a0f35-2f3c-4f54-aa90-10af96b3f3d5/v2.0/"

and set the mapping between key and prefxi in :
/graphql/init/apollo.ts

...
let Portals = new Map<string,string>([
  ["AccountPortal","ACCOUNT_PORTAL"]
]);
...