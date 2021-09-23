import { ApolloServer, gql } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from "@azure/functions";
import { CosmosDB } from '../data-sources/cosmos-db';
import connect from '../../shared/data-sources/cosmos-db/connect';
import { GraphQLServiceContext } from 'apollo-server-types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import mongoose from 'mongoose';
import { PortalTokenValidation } from './extensions/portal-token-validation';
import { combinedSchema } from './extensions/schema-builder';


let Portals = new Map<string,string>([
  ["PublicPortal","PUBLIC_PORTAL"],
  ["AdminPortal","ADMIN_PORTAL"],
]);

var portalTokenExtractor = new PortalTokenValidation(Portals,5000)
  

const serverConfig = () => {
  return {
    schema:combinedSchema,
    dataSources: () => ({
      ...CosmosDB,
    }),
    context: (req:HttpRequest) => {
      /*
      let bearerToken = utils.ExtractBearerToken(req);
      if(bearerToken){
        return {
          ...portalTokenExtractor.GetVerifiedUser(bearerToken),
        }
      }
      */
      
      
    },
    playground: { endpoint: "/api/graphql" },
    healthCheckPath: "/api/graphql/healthcheck",
    async onHealthCheck() {
      // doesn't work yet 
      // https://github.com/apollographql/apollo-server/pull/5270
      var mongoConnected = mongoose.connection.readyState === 1;
      if(mongoConnected) {
        return;
      } else {
        throw new Error("MongoDB is not connected");
      }
    },
    plugins:[
      {
        async serverWillStart(service: GraphQLServiceContext) {
          console.log('Apollo Server Starting');
          connect();
         // portalTokenExtractor.Start();
        },
      },
      responseCachePlugin()
    ]
  }
}

export const server = new ApolloServer({
  ...serverConfig()
});

const graphqlHandler = (context: Context, req: HttpRequest) => {
  const graphqlHandlerObj = server.createHandler({
    cors: {
      origin: true,
      credentials: true,
    },
  })
  
  // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers["x-ms-privatelink-id"] = ""
  // apollo-server only reads this specific string

  /*
  req.headers["Access-Control-Request-Headers"] =
    req.headers["Access-Control-Request-Headers"] ||
    req.headers["access-control-request-headers"]
  */
    req.headers['server'] = null;
  //  req.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, HEAD, DELETE, PATCH';
  
    return graphqlHandlerObj(context, req)
}

export default {
  graphqlHandler,
};