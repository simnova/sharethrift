import { ApolloServer, gql } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from "@azure/functions";
import { CosmosDB } from '../data-sources/cosmos-db';
import connect from '../../infrastructure/data-sources/cosmos-db/connect';
import { GraphQLServiceContext } from 'apollo-server-types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import mongoose from 'mongoose';
import { PortalTokenValidation } from './extensions/portal-token-validation';
import { combinedSchema } from './extensions/schema-builder';
import * as util  from './extensions/util';
import { Domain } from '../data-sources/domain';
import * as EventHandlers from '../../domain/infrastructure/event-handlers/index'



let Portals = new Map<string,string>([
  ["AccountPortal","ACCOUNT_PORTAL"]
]);

var portalTokenExtractor = new PortalTokenValidation(Portals)
  
const serverConfig = () => {
  return {
    schema:combinedSchema,
    dataSources: () => ({
      ...CosmosDB,
      ...Domain
    }),
    context: (req:any) => {
      let bearerToken = util.ExtractBearerToken(req.request);
     
      if(bearerToken){
        var verifiedUser = portalTokenExtractor.GetVerifiedUser(bearerToken);
        if(verifiedUser){
          return {
            VerifedUser:verifiedUser
          }
        }
      }
    },
    playground: { endpoint: "/api/graphql" },
    healthCheckPath: "/api/graphql/healthcheck",
    async onHealthCheck() {
      // doesn't work yet 
      // https://github.com/apollographql/apollo-server/pull/5270
      // https://github.com/apollographql/apollo-server/pull/5003
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
          portalTokenExtractor.Start();
          EventHandlers.RegisterListingPublishedEmailHandler();
        },
      },
      responseCachePlugin()
    ]
  }
};

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
  
  req.headers["x-ms-privatelink-id"] = "" // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers['server'] = null;
  return graphqlHandlerObj(context, req)
}

export default {
  graphqlHandler,
};