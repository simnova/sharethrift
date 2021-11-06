import { ApolloServer, CreateHandlerOptions, gql } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from "@azure/functions";
import { DataSources } from '../data-sources/';
import { connect } from '../../infrastructure/data-sources/cosmos-db/connect';
import { GraphQLServiceContext } from 'apollo-server-types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import mongoose from 'mongoose';
import { PortalTokenValidation } from './extensions/portal-token-validation';
import { combinedSchema } from './extensions/schema-builder';
import * as util  from './extensions/util';
import RegisterHandlers from '../../domain/infrastructure/event-handlers/index'
import { Context as ApolloContext } from '../context';

let Portals = new Map<string,string>([
  ["AccountPortal","ACCOUNT_PORTAL"]
]);

var portalTokenExtractor = new PortalTokenValidation(Portals)
  
const serverConfig = () => {
  return {
    schema:combinedSchema,
    dataSources: () => ({
      ...DataSources
    }),
    context: async (req:any) => {
      let bearerToken = util.ExtractBearerToken(req.request);
      var context:Partial<ApolloContext> ={};
      
      if(bearerToken){
        var verifiedUser = await portalTokenExtractor.GetVerifiedUser(bearerToken);
        console.log('Decorating context with verifed user:',JSON.stringify(verifiedUser));
        if(verifiedUser){
          context.VerifiedUser = verifiedUser
          console.log('context value is now:', JSON.stringify(context));
        }
      }
      return context;
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
          await connect();
          portalTokenExtractor.Start();
      
          RegisterHandlers();
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
  } as CreateHandlerOptions)
  req.headers["x-ms-privatelink-id"] = "" // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers['server'] = null;
  return graphqlHandlerObj(context, req)
}

export default {
  graphqlHandler,
};