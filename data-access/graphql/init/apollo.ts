import { ApolloServer, CreateHandlerOptions } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from '@azure/functions';
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
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from '../resolvers/index';
import { GraphQLSchemaWithFragmentReplacements } from 'graphql-middleware/dist/types';

import {
  GraphQLRequestContext,
} from 'apollo-server-plugin-base'

export class ApolloServerRequestHandler {
    
  private readonly serverConfig = (portalTokenExtractor:PortalTokenValidation,securedSchema:GraphQLSchemaWithFragmentReplacements) => {
    return {
      schema:securedSchema,
      dataSources: () => ({
        ...DataSources
      }),
      context: async (req:any) => {
        let bearerToken = util.ExtractBearerToken(req.request);
        let context:Partial<ApolloContext> ={};
        
        if(bearerToken){
          let verifiedUser = await portalTokenExtractor.GetVerifiedUser(bearerToken);
          console.log('Decorating context with verifed user:',JSON.stringify(verifiedUser));
          if(verifiedUser){
            context.VerifiedUser = verifiedUser
            console.log('context value is now:', JSON.stringify(context));
          }
        }
        return context;
      },
    //  playground: { endpoint: '/api/graphql/playground' },
      plugins:[
        {
          async didEncounterErrors (requestContext: GraphQLRequestContext) {
            console.error('Apollo Server encounterd error:', requestContext.errors);
          },
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

  public handleRequests(context: Context, req: HttpRequest){
    req.headers['x-ms-privatelink-id'] = ''; // https://github.com/Azure/azure-functions-host/issues/6013
    req.headers['server'] = null; //hide microsoft server header
    return this.graphqlHandlerObj(context, req)
  }
  
  private readonly graphqlHandlerObj:any;

  constructor(portals:Map<string,string>){
    console.log(' -=-=-=-=-=-=-=-=-= INITALIZING APOLLO -=-=-=-=-=-=-=-=-=')
    const scuredSchema:GraphQLSchemaWithFragmentReplacements = applyMiddleware(combinedSchema,permissions);
    const portalTokenExtractor:PortalTokenValidation = new PortalTokenValidation(portals);

    const server = new ApolloServer({
      ...this.serverConfig(portalTokenExtractor,scuredSchema)
    });

    this.graphqlHandlerObj = server.createHandler({
      cors: {
        origin: true,
        credentials: true,
      },

      // health check enpoint is: https://<function-name>.azurewebsites.net/api/graphql/.well-known/apollo/server-health
      onHealthCheck: async (): Promise<any> => {
        // doesn't work yet 
        // https://github.com/apollographql/apollo-server/pull/5270
        // https://github.com/apollographql/apollo-server/pull/5003
        let mongoConnected = mongoose.connection.readyState === 1;
        if(mongoConnected) {
          return;
        } else {
          throw new Error('MongoDB is not connected');
        }
      },
    } as CreateHandlerOptions)
  }

}