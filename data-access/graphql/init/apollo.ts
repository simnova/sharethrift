import { ApolloServer, gql } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from "@azure/functions";
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema, mergeSchemas } from '@graphql-tools/schema';
import { CosmosDB } from '../data-sources/cosmos-db';
import { resolvers } from '../resolvers';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import * as Scalars from 'graphql-scalars';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchSchemas } from '@graphql-tools/stitch';
import connect from '../../shared/data-sources/cosmos-db/connect';
import { GraphQLServiceContext } from 'apollo-server-types';
import responseCachePlugin from 'apollo-server-plugin-response-cache';


const schema = loadSchemaSync('./graphql.schema.json', {
  loaders: [new JsonFileLoader()],
});

const appSchema = addResolversToSchema(schema,resolvers)

const CacheControl = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
`;

const scalarSchema = makeExecutableSchema({
  typeDefs:[
    ...Scalars.typeDefs,
    CacheControl
  ],
  resolvers:{
    ...Scalars.resolvers,
  }
});
/*
export const combinedSchema = stitchSchemas({
  subschemas: [
    appSchema,
    scalarSchema,
  ]
});
*/

export const combinedSchema = mergeSchemas({
  schemas: [
    appSchema,
    scalarSchema,
  ]
});


const serverConfig = () => {
  return {
    schema:combinedSchema,
    dataSources: () => ({
      ...CosmosDB,
    }),
    playground: { endpoint: "/api/graphql" },
    plugins:[
      {
        async serverWillStart(service: GraphQLServiceContext) {
          console.log('Apollo Server Starting');
          connect();
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