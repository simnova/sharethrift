import { ApolloServer } from 'apollo-server-azure-functions';
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

const schema = loadSchemaSync('./graphql.schema.json', {
  loaders: [new JsonFileLoader()],
});

const appSchema = addResolversToSchema(schema,resolvers)

const scalarSchema = makeExecutableSchema({
  typeDefs:[
    ...Scalars.typeDefs,
  ],
  resolvers:{
    ...Scalars.resolvers,
  }
});

export const combinedSchema = stitchSchemas({
  subschemas: [
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
        async serverWillStart() {
          console.log('Server starting up!');
          connect();
        },
      }
    ]
  }
}

export const server = new ApolloServer({
  ...serverConfig()
});

const graphqlHandler = (context: Context, req: HttpRequest) => {
  const graphqlHandlerObj = server.createHandler({
    cors: {
      origin: "*",
      credentials: true,
    },
  })
  
  // https://github.com/Azure/azure-functions-host/issues/6013
  req.headers["x-ms-privatelink-id"] = ""
  // apollo-server only reads this specific string
  req.headers["Access-Control-Request-Headers"] =
    req.headers["Access-Control-Request-Headers"] ||
    req.headers["access-control-request-headers"]

    req.headers['server'] = null;
    req.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, HEAD, DELETE, PATCH';
  
    return graphqlHandlerObj(context, req)
}

export default {
  graphqlHandler,
};