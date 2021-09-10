import { ApolloServer } from 'apollo-server-azure-functions';
import { HttpRequest, Context } from "@azure/functions";
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { CosmosDB } from '../data-sources/cosmos-db';
import { resolvers } from '../resolvers';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';


const schema = loadSchemaSync('./graphql.schema.json', {
  loaders: [new JsonFileLoader()],
});

const serverConfig = () => {
  return {
    schema: addResolversToSchema(schema,resolvers),
    dataSources: () => ({
      ...CosmosDB,
    }),
    playground: { endpoint: "/api/graphql" }
  }
}

const server = new ApolloServer({
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