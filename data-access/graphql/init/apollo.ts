import { ApolloServer } from "apollo-server-azure-functions";
import { HttpRequest, Context } from "@azure/functions";
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { CosmosDB } from "../data-sources/cosmos-db";

const schema = loadSchemaSync('./graphql/*(schema)**/*.graphql', { 
  loaders: [
      new GraphQLFileLoader()
  ],

});

const serverConfig = () => {
  return {
    schema: schema,
    dataSources: () => (
      CosmosDB &&
      {
      
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