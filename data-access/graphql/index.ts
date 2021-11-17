import { ApolloServerRequestHandler } from './init/apollo';
import { HttpRequest, Context } from "@azure/functions";


let apolloServerRequestHandler = new ApolloServerRequestHandler(
  new Map<string,string>([
    ["AccountPortal","ACCOUNT_PORTAL"]
  ])
);

export default (context: Context, req: HttpRequest) => {
  return apolloServerRequestHandler.handleRequests(context, req);
}