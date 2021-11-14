import { ApolloServerRequestHandler } from './init/apollo';
import { HttpRequest, Context } from "@azure/functions";


export default (context: Context, req: HttpRequest) => {

  let apolloServerRequestHandler = new ApolloServerRequestHandler(
    new Map<string,string>([
      ["AccountPortal","ACCOUNT_PORTAL"]
    ])
  );
  
  return apolloServerRequestHandler.handleRequests(context, req);
  
}