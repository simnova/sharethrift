import {ApolloServerRequestHandler} from './init/apollo';
import { HttpRequest, Context } from "@azure/functions";


function enableConsoleLogging (context: Context) {
  if (context) { 
      console.log = context.log;
      console.error = context.log.error;
      console.warn = context.log.warn;
      console.info = context.log.info;

    //  console.log('Logging enabled');
    //const originalLogger = console.log;
    //console.log = function () {
    //  context.log.info(...arguments);
    //  originalLogger(...arguments);
   // };
  }
}


var apolloServerRequestHandler = new ApolloServerRequestHandler(
  new Map<string,string>([
    ["AccountPortal","ACCOUNT_PORTAL"]
  ])
);
export default (context: Context, req: HttpRequest) => {
 // enableConsoleLogging(context);
 return apolloServerRequestHandler.handleRequests(context, req);
}