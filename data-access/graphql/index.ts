import Apollo, {server} from './init/apollo';
import { HttpRequest, Context } from "@azure/functions";


function enableConsoleLogging (context: Context) {
  if (context) { 
      console.log = context.log;
      console.error = context.log.error;
      console.warn = context.log.warn;
      console.info = context.log.info;


    //const originalLogger = console.log;
    //console.log = function () {
    //  context.log.info(...arguments);
    //  originalLogger(...arguments);
   // };
  }
}

export default (context: Context, req: HttpRequest) => {
  enableConsoleLogging(context);
  return Apollo.graphqlHandler(context, req);
}