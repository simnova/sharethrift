import { HttpRequest, Context } from '@azure/functions';
import connect from '../shared/data-sources/cosmos-db/connect';
import Apollo from './init/apollo';

(async () => {
  console.log("before");
  await connect();
  console.log("after");
})();

function enableConsoleLogging (context) {
  if (context) {
    const originalLogger = console.log;
    console.log = function () {
      context.log(...arguments);
      originalLogger(...arguments);
    };
  }
}

export default (context: Context, req: HttpRequest) => {
  enableConsoleLogging(context);
  return Apollo.graphqlHandler(context, req);
};