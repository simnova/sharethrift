import { HttpRequest, Context } from '@azure/functions';
import connect from "../shared/data-sources/cosmos-db/connect";
import Apollo from './init/apollo';

(async () => {
  await connect();
})();

export default (context: Context, req: HttpRequest) => {
  return Apollo.graphqlHandler(context, req);
};