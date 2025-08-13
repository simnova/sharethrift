import {
	type ApolloServer,
	type BaseContext,
	type ContextFunction,
	type HTTPGraphQLRequest,
	HeaderMap,
} from '@apollo/server';
import type {
	HttpHandler,
	HttpRequest,
	InvocationContext,
} from '@azure/functions-v4';

import type { WithRequired } from '@apollo/utils.withrequired';
export type { WithRequired } from '@apollo/utils.withrequired';

export interface AzureFunctionsContextFunctionArgument {
	context: InvocationContext;
	req: HttpRequest;
}

export interface AzureFunctionsMiddlewareOptions<TContext extends BaseContext> {
	context?: ContextFunction<[AzureFunctionsContextFunctionArgument], TContext>;
}

// eslint-disable-next-line @typescript-eslint/require-await
const defaultContext: ContextFunction<
	[AzureFunctionsContextFunctionArgument]
> = async () => ({});

export function startServerAndCreateAzureFunctionHandler<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  buildContext: (req: HttpRequest) => TContext
): (context: InvocationContext, req: HttpRequest) => unknown {
  return (context: InvocationContext, req: HttpRequest) => {
    // Transform Azure Function request to Apollo Server
    // ... implement request/response mapping ...
    // Call ApolloServer.executeOperation or similar
    // ... handle errors and status codes ...
    return {
      status: 501,
      body: 'Not implemented',
    };
  };
}
