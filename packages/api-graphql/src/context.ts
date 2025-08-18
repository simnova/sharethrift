// [NN} [ESLINT] Temporarily disable no extraneous class rule until Context class is fully implemented
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Context {}
// GraphQL context types and builder
import type { ApiContextSpec } from '@sthrift/api-context-spec';

export interface GraphContext {
  apiContext: ApiContextSpec;
  // Add authentication, user context, etc.
}

import type { HttpRequest } from '@azure/functions';

export function buildGraphContext(
  req: HttpRequest & { apiContext?: ApiContextSpec }
): GraphContext {
  // Extract apiContext from request (if available)
  const apiContext: ApiContextSpec =
    req.apiContext?.dataSources
      ? req.apiContext
      : (() => { throw new Error('dataSources is not available in apiContext'); })();
  return {
    apiContext,
    // ... add more context as needed ...
  };
}
