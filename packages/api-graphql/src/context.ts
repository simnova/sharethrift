// GraphQL context types and builder
import type { ApiContextSpec } from '@ocom/api-context-spec';

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
    req.apiContext?.domainDataSource
      ? req.apiContext
      : {
          // Provide a default domainDataSource or throw an error if not available
          // domainDataSource is required; throw an error if not available
          domainDataSource: (() => { throw new Error('domainDataSource is not available in apiContext'); })(),
        };
  return {
    apiContext,
    // ... add more context as needed ...
  };
}
