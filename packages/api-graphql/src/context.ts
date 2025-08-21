// [NN} [ESLINT] Temporarily disable no extraneous class rule until Context class is fully implemented
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Context {}
// GraphQL context types and builder
import type { ApiContextSpec } from '@sthrift/api-context-spec';
import type { ApplicationServices } from '@sthrift/api-application-services';

export interface GraphContext {
  apiContext: ApiContextSpec;
  applicationServices?: ApplicationServices;
  // Add authentication, user context, etc.
}

import type { HttpRequest } from '@azure/functions';
import type { ApplicationServicesFactory } from '@sthrift/api-application-services';

export function buildGraphContext(
  req: HttpRequest & { apiContext?: ApiContextSpec },
  _applicationServicesFactory?: ApplicationServicesFactory
): GraphContext {
  // Extract apiContext from request (if available)
  const apiContext: ApiContextSpec =
    req.apiContext?.dataSources
      ? req.apiContext
      : (() => { throw new Error('dataSources is not available in apiContext'); })();
  
  return {
    apiContext,
    // applicationServices will be injected by the Apollo context function
    // ... add more context as needed ...
  };
}
