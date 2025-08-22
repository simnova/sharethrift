// [NN} [ESLINT] Temporarily disable no extraneous class rule until Context class is fully implemented
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Context {}
// GraphQL context types and builder
import type { ApiContextSpec } from '@sthrift/api-context-spec';
import type { ApplicationServices } from '@sthrift/api-application-services';

export interface GraphContext {
  apiContext: ApiContextSpec;
  applicationServices: ApplicationServices;
  // Add authentication, user context, etc.
}

import type { HttpRequest } from '@azure/functions';

export function buildGraphContext(
  req: HttpRequest & { 
    apiContext?: ApiContextSpec;
    applicationServices?: ApplicationServices;
  }
): GraphContext {
  // Extract apiContext from request (if available)
  const apiContext: ApiContextSpec =
    req.apiContext?.dataSources
      ? req.apiContext
      : (() => { throw new Error('dataSources is not available in apiContext'); })();
      
  // Extract applicationServices from request (if available)
  const applicationServices: ApplicationServices =
    req.applicationServices
      ? req.applicationServices
      : (() => { throw new Error('applicationServices is not available in request'); })();
      
  return {
    apiContext,
    applicationServices,
    // ... add more context as needed ...
  };
}
