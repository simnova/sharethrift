import { HttpRequest } from '@azure/functions';

/**
 * Extracts the bearer token from the request assuming it is in the Authorization header and starts with 'Bearer '
 * @param request The request to extract the token from
 * @returns The token or null if it could not be extracted
 */
export const ExtractBearerToken = (request: HttpRequest): string => {
  let token = request.headers['authorization'];
  if (!token || !(token.startsWith('Bearer '))) {
    return null;
  }

  // Remove Bearer from string
  token = token.slice(7, token.length).trimLeft();
  return token;
}