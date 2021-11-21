import { HttpRequest } from '@azure/functions';

export interface ContextUserBase {
  inspectRequest: (request:HttpRequest) => object | undefined;
}

export type BaseUser = {
  id: string;
  name: string;
  roles: string[]
}