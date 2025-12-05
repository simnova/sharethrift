import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import {
  type UserQueryByIdCommand,
  queryById,
} from './query-by-id.ts';

export interface UserApplicationService {
 	queryById: (
 		command: UserQueryByIdCommand,
 	) => Promise<Domain.Contexts.User.UserEntityReference | null>;
}

export const User = (
  dataSources: DataSources,
): UserApplicationService => {
  return {
    queryById: queryById(dataSources),
  };
}; 