import type { DataSources } from '@sthrift/persistence';
import {
	PersonalUser as PersonalUserApi,
	type PersonalUserApplicationService,
} from './personal-user/index.ts';
import {
	AdminUser as AdminUserApi,
	type AdminUserApplicationService,
} from './admin-user/index.ts';
import {
  User as UserApi,
  type UserApplicationService,
} from './user/index.ts';

export interface UserContextApplicationService {
	PersonalUser: PersonalUserApplicationService;
	AdminUser: AdminUserApplicationService;
  User: UserApplicationService;
}

export const User = (
	dataSources: DataSources,
): UserContextApplicationService => {
	return {
		PersonalUser: PersonalUserApi(dataSources),
		AdminUser: AdminUserApi(dataSources),
    User: UserApi(dataSources),
	};
};
