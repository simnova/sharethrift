import type { DataSources } from '@sthrift/persistence';
import {
	PersonalUser as PersonalUserApi,
	type PersonalUserApplicationService,
} from './personal-user/index.ts';

export interface UserContextApplicationService {
	PersonalUser: PersonalUserApplicationService;
}

export const User = (
	dataSources: DataSources,
): UserContextApplicationService => {
	return {
		PersonalUser: PersonalUserApi(dataSources),
	};
};
