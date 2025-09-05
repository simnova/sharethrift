import type { DataSources } from '@sthrift/api-persistence';
import {
	PersonalUser as PersonalUserApi,
	type PersonalUserApplicationService,
} from './end-user/index.ts';

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
