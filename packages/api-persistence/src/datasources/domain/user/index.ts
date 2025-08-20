import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { MongooseModelsType } from '@sthrift/api-data-sources-mongoose-models';
import { PersonalUserPersistence } from './personal-user/index.ts';

export const UserContextPersistence = (
	mongooseModels: MongooseModelsType,
	inProcEventBusInstance: DomainSeedwork.EventBus,
	nodeEventBusInstance: DomainSeedwork.EventBus,
) => {
	return {
		...PersonalUserPersistence(
			mongooseModels,
			inProcEventBusInstance,
			nodeEventBusInstance,
		),
	};
};