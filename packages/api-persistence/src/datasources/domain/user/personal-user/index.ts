import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { MongooseModelsType } from '@sthrift/api-data-sources-mongoose-models';
import { getPersonalUserUnitOfWork } from "./personal-user.uow.ts";

export const PersonalUserPersistence = (
mongooseModels: MongooseModelsType,
inProcEventBusInstance: DomainSeedwork.EventBus,
nodeEventBusInstance: DomainSeedwork.EventBus,
) => {
if (!mongooseModels?.User?.PersonalUser) {
throw new Error("PersonalUser model is not available in mongooseModels");
}

return {
PersonalUser: getPersonalUserUnitOfWork(
mongooseModels.User.PersonalUser,
inProcEventBusInstance,
nodeEventBusInstance,
),
};
};
