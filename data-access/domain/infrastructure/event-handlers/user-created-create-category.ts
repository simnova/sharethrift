import { NodeEventBus } from '../events/node-event-bus';
import { InProcEventBus } from '../events/in-proc-event-bus';

import { UserCreatedEvent } from '../../events/user-created';
import { MongoUnitOfWork } from '../persistance/mongo-unit-of-work';

import { CategoryModel } from '../../../infrastructure/data-sources/cosmos-db/models/category';
import { CategoryConverter } from '../persistance/repositories/mongo-category-converter';
import { MongoCategoryRepository } from '../persistance/repositories/mongo-category-repository';

export default () => { NodeEventBus.register(UserCreatedEvent, async (payload) => {

  console.log(`UserCreatedEvent -> CreateCategory Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.userId}`);
  var uow  = new MongoUnitOfWork(InProcEventBus,NodeEventBus, CategoryModel, new CategoryConverter(), MongoCategoryRepository)
  uow.withTransaction(async(repo) => {
    var newCategory = repo.getNewInstance();
    newCategory.name = payload.userId;
    repo.save(newCategory);
  });

})};