import { NodeEventBus } from '../events/node-event-bus';
import { InProcEventBus } from '../events/in-proc-event-bus';

import { UserCreatedEvent } from '../../events/user-created';
import { MongoUnitOfWork } from '../persistance/mongo-unit-of-work';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { AccountConverter } from '../persistance/repositories/mongo-account-converter';
import { MongoAccountRepository } from '../persistance/repositories/mongo-account-repository';

export default () => { NodeEventBus.register(UserCreatedEvent, async (payload) => {
  console.log(`UserCreatedEvent -> CreateAccount Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.userId}`);
  var uow  = new MongoUnitOfWork(InProcEventBus,NodeEventBus, AccountModel, new AccountConverter(), MongoAccountRepository)
  await uow.withTransaction(async (repo) => {
    var accounts = await repo.getByUserId(payload.userId);
    if(!accounts || accounts.length == 0) {
      var newAccount = repo.getNewInstance(payload.userId);
      await repo.save(newAccount);
    }
  });
  console.log("hello world");
})};