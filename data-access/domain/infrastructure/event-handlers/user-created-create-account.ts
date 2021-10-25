import { NodeEventBus } from '../events/node-event-bus';
import { InProcEventBus } from '../events/in-proc-event-bus';

import { UserCreatedEvent } from '../../events/user-created';
import { MongoUnitOfWork } from '../persistance/mongo-unit-of-work';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { AccountConverter } from '../persistance/repositories/mongo-account-converter';
import { MongoAccountRepository } from '../persistance/repositories/mongo-account-repository';

export default () => { NodeEventBus.register(UserCreatedEvent, async (payload) => {
  console.log(`UserCreated Create User's Account: ${JSON.stringify(payload)} and UserId: ${payload.userId}`);
  var uow  = new MongoUnitOfWork(InProcEventBus,NodeEventBus, AccountModel, new AccountConverter(), MongoAccountRepository)
  console.log('here1');
  try {
    
    console.log('here1.1');
    

/*
    var newAccount1 = new AccountModel({
      name: payload.userId,
      contacts: [{
        firstName: payload.userId,
        user: payload.userId,
      }],
    });
    await newAccount1.save();
    */

    await uow.withTransaction(async (repo) => {
      var accounts = await repo.getByUserId(payload.userId);
      console.log('here3');
      console.log(`User accounts : ${JSON.stringify(accounts)} for UserId: ${payload.userId}`);
      if(!accounts || accounts.length == 0) {
        var newAccount = repo.getNewInstance(payload.userId);
        console.log(`Saving new account ${JSON.stringify(newAccount)}`)
        await repo.save(newAccount);
      }
    })
  } catch(e) {
    console.error(e);
  }
  console.log('here3');
})};