import { NodeEventBus } from '../events/node-event-bus';
import { InProcEventBus } from '../events/in-proc-event-bus';

import { UserCreatedEvent } from '../../events/user-created';
import { MongoUnitOfWork } from '../persistance/mongo-unit-of-work';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { AccountConverter } from '../persistance/repositories/mongo-account-converter';
import { MongoAccountRepository } from '../persistance/repositories/mongo-account-repository';
import { CategoryModel } from '../../../infrastructure/data-sources/cosmos-db/models/category';
import { CategoryConverter } from '../persistance/repositories/mongo-category-converter';
import { MongoCategoryRepository } from '../persistance/repositories/mongo-category-repository';

export default async () => { NodeEventBus.register(UserCreatedEvent, async (payload) => {
  console.log(`UserCreated Create User's Account: ${JSON.stringify(payload)} and UserId: ${payload.userId}`);
  var uow  = new MongoUnitOfWork(InProcEventBus,NodeEventBus, CategoryModel, new CategoryConverter(), MongoCategoryRepository)
  console.log('here1');
  try {
    uow.withTransaction(async(repo) => {
      console.log('here2');
      var newCategory = repo.getNewInstance();
      newCategory.name = payload.userId;
      repo.save(newCategory);
    })
    console.log('here1.1');
    /*
    var newCategory = new CategoryModel({
      name: payload.userId
    })
    console.log('here11.2');
    newCategory.save();
    console.log('here1.2');
/*
    var newAccount1 = new AccountModel({
      name: payload.userId,
      contacts: [{
        user: {id : payload.userId},
      }]});
    
     await newAccount1.save();

    await uow.withTransaction(async (repo) => {
      console.log('here2');
      try {
        var accounts = await repo.getByUserId(payload.userId);
        console.log('here3');
        console.log(`UserCreated Create User's Account: ${JSON.stringify(accounts)} and UserId: ${payload.userId}`);
        if(!accounts || accounts.length == 0) {
          var newAccount = repo.getNewInstance(payload.userId);
          console.log(`Saving new account ${JSON.stringify(newAccount)}`)
          await repo.save(newAccount);
        }
          
      } catch (error) {
        console.error(error);
      }
      
      
    }).catch(error => {
      console.error(error);
    });
    */
  } catch(e) {
    console.error(e);
  }
  console.log('here3');
})};