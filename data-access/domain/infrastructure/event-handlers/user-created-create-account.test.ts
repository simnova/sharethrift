import { Context } from '../../../graphql/context';
import { Domain } from '../../../graphql/data-sources/domain';
import { connect } from '../../../infrastructure/data-sources/cosmos-db/connect';
import { DataSourceConfig } from 'apollo-datasource';
import {default as ResisterUserCreatedCreateAccountHandler} from './user-created-create-account';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { AccountUnitOfWork } from '../persistance/repositories';
import { AccountConverter } from '../persistance/adapters/account-domain-adapter';
import mongoose from 'mongoose';

test('should create account', async () => {
  
  //arrange
  var dataSourceConfigContext = {
    context: {
      VerifiedUser: {
        VerifiedJWT: {
          sub:'eb37868b-790a-4ded-9b2a-11ae0cd86c1e',
          given_name:'external-system-user-name',
          family_name:'external-system-user-family-name',
          email:'external-system-user-email22@host.com',
        },
        OpenIdConfigKey: 'AccountPortal'
      }
    }
  } as DataSourceConfig<Context>;
  Domain.userDomainAPI.initialize(dataSourceConfigContext);
  
  await connect();
  let user = await Domain.userDomainAPI.addUser();
  ResisterUserCreatedCreateAccountHandler();

  //act
  /*
  await AccountUnitOfWork.withTransaction(payload.context,async (repo) => {
    let accounts = await repo.getByUserId(user.id);
    if(!accounts || accounts.length == 0) {
      let newAccount = await repo.getNewInstance(user.id);
      console.log(`UserCreatedEvent -> CreateAccount Handler - Creating new Account: ${JSON.stringify(newAccount)}`);
      await repo.save(newAccount);
      console.log(`UserCreatedEvent -> CreateAccount Handler - Created new Account: ${JSON.stringify(newAccount)}`);
    }
  });
  */

  var requestCharge:any = {};

  mongoose.connection.db.command({ getLastRequestStatistics: 1 }, function(err, result) {
    if(result){
      requestCharge = result['RequestCharge'];
    }
  });

  console.log(`RequestCharge:`,JSON.stringify(requestCharge));

  //assert
 // var accounts = await AccountModel.find({});
  //console.log("accounts", accounts);

  /*
  var account = await AccountModel.findOne({'contacts.user':user.id}).exec(); //.populate('contacts.user').exec();
  var accountDO = (new AccountConverter()).toDomain(account);
  var contactList = await accountDO.contacts();
  contactList.forEach(c => {
    console.log('found user',JSON.stringify(c.user.firstName));
  }
  );
  console.log('account', JSON.stringify(account));
  expect(account).toBeDefined();
  */
  
});
  