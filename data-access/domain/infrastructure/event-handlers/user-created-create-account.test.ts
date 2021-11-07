import { Context } from '../../../graphql/context';
import { Domain } from '../../../graphql/data-sources/domain';
import { connect } from '../../../infrastructure/data-sources/cosmos-db/connect';
import { DataSourceConfig } from 'apollo-datasource';
import {default as ResisterUserCreatedCreateAccountHandler} from './user-created-create-account';
import { NodeEventBus } from '../events/node-event-bus';
import { UserCreatedEvent } from '../../events/user-created';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import { AccountUnitOfWork } from '../persistance/repositories';
import { AccountConverter } from '../persistance/adapters/account-domain-adapter';


test('should create account', async () => {
  
  //arrange
  var dataSourceConfigContext = {
    context: {
      VerifiedUser: {
        VerifiedJWT: {
          sub:'external-system-user-id',
          given_name:'external-system-user-name',
          family_name:'external-system-user-family-name',
          email:'external-system-user-email@host.com',
        },
        OpenIdConfigKey: 'AccountPortal'
      }
    }
  } as DataSourceConfig<Context>;
  Domain.userDomainAPI.initialize(dataSourceConfigContext);
  

  await connect();
  var user = await Domain.userDomainAPI.addUser();
  ResisterUserCreatedCreateAccountHandler();

  //act
  await AccountUnitOfWork.withTransaction(async (repo) => {
    var accounts = await repo.getByUserId(user.id);
    if(!accounts || accounts.length == 0) {
      var newAccount = await repo.getNewInstance(user.id);
      console.log(`UserCreatedEvent -> CreateAccount Handler - Creating new Account: ${JSON.stringify(newAccount)}`);
      await repo.save(newAccount);
      console.log(`UserCreatedEvent -> CreateAccount Handler - Created new Account: ${JSON.stringify(newAccount)}`);
    }
  });

  //assert
 // var accounts = await AccountModel.find({});
  //console.log("accounts", accounts);
  var account = await AccountModel.findOne({'contacts.user':user.id}).exec(); //.populate('contacts.user').exec();
  var accountDO = (new AccountConverter()).toDomain(account);
  var contactList = await accountDO.contacts();
  contactList.forEach(c => {
    console.log('found user',JSON.stringify(c.user.firstName));
  }
  );
  console.log('account', JSON.stringify(account));
  expect(account).toBeDefined();
  
});
  