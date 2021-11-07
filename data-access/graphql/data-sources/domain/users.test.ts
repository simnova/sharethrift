import { Domain } from './index';
import { Context } from '../../context';
import { DataSourceConfig } from 'apollo-datasource';
import { connect } from '../../../infrastructure/data-sources/cosmos-db/connect';
import { AccountModel } from '../../../infrastructure/data-sources/cosmos-db/models/account';
import RegisterHandlers from '../../../domain/infrastructure/event-handlers/'

test('create new user', async () => {
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
  await connect();
//  RegisterHandlers();
  Domain.userDomainAPI.initialize(dataSourceConfigContext);
  //act
  var user = await Domain.userDomainAPI.addUser();
  //assert
//  var account = await AccountModel.findOne({'contacts.user.id':user.id}).exec();
//  console.log('account', JSON.stringify(account));
  expect(user.id).toBeDefined();
});