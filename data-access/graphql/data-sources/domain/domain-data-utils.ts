import { UserConverter } from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { PassportImpl } from '../../../domain/contexts/iam/passport';
import { Context } from '../../context';
import { User as UserDO } from '../../../domain/contexts/user/user';

export const getPassport = async (context: Context) => {
  let userExternalId = context.VerifiedUser.VerifiedJWT.sub;
  var mongoUser = await context.dataSources.userAPI.getByExternalId(userExternalId);
  var userAdapter = new UserConverter().toAdapter(mongoUser);
  var domainUser = new UserDO(userAdapter);
  let passport = new PassportImpl(domainUser);

  return passport;  
}

export const ensureAccountPortalUser = (context: Context) => {
  if(context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
    throw new Error('Unauthorized');
  }
}