import { User as UserDO } from '../../../domain/contexts/user/user';
import { UserConverter, UserDomainAdapter }from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { MongoUserRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-user-repository';
import { Context } from '../../context';
import { UserUpdateInput } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { User } from '../../../infrastructure/data-sources/cosmos-db/models/user';

type PropType = UserDomainAdapter;
type DomainType = UserDO<PropType>;
type RepoType = MongoUserRepository<PropType>;

export class Users extends DomainDataSource<Context,User,PropType,DomainType,RepoType> {

  async updateUser(user: UserUpdateInput) : Promise<User> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    var result : User;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(user.id);
      if(!domainObject || domainObject.externalId !== this.context.VerifiedUser.VerifiedJWT.sub) {
        throw new Error('Unauthorized');
      }
      domainObject.setFirstName(user.firstName);
      result = (new UserConverter()).toMongo(await repo.save(domainObject));
    });
    return result;
  }

  async addUser() : Promise<User> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }
    
    var userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
    var userFirstName = this.context.VerifiedUser.VerifiedJWT.given_name;
    var userLastName = this.context.VerifiedUser.VerifiedJWT.family_name;
    var userEmail = this.context.VerifiedUser.VerifiedJWT.email;

    var userToReturn : User;
    await this.withTransaction(async (repo) => {
      var userConverter = new UserConverter();
      let userExists = await repo.getByExternalId(userExternalId);
      if(userExists) {
        userToReturn = userConverter.toMongo(userExists);
      }else{
        var newUser = repo.getNewInstance(
          userExternalId,
          userFirstName,
          userLastName);
        if(userEmail) {
          newUser.setEmail(userEmail);
        }
        userToReturn = userConverter.toMongo(await repo.save(newUser));
      }
    });
    return userToReturn;
  }
  
}