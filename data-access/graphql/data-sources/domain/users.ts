import { User as UserDO } from '../../../domain/contexts/user/user';
import { UserConverter, UserDomainAdapter }from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { MongoUserRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-user-repository';
import { Context } from '../../context';
import { UserUpdateInput } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { User } from '../../../infrastructure/data-sources/cosmos-db/models/user';
import { report } from 'process';

type PropType = UserDomainAdapter;
type DomainType = UserDO<PropType>;
type RepoType = MongoUserRepository<PropType>;

export class Users extends DomainDataSource<Context,User,PropType,DomainType,RepoType> {

  async updateUser(user: UserUpdateInput) : Promise<User> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    let result : User;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(user.id);
      if(!domainObject || domainObject.externalId !== this.context.VerifiedUser.VerifiedJWT.sub) {
        throw new Error('Unauthorized');
      }
      await domainObject.setFirstName(user.firstName);
      await domainObject.setLastName(user.lastName);
      result = (new UserConverter()).toMongo(await repo.save(domainObject));
    });
    return result;
  }
  

  async addUser() : Promise<User> {
    console.log(`addUser`,this.context.VerifiedUser);
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized 99');
    }
    
    let userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
    let userFirstName = this.context.VerifiedUser.VerifiedJWT.given_name;
    let userLastName = this.context.VerifiedUser.VerifiedJWT.family_name;
    let userEmail = this.context.VerifiedUser.VerifiedJWT.email;

    let userToReturn : User;
    await this.withTransaction(async (repo) => {
      let userConverter = new UserConverter();
      let userExists = await repo.getByExternalId(userExternalId);
      if(userExists) {
        userToReturn = userConverter.toMongo(userExists);
      }else{
        let newUser = await repo.getNewInstance(
          userExternalId,
          userFirstName,
          userLastName);
        if(userEmail) {
          await newUser.setEmail(userEmail);
        }
        userToReturn = userConverter.toMongo(await repo.save(newUser));
      }
    });
    return userToReturn;
  }
  
}