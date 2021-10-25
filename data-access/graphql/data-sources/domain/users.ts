import { User as UserDO, UserEntityReference } from '../../../domain/contexts/user/user';
import {UserDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { MongoUserRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-user-repository';
import {Context} from '../../context';
import { UserUpdateInput } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { User } from '../../../infrastructure/data-sources/cosmos-db/models/user';

type PropType = UserDomainAdapter;
type DomainType = UserDO<PropType>;
type RepoType = MongoUserRepository<PropType>;

export default class Users extends DomainDataSource<Context,User,PropType,DomainType,RepoType> {
  async updateUser(user: UserUpdateInput) : Promise<UserEntityReference> {
    var result : UserEntityReference;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(user.id);
      //.(user.description);
      result = await repo.save(domainObject);
    });
    return result;
  }
  async addUser() : Promise<UserEntityReference> {
    if(this.context.VerifedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }
    
    var userExternalId = this.context.VerifedUser.VerifiedJWT.sub;
    var userFirstName = this.context.VerifedUser.VerifiedJWT.given_name;
    var userLastName = this.context.VerifedUser.VerifiedJWT.family_name;
    var userEmail = this.context.VerifedUser.VerifiedJWT.email;

    var userToReturn : UserEntityReference;
    await this.withTransaction(async (repo) => {
      let userExists = await repo.getByExternalId(userExternalId);
      if(userExists) {
        userToReturn = userExists;
      }else{
        var newUser = repo.getNewInstance(
          userExternalId,
          userFirstName,
          userLastName,
          userEmail
        );
        console.log(`New user - presave: ${JSON.stringify(newUser)}}`);
        userToReturn = await repo.save(newUser);
      }


    });
    return userToReturn;
  }
}