import { User as UserDO, UserProps, UserEntityReference } from '../../../domain/contexts/user';
import {UserDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { MongoUserRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-user-repository';
import {Context} from '../../context';
import { UserUpdateInput, CreateUserInput } from '../../generated';
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
  async addUser(user: CreateUserInput) : Promise<UserEntityReference> {
    //If there are conversions between GraphQL Types and domain types, it should happen here
    var result : UserEntityReference;
    await this.withTransaction(async (repo) => {
      var domainObject = repo.getNewInstance();
    //  domainObject.requestUpdateDescription(user.description);
      result = await repo.save(domainObject);
    });
    return result;
  }
}