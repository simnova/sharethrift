import { ListingUnitOfWork, CategoryUnitOfWork, UserUnitOfWork, AccountUnitOfWork} from '../../../domain/infrastructure/persistance/repositories';
import { Listings } from './listings';
import { Categories } from './categories';
import { Users } from './users';
import { Accounts } from './accounts';

export const Domain  = {
  listingDomainAPI: new Listings(ListingUnitOfWork),
  categoryDomainAPI: new Categories(CategoryUnitOfWork),
  userDomainAPI: new Users(UserUnitOfWork),
  accountDomainAPI: new Accounts(AccountUnitOfWork),
}

export type DomainType = typeof Domain;