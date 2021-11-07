import { ListingUnitOfWork, CategoryUnitOfWork, UserUnitOfWork } from '../../../domain/infrastructure/persistance/repositories';
import { Listings } from './listings';
import { Categories } from './categories';
import { Users } from './users';

export const Domain  = {
  listingDomainAPI: new Listings(ListingUnitOfWork),
  categoryDomainAPI: new Categories(CategoryUnitOfWork),
  userDomainAPI: new Users(UserUnitOfWork),
}

export type DomainType = typeof Domain;