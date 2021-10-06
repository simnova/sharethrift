import { ListingConverter } from '../../../domain/infrastructure/persistance/ListingConverter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/mongo-listing-repository';
import { ListingModel } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { MongoUnitOfWork } from '../../../domain/shared/infrasctructure/mongo-unit-of-work';
import Listings from './listings';

export const Domain  = {
  listingDomainAPI: new Listings(new MongoUnitOfWork(ListingModel, new ListingConverter(), MongoListingRepository))
}

export type DomainType = typeof Domain;