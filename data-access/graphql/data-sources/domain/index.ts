import { ListingConverter } from '../../../domain/infrastructure/persistance/ListingConverter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/mongo-listing-repository';
import { ListingModel } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import Listings from './listings';

export const Domain  = {
  listingDomainAPI: new Listings(new MongoListingRepository(ListingModel, new ListingConverter))
}

export type DomainType = typeof Domain;