import { Listing as ListingDO, ListingProps, ListingEntityReference } from '../../../domain/contexts/listing';
import {ListingDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import {Context} from '../../context';
import { ListingDetail } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';

type PropType = ListingDomainAdapter;
type DomainType = ListingDO<PropType>;
type RepoType = MongoListingRepository<PropType>;
export default class Listings extends DomainDataSource<Context,Listing,PropType,DomainType,RepoType> {
  updateListing(listing: ListingDetail) {
    this.withTransaction(async (repo) => {
      let domainObject =await repo.get('someid');
      domainObject.requestUpdateDescription(listing.description);
      repo.save(domainObject);
    });
  }
  async addListing(listing: ListingDetail) : Promise<ListingEntityReference> {
    //If there are conversions between GraphQL Types and domain types, it should happen here
    var result : ListingDO<ListingProps>;
    await this.withTransaction(async (repo) => {
      var domainObject = repo.getNewInstance();
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return result;
  }
}