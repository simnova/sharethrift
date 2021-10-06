import { Listing as ListingDO, ListingProps } from '../../../domain/contexts/listing';
import {DomainAdapter}from '../../../domain/infrastructure/persistance/ListingConverter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/mongo-listing-repository';
import {Context} from '../../context';
import { ListingDetail } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';

type PropType = DomainAdapter;
type DomainType = ListingDO<PropType>;
type RepoType = MongoListingRepository<PropType>;
export default class Listings extends DomainDataSource<Context,Listing,PropType,DomainType,RepoType> {
  updateListing(listing: ListingDetail) {
    this.withTransaction(async (repo) => {
      let domainObject =await repo.get("somide");
      domainObject.requestUpdateDescription(listing.description);
      repo.save(domainObject);
    });
  }
  async addListing(listing: ListingDetail) : Promise<ListingDO<ListingProps>> {
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