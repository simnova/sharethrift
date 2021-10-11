import { Listing as ListingDO, ListingProps, ListingEntityReference } from '../../../domain/contexts/listing';
import {ListingDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import {Context} from '../../context';
import { ListingDetail } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { UserModel } from '../../../infrastructure/data-sources/cosmos-db/models/user';
import { UserDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { CategoryModel } from '../../../infrastructure/data-sources/cosmos-db/models/category';
import { CategoryDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { Entity } from '../../../domain/shared/entity';
import { UserProps } from '../../../domain/contexts/user';

type PropType = ListingDomainAdapter;
type DomainType = ListingDO<PropType>;
type RepoType = MongoListingRepository<PropType>;
export default class Listings extends DomainDataSource<Context,Listing,PropType,DomainType,RepoType> {
  updateListing(listing: ListingDetail) {
    this.withTransaction(async (repo) => {
      let domainObject =await repo.get(listing.id);
      domainObject.requestUpdateDescription(listing.description);
      domainObject.requestPublish();
      repo.save(domainObject);
    });
  }
  async addListing(listing: ListingDetail) : Promise<ListingEntityReference> {
    //If there are conversions between GraphQL Types and domain types, it should happen here
    var result : ListingEntityReference //: ListingDO<ListingProps>;

    var user = await UserModel.findById(listing.owner).exec();
    var userAdapter = new UserDomainAdapter(user);

    var category = await CategoryModel.findById(listing.primaryCategory).exec();
    var categoryAdapter = new CategoryDomainAdapter(category);

    await this.withTransaction(async (repo) => {
      var domainObject = repo.getNewInstance();
      domainObject.requestAddOwner(userAdapter);
      domainObject.requestAddCategory(categoryAdapter);
      domainObject.requestUpdateDescription(listing.description);
      domainObject.requestPublish();

      result = (await repo.save(domainObject));
    });
    return result;
  }
}