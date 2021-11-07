import { Listing as ListingDO } from '../../../domain/contexts/listing/listing';
import {ListingConverter, ListingDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import {Context} from '../../context';
import { ListingDetail } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { UserConverter } from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { CategoryDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { AccountConverter } from '../../../domain/infrastructure/persistance/adapters/account-domain-adapter';
import { PassportImpl } from '../../../domain/contexts/iam/passport';

type PropType = ListingDomainAdapter;
type DomainType = ListingDO<PropType>;
type RepoType = MongoListingRepository<PropType>;
export class Listings extends DomainDataSource<Context,Listing,PropType,DomainType,RepoType> {

  async updateListing(listing: ListingDetail) : Promise<Listing>  {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    var result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject =await repo.get(listing.id);
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async addListing(listing: ListingDetail) : Promise<Listing> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    var userExternalId = this.context.VerifiedUser.VerifiedJWT.oid;
    var passport = new PassportImpl(
      (new UserConverter()).toDomain(await this.context.dataSources.userAPI.getByExternalId(userExternalId)),
    )
    var account = (new AccountConverter()).toDomain(await this.context.dataSources.accountAPI.getAccount(listing.account));
    var category = await this.context.dataSources.categoryAPI.getCategory(listing.primaryCategory);

    var categoryAdapter = new CategoryDomainAdapter(category);
    var result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      var domainObject = await repo.getNewInstance(account,passport);
      domainObject.requestAddCategory(categoryAdapter);
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }
}