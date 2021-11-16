import { Listing as ListingDO } from '../../../domain/contexts/listing/listing';
import {ListingConverter, ListingDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import {Context} from '../../context';
import { ListingDetail, ListingDraft } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { UserConverter } from '../../../domain/infrastructure/persistance/adapters/user-domain-adapter';
import { CategoryDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { AccountConverter } from '../../../domain/infrastructure/persistance/adapters/account-domain-adapter';
import { PassportImpl } from '../../../domain/contexts/iam/passport';
import { ObjectId } from 'mongoose';

type PropType = ListingDomainAdapter;
type DomainType = ListingDO<PropType>;
type RepoType = MongoListingRepository<PropType>;
export class Listings extends DomainDataSource<Context,Listing,PropType,DomainType,RepoType> {

  async updateListing(listing: ListingDetail) : Promise<Listing>  {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(listing.id);
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async updateDraft(draft: ListingDraft) : Promise<Listing> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(draft.id);
      domainObject.draft.requestUpdateTitle(draft.title);
      domainObject.draft.requestUpdateDescription(draft.description);
     // domainObject.draft.requestAddCategory(draft.category);

      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async publishDraft(id: string) : Promise<Listing> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(id);
      domainObject.requestPublish()//.requestPublish();
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async addListing(listing: ListingDetail) : Promise<Listing> {
    if(this.context.VerifiedUser.OpenIdConfigKey !== 'AccountPortal') {
      throw new Error('Unauthorized');
    }

    let userExternalId = this.context.VerifiedUser.VerifiedJWT.oid;
    let passport = new PassportImpl(
      (new UserConverter()).toDomain(await this.context.dataSources.userAPI.getByExternalId(userExternalId)),
    )
    let account = (new AccountConverter()).toDomain(await this.context.dataSources.accountAPI.getAccount(listing.account));
    let category = await this.context.dataSources.categoryAPI.getCategory(listing.primaryCategory);

    let categoryAdapter = new CategoryDomainAdapter(category);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.getNewInstance(account,passport);
      domainObject.requestAddCategory(categoryAdapter);
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }
}