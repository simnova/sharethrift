import { Listing as ListingDO } from '../../../domain/contexts/listing/listing';
import { ListingConverter, ListingDomainAdapter }from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import { Context } from '../../context';
import { ListingDetail, ListingDraft, ListingNewDraft } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { CategoryDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { AccountConverter } from '../../../domain/infrastructure/persistance/adapters/account-domain-adapter';
import { Tags } from '../../../domain/contexts/listing/listing-value-objects';
import { getPassport,ensureAccountPortalUser } from './domain-data-utils';

type PropType = ListingDomainAdapter;
type DomainType = ListingDO<PropType>;
type RepoType = MongoListingRepository<PropType>;
export class Listings extends DomainDataSource<Context,Listing,PropType,DomainType,RepoType> {

  async updateListing(listing: ListingDetail) : Promise<Listing>  {
    ensureAccountPortalUser(this.context);


    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(listing.id);
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async updateDraft(draft: ListingDraft) : Promise<Listing> {
    ensureAccountPortalUser(this.context);

    let category = await this.context.dataSources.categoryAPI.getCategory(draft.primaryCategory);

    let categoryAdapter = new CategoryDomainAdapter(category);

    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(draft.id);
      
      domainObject.draft.requestAddCategory(categoryAdapter);
      domainObject.draft.requestUpdateTitle(draft.title);
      domainObject.draft.requestUpdateDescription(draft.description);
      domainObject.draft.requestUpdateTags(new Tags(draft.tags));

      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async publishDraft(id: string) : Promise<Listing> {
    ensureAccountPortalUser(this.context);


    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(id);
      domainObject.requestPublish();
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }
  async addNewListing(listing: ListingNewDraft) : Promise<Listing> {
    ensureAccountPortalUser(this.context);

    console.log('domainAPI> addNewListing');
    let passport = await getPassport(this.context);
    let account = (new AccountConverter()).toDomain(await this.context.dataSources.accountAPI.getAccountByHandle(listing.accountHandle),{passport:passport}); //TODO: this is not the right way to do it
    let category = await this.context.dataSources.categoryAPI.getCategory(listing.primaryCategory);

    let categoryAdapter = new CategoryDomainAdapter(category);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.getNewInstance(account);
      domainObject.draft.requestAddCategory(categoryAdapter);
      domainObject.draft.requestUpdateTitle(listing.title);
      domainObject.draft.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async addListing(listing: ListingDetail) : Promise<Listing> {
    ensureAccountPortalUser(this.context);
    let passport = await getPassport(this.context);
    let account = (new AccountConverter()).toDomain(await this.context.dataSources.accountAPI.getAccount(listing.account),{passport:passport}); //TODO: this is not the right way to do it
    let category = await this.context.dataSources.categoryAPI.getCategory(listing.primaryCategory);

    let categoryAdapter = new CategoryDomainAdapter(category);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.getNewInstance(account);
      domainObject.requestAddCategory(categoryAdapter);
      domainObject.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }
}