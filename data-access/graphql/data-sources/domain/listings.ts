import { Listing as ListingDO } from '../../../domain/contexts/listing/listing';
import { ListingConverter, ListingDomainAdapter }from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-listing-repository';
import { Context } from '../../context';
import { ListingDetail, ListingDraft, ListingNewDraft, DraftPhotoImageInput,DraftRemovePhotoImageInput } from '../../generated';
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

  /**
   * Returns a documentId for a gven photo slot on a draft listing, used for uploading to blob storage
   * @param photoInfo 
   * @returns Blob Storage documentId (nanoid)
   */
  async draftAddPhoto(photoInfo: DraftPhotoImageInput) : Promise<string> {
    ensureAccountPortalUser(this.context); 
    let result : string
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(photoInfo.listingId);
      result = (await domainObject.draft.requestAddPhoto(photoInfo.order)).documentId;
      await repo.save(domainObject);
    });
    return result;
  }

  async draftRemovePhoto(photoInfo: DraftRemovePhotoImageInput) : Promise<Listing> {
    ensureAccountPortalUser(this.context);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(photoInfo.listingId);
      await domainObject.draft.requestRemovePhoto(photoInfo.order);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  /**
   * Allows the user to update properties of a draft listing
   * @param draft 
   * @returns Updated draft listing
   */
  async updateDraft(draft: ListingDraft) : Promise<Listing> {
    ensureAccountPortalUser(this.context);

    let category = await this.context.dataSources.categoryAPI.getCategory(draft.primaryCategory);
    let categoryAdapter = new CategoryDomainAdapter(category);

    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(draft.id);
      
      await domainObject.draft.requestAddCategory(categoryAdapter);
      await domainObject.draft.requestUpdateTitle(draft.title);
      await domainObject.draft.requestUpdateDescription(draft.description);
      await domainObject.draft.requestUpdateTags(new Tags(draft.tags));

      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  /**
   * Allows the user to note they have completed the draft and are ready to publish
   * @param id 
   * @returns Current listing - it will only be published if listing is approved (async opeartion)
   */
  async publishDraft(id: string) : Promise<Listing> {
    ensureAccountPortalUser(this.context);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(id);
      await domainObject.draft.requestPublish();
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async createDraft(id:string) : Promise<Listing> {
    ensureAccountPortalUser(this.context);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(id);
      await domainObject.requestDraft();
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }

  async unpublish(id: string) : Promise<Listing> {
    ensureAccountPortalUser(this.context);
    let result : ListingDO<ListingDomainAdapter>;
    await this.withTransaction(async (repo) => {
      let domainObject = await repo.get(id);
      await domainObject.requestUnpublish();
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
      await domainObject.draft.requestAddCategory(categoryAdapter);
      await domainObject.draft.requestUpdateTitle(listing.title);
      await domainObject.draft.requestUpdateDescription(listing.description);
      result = await repo.save(domainObject);
    });
    return (new ListingConverter()).toMongo(result);
  }
}