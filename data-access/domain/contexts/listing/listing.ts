import { AggregateRoot } from '../../shared/aggregate-root';
import { Category, CategoryEntityReference, CategoryProps } from './category';
import { Location, LocationEntityReference, LocationProps } from './location';
import { Photo, PhotoProps, PhotoEntityReference } from './photo';
import { ListingPhotoDeletedEvent } from '../../events/listing-photo-deleted';
import { ListingPublishedEvent } from '../../events/listing-published';
import { ListingUnpublishedEvent } from '../../events/listing-unpublished';

import { EntityProps } from '../../shared/entity';
import { AccountEntityReference } from '../account/account';
import { Draft, DraftProps } from './draft';
import { ListingStatusCodes } from './listing-value-objects';
import { DomainExecutionContext } from '../context';
import { ListingVisa } from '../iam/listing-visa';
import { PropArray } from '../../shared/prop-array';

export interface ListingProps extends EntityProps {
  id: string;
  draft: DraftProps;
  getNewDraft(): void;
  title: string;
  description: string;
  statusCode:string;
  tags: string[];
  location: LocationProps;
  photos: PropArray<PhotoProps>;
  getAccount(context:DomainExecutionContext): Promise<AccountEntityReference>;
  setAccount(account: AccountEntityReference): Promise<void>;
  primaryCategory: CategoryProps;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;  
  usersCurrentPublishedListingQuantity: () => Promise<number>;
}

export interface ListingEntityReference {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: string[];
  readonly location?: LocationEntityReference;
  readonly photos?: PhotoEntityReference[];
  account(): Promise<AccountEntityReference>;
  readonly primaryCategory?: CategoryEntityReference;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
}


export class Listing<props extends ListingProps> extends AggregateRoot<props> implements ListingEntityReference {
  constructor(props: props,private context:DomainExecutionContext) { 
    super(props); 
    this.visa = context.passport.forListing(this);
  }
  protected visa: ListingVisa;
  
  get draft(): Draft {return new Draft(this.props.draft ?? this.props.getNewDraft(), this, this.visa);}
  get id(): string {return this.props.id;}
  get title(): string {return this.props.title;}
  get description(): string {return this.props.description;}
  get tags(): string[] {return this.props.tags;}
  get location(): LocationEntityReference {return new Location(this.props.location);}
  get photos(): PhotoEntityReference[] { return this.props.photos.items.map(photo=>new Photo(photo));} //should be REadOnyArray<PhotoEntityReference> but gen has issues

  async account(): Promise<AccountEntityReference> { return this.props.getAccount(this.context);}
  get primaryCategory(): CategoryEntityReference { return new Category(this.props.primaryCategory);}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  static async getNewListing<newPropType extends ListingProps>(props:newPropType,account: AccountEntityReference, context:DomainExecutionContext): Promise<Listing<newPropType>> {
    props.getNewDraft();
    let listing = new Listing(props,context);
    
    await listing.requestAddAccount(account);
    
    if(!context.passport.forListing(listing).determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Cannot add listing');
    }
    return listing;
  }
 
  async publishApprovedDraft(){
    if(!await this.visa.determineIf((permissions) => permissions.isSystemAccount)) {
      throw new Error('Permission denied');
    }
    await this.draft.appovePublish();
    this.props.title = this.props.draft.title;
    this.props.description = this.props.draft.description;
    this.props.tags = this.draft.tags;
    this.props.primaryCategory = this.props.draft.primaryCategory;

    //remove photos no longer needed:
    var removedPhotos = this.props.photos.items.filter(photo=>!this.draft.photos.find(photoDraft=>photoDraft.documentId == photo.documentId));
    removedPhotos.forEach(photo => this.addIntegrationEvent(ListingPhotoDeletedEvent,{documentId: photo.documentId}));

    this.props.photos.removeAll();
    this.props.draft.photos.items.forEach(photo => this.props.photos.addItem(photo));
    this.addIntegrationEvent(ListingPublishedEvent,{listingId: this.props.id});
  }

  public async requestUnpublish() : Promise<void> {
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }   
    if(this.props.statusCode !== ListingStatusCodes.Published) {
      throw new Error('Cant unpublish a listing that is not published');
    }
    this.props.statusCode = ListingStatusCodes.Draft;
    this.addIntegrationEvent(ListingUnpublishedEvent,{listingId: this.props.id});
  }

  public async requestDraft():Promise<void> {
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }    
    if(this.props.statusCode === ListingStatusCodes.Draft) {
      throw new Error('Already in draft status');
    }
    this.props.getNewDraft();
  }
  
  private async requestAddAccount(account:AccountEntityReference){
    let existingAccount = await this.props.getAccount(this.context);
    if(existingAccount){
      throw new Error("Account already exists");
    }
    this.props.setAccount(account);
  }

}

export interface ListingPermissions {
  canManageListings: boolean;
  readonly isSystemAccount: boolean; 
} 

export const ListingPermissionDefaults:ListingPermissions = {
  canManageListings: false,
  isSystemAccount: false,
}

export const SystemPermissions : ListingPermissions = {
  canManageListings: false, //all other permissions explicitly set to false
  isSystemAccount: true,
};