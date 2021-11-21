import { AggregateRoot } from "../../shared/aggregate-root";
import { Category, CategoryEntityReference, CategoryProps } from "./category";
import { Passport } from "../iam/passport";
import { Location, LocationEntityReference, LocationProps } from "./location";
import { Photo, PhotoProps, PhotoEntityReference } from "./photo";
import { ListingPhotoAddedEvent } from "../../events/listing-photo-added";
import {ListingPublishedEvent } from "../../events/listing-published";
import { EntityProps } from "../../shared/entity";
import { AccountEntityReference } from "../account/account";
import { Draft, DraftProps } from "./draft";
import { ListingDraftPublishRequestedEvent } from "../../events/listing-draft-publish-requested";

export interface ListingProps extends EntityProps {
  id: string;
  draft: DraftProps;
  getNewDraft(): DraftProps;
  title: string;
  description: string;
  tags: string[];
  location: LocationProps;
  photos: PhotoProps[];
  getAccount(): Promise<AccountEntityReference>;
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
  constructor(props: props) { super(props); }
  
  get draft(): Draft {return new Draft(this.props.draft ?? this.props.getNewDraft(), this);}
  get id(): string {return this.props.id;}
  get title(): string {return this.props.title;}
  get description(): string {return this.props.description;}
  get tags(): string[] {return this.props.tags;}
  get location(): LocationEntityReference {return new Location(this.props.location);}
  get photos(): PhotoEntityReference[] { return this.props.photos.map(photo=>new Photo(photo));} //should be REadOnyArray<PhotoEntityReference> but gen has issues
  async account(): Promise<AccountEntityReference> { return this.props.getAccount();}
  get primaryCategory(): CategoryEntityReference { return new Category(this.props.primaryCategory);}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  static async getNewListing<newPropType extends ListingProps>(props:newPropType,account: AccountEntityReference, passport:Passport): Promise<Listing<newPropType>> {
    let listing = new Listing(props);
    await listing.requestAddAccount(account);
    if(!passport.forListing(listing).determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Cannot add listing');
    }
    return listing;
  }

  requestUpdateDescription(description: string){
    this.props.description=description;
  }

  requestAddPhoto(documentId:string, user:Passport){

    if(this.props.photos.length>=5){
      throw new Error("Max 5 photos allowed");
    }

    if(this.props.photos.find(photo=>photo.documentId == documentId)){
      throw new Error("Photo already exists");
    }

    let newPhoto = Photo.create({
      documentId: documentId,
      order: this.props.photos.length + 1,
    });
    this.props.photos.push(newPhoto);
    this.addDomainEvent(ListingPhotoAddedEvent,newPhoto);
  }

  async publishApprovedDraft(){
    await this.draft.appovePublish();
    this.props.title = this.props.draft.title;
    this.props.description = this.props.draft.description;
    this.props.tags = this.draft.tags;
    //this.props.location = this.props.draft.location;
    //this.props.photos.length = 0;
    //this.props.photos.push(...this.props.draft.photos.items);
   // this.props.primaryCategory = this.props.draft.primaryCategory;
    this.addIntegrationEvent(ListingPublishedEvent,{listingId: this.props.id});
  }

  async requestPublish(){
    await this.draft.requestPublish();
    this.addIntegrationEvent(ListingDraftPublishRequestedEvent,{listingId: this.props.id});
  }
  
  private  async requestAddAccount(account:AccountEntityReference){
    let existingAccount = await this.props.getAccount();
    if(existingAccount){
      throw new Error("Account already exists");
    }
    this.props.setAccount(account);
  }

  requestAddCategory(category: CategoryProps) {
    this.props.primaryCategory = category;
  }

  requestRemovePhoto(id: string, user: Passport){
    let photoToRemove = this.props.photos.find(photo=>photo.id==id);
    if(typeof photoToRemove=="undefined"){
      throw new Error("Photo not found");
    }
    this.props.photos.splice(this.props.photos.indexOf(photoToRemove),1);
  }

}

export interface ListingPermissions {
  canManageListings: boolean;
} 