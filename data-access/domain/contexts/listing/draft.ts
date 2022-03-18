import { RootEventRegistry } from '../../shared/aggregate-root';
import { Category, CategoryEntityReference, CategoryProps } from './category';
import { Location, LocationEntityReference, LocationProps } from './location';
import { Photo, PhotoProps, PhotoEntityReference } from './photo';
import { ListingPhotoAddedEvent } from '../../events/listing-photo-added';
import { EntityProps, Entity } from '../../shared/entity';
import { DraftStatus, DraftStatusProps, NewStatus, DraftStatusCodes, DraftStatusEntityReference } from './draft-status';
import { PropArray } from '../../shared/prop-array';
import { Description, Title, Tags } from './listing-value-objects';
import { ListingVisa } from "../iam/listing-visa";
import { ListingPhotoDeletedEvent } from '../../events/listing-photo-deleted';
import { ListingDraftPublishRequestedEvent } from "../../events/listing-draft-publish-requested";

export interface DraftPropValues extends EntityProps {
  title: string;
  description: string;
  tags: string[];
}

export interface DraftProps extends DraftPropValues {
  location: LocationProps;
  primaryCategory: CategoryProps;
  photos: PropArray<PhotoProps>;
  statusHistory: PropArray<DraftStatusProps>;

 // usersCurrentPublishedListingQuantity: () => Promise<number>;
}

export interface DraftEntityReference extends Readonly<DraftPropValues> {
  readonly location?: LocationEntityReference;
  readonly photos?: PhotoEntityReference[];
  readonly primaryCategory?: CategoryEntityReference;
  readonly statusHistory: DraftStatusEntityReference[];
}

export class Draft extends Entity<DraftProps> implements DraftEntityReference {
  constructor(
    props: DraftProps, 
    private root: RootEventRegistry & {photos: PhotoEntityReference[], id: string},
    private visa: ListingVisa
    
    ) { super(props); }

  get title(): string {return this.props.title;}
  get description(): string {return this.props.description;}
  get tags(): string[] {return this.props.tags;}
  get location(): LocationEntityReference {return new Location(this.props.location);}
  get photos(): PhotoEntityReference[] { return this.props.photos.items.map(photo=>new Photo(photo));} //should be REadOnyArray<PhotoEntityReference> but gen has issues
  get statusHistory(): DraftStatusEntityReference[] { return this.props.statusHistory.items.map(status => new DraftStatus(status));}
  get primaryCategory(): CategoryEntityReference { return new Category(this.props.primaryCategory);}

  private readonly validStatusTransitions = new Map<string,string[]>([ 
    [DraftStatusCodes.Draft,[DraftStatusCodes.Pending]],
    [DraftStatusCodes.Pending,[DraftStatusCodes.Draft, DraftStatusCodes.Approved, DraftStatusCodes.Rejected]],
    [DraftStatusCodes.Approved,[]],
    [DraftStatusCodes.Rejected, [DraftStatusCodes.Draft]],
  ]);

  public getCurrentStatus():string {
    let currentStatus:string;
    if(!this.props.statusHistory || this.props.statusHistory.items.length==0){
      currentStatus = DraftStatusCodes.Draft;
    }
    else{
      let orderedStatusHistory = [...this.props.statusHistory.items];
      orderedStatusHistory.sort((a,b)=>
        {
          let aTime = a.createdAt.getTime();
          let bTime = b.createdAt.getTime();
          if(bTime > aTime){
            return 1;
          }else if(bTime < aTime){
            return -1;
          }else{
            return 0;
          }
          // sort dates descending      
      });
      currentStatus = orderedStatusHistory[0].statusCode ?? DraftStatusCodes.Draft;
    }
    return currentStatus;
  }
  
  private addStatusUpdate(newStatus: NewStatus){
    let currentStatus = this.getCurrentStatus();
   
    if(!this.validStatusTransitions.get(currentStatus).includes(newStatus.statusCode.valueOf())){
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus.statusCode}`);
    }
    
    let statusProps = this.props.statusHistory.getNewItem();
    let status = DraftStatus.create(statusProps,newStatus);
    console.log('-=-=-=--=+==--=-= ADDDING NEW STATUS ', JSON.stringify(status));
    this.props.statusHistory.addItem(status.props);
  }

  public async requestUpdateTitle(title: Title): Promise<void> {
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update title unless in draft status');
    }
    this.props.title = title.valueOf();
  }

  public async requestUpdateDescription(description: Description) : Promise<void>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update description unless in draft status');
    }
    this.props.description=description.valueOf();
  }

  public async requestUpdateTags(tags: Tags) : Promise<void>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update tags unless in draft status');
    }
    this.props.tags = tags.valueOf();
  }

  public async requestAddCategory(category: CategoryProps) : Promise<void>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update category unless in draft status');
    }
    this.props.primaryCategory = category;
  }

  public async requestAddPhoto(order:number) : Promise<PhotoEntityReference>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update photos unless in draft status');
    }
    var createNewDocumentId:boolean
    var currentPhoto = this.props.photos.items.find(photo=>photo.order==order);
    if(order>5 || order<=0){
      throw new Error('Max 5 photos allowed');
    }

    if(!currentPhoto){ //draft does not have photo in this slot
      createNewDocumentId = true;
    }else{
      if(this.root.photos.find(photo=>photo.documentId==currentPhoto.documentId)){ // root already has photo, so don't overwrite it
        createNewDocumentId = true;
      }else {
        createNewDocumentId = false; //draft has photo in this slot, but root does not have this photo at all, so it's ok to overwrite it
      }
    } 

    if(!currentPhoto){
      currentPhoto = this.props.photos.getNewItem();
      currentPhoto.order = order;
      currentPhoto.documentId = currentPhoto.getNewDocumentId();
      this.props.photos.addItem(currentPhoto);
    } else if (createNewDocumentId){
      currentPhoto.documentId = currentPhoto.getNewDocumentId();
    }
    this.root.addDomainEvent(ListingPhotoAddedEvent,currentPhoto);
    return new Photo(currentPhoto);
  }
  
  public async requestRemovePhoto(order: number) : Promise<void>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot remote photos unless in draft status');
    }

    let photoToRemove = this.props.photos.items.find(photo=>photo.order==order);
    if(typeof photoToRemove=='undefined'){
      throw new Error('Photo not found');
    }

    if(!this.root.photos.find(photo=>photo.documentId==photoToRemove.documentId)){ //root does not have photo, so can remove it
      this.root.addIntegrationEvent(ListingPhotoDeletedEvent,{documentId:photoToRemove.documentId});
    }
    this.props.photos.removeItem(photoToRemove);
  }

  async requestPublish() : Promise<void>{ 
    if(!await this.visa.determineIf((permissions) => permissions.canManageListings)) {
      throw new Error('Listing > Draft > Request Publish > Permission denied');
    }
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot request publish unless in draft status');
    }
    if(this.photos.length==0){
      throw new Error('Cannot request publish without photos');
    }

    this.addStatusUpdate(new NewStatus(DraftStatusCodes.Pending, 'Draft publish requested'));
    
    let publishedQuantity = 5 //;await this.props.usersCurrentPublishedListingQuantity();
    if(publishedQuantity > 5){
      throw new Error('Listing is not valid');
    }
    this.root.addIntegrationEvent(ListingDraftPublishRequestedEvent,{listingId: this.root.id});
  }

  async rejectPublish(rejectionReason: string){
    if(!await this.visa.determineIf((permissions) => permissions.isSystemAccount)) {
      throw new Error('Listing > Draft > Reject Publisn > Permission denied');
    }
    this.addStatusUpdate(new NewStatus(DraftStatusCodes.Rejected, rejectionReason));
  }

  async appovePublish(){
    if(!await this.visa.determineIf((permissions) => permissions.isSystemAccount)) {
      throw new Error('Listing > Draft > Approve Publish > Permission denied');
    }
    this.addStatusUpdate(new NewStatus(DraftStatusCodes.Approved));
  }
  
}