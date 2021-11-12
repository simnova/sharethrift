import { AggregateRoot, RootEventRegistry } from "../../shared/aggregate-root";
import { Category, CategoryEntityReference, CategoryProps } from "./category";
import { Passport } from "../iam/passport";
import { Location, LocationEntityReference, LocationProps } from "./location";
import { Photo, PhotoProps, PhotoEntityReference } from "./photo";
import { ListingPhotoAddedEvent } from "../../events/listing-photo-added";
import { ListingPublishedEvent } from "../../events/listing-published";
import { EntityProps, Entity } from "../../shared/entity";
import { AccountEntityReference } from "../account/account";
import { DraftStatus, DraftStatusProps, NewStatus, DraftStatusCodes, DraftStatusEntityReference } from "./draft-status";
import { Listing } from "./listing";
import { PropArray } from "../../shared/prop-array";

export interface DraftPropValues extends EntityProps {
  title: string;
  description: string;
}

export interface DraftProps extends DraftPropValues {
  location: LocationProps;
 
  primaryCategory: CategoryProps;
  photos: PropArray<PhotoProps>;
  statusHistory: PropArray<DraftStatusProps>;
//  statusHistory: ReadonlyArray<DraftStatusProps>;
//  getNewStatus: () => DraftStatusProps;
//  addStatus: (status: DraftStatusProps) => void;
 // usersCurrentPublishedListingQuantity: () => Promise<number>;
}

export interface DraftEntityReference extends Readonly<DraftPropValues> {
  readonly location?: LocationEntityReference;
  readonly photos?: PhotoEntityReference[];
  readonly primaryCategory?: CategoryEntityReference;
  readonly statusHistory: DraftStatusEntityReference[];
}

export class Draft extends Entity<DraftProps> implements DraftEntityReference {
  constructor(props: DraftProps, private root: RootEventRegistry) { super(props); }

  get title(): string {return this.props.title;}
  get description(): string {return this.props.description;}
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

  private getCurrentStatus():string {
    var currentStatus:string;
    if(!this.props.statusHistory || this.props.statusHistory.items.length==0){
      currentStatus = DraftStatusCodes.Draft;
    }
    else{
      var orderedStatusHistory = [...this.props.statusHistory.items].sort((a,b)=>a.createdAt.getTime()-b.createdAt.getTime());
      currentStatus = orderedStatusHistory[0].statusCode ?? DraftStatusCodes.Draft;
    }
    return currentStatus;
  }
  
  addStatusUpdate(newStatus: NewStatus){
    var currentStatus = this.getCurrentStatus();
   
    if(!this.validStatusTransitions.get(currentStatus).includes(newStatus.statusCode.valueOf())){
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus.statusCode}`);
    }
    
    var statusProps = this.props.statusHistory.getNewItem();
    var status = DraftStatus.create(statusProps,newStatus);
    this.props.statusHistory.addItem(status);
  }

  requestUpdateDescription(description: string){
    this.props.description=description;
  }

  requestAddPhoto(documentId:string, user:Passport){

    if(this.props.photos.items.length>=5){
      throw new Error("Max 5 photos allowed");
    }

    if(this.props.photos.items.find(photo=>photo.documentId == documentId)){
      throw new Error("Photo already exists");
    }

    var newPhoto = Photo.create({
      documentId: documentId,
      order: this.props.photos.items.length + 1,
    });
    this.props.photos.addItem(newPhoto);
    this.root.addDomainEvent(ListingPhotoAddedEvent,newPhoto);
  }

  async requestPublish(){
    
    var publishedQuantity = 5 //;await this.props.usersCurrentPublishedListingQuantity();
    if(publishedQuantity > 5){
      throw new Error("Listing is not valid");
    }
    else{
      this.root.addDomainEvent(ListingPublishedEvent,{listingId: this.props.id});
      this.root.addIntegrationEvent(ListingPublishedEvent,{listingId: this.props.id});
    }

  }
  
  requestAddCategory(category: CategoryProps) {
    this.props.primaryCategory = category;
  }

  requestRemovePhoto(id: string, user: Passport){
    var photoToRemove = this.props.photos.items.find(photo=>photo.id==id);
    if(typeof photoToRemove=="undefined"){
      throw new Error("Photo not found");
    }
    this.props.photos.removeItem(photoToRemove);
  }

}

