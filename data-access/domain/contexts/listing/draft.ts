import { RootEventRegistry } from '../../shared/aggregate-root';
import { Category, CategoryEntityReference, CategoryProps } from './category';
import { Passport } from '../iam/passport';
import { Location, LocationEntityReference, LocationProps } from './location';
import { Photo, PhotoProps, PhotoEntityReference } from './photo';
import { ListingPhotoAddedEvent } from '../../events/listing-photo-added';
import { EntityProps, Entity } from '../../shared/entity';
import { DraftStatus, DraftStatusProps, NewStatus, DraftStatusCodes, DraftStatusEntityReference } from './draft-status';
import { PropArray } from '../../shared/prop-array';
import { Description, Title, Tags } from './listing-value-objects';

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
  constructor(props: DraftProps, private root: RootEventRegistry) { super(props); }

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

  private getCurrentStatus():string {
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
  
  addStatusUpdate(newStatus: NewStatus){
    let currentStatus = this.getCurrentStatus();
   
    if(!this.validStatusTransitions.get(currentStatus).includes(newStatus.statusCode.valueOf())){
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus.statusCode}`);
    }
    
    let statusProps = this.props.statusHistory.getNewItem();
    let status = DraftStatus.create(statusProps,newStatus);
    console.log('-=-=-=--=+==--=-= ADDDING NEW STATUS ', JSON.stringify(status));
    this.props.statusHistory.addItem(status.props);
  }
  requestUpdateTitle(title: Title) {
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update title unless in draft status');
    }
    this.props.title = title.valueOf();
  }

  requestUpdateDescription(description: Description){
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update description unless in draft status');
    }
    this.props.description=description.valueOf();
  }

  requestUpdateTags(tags: Tags){
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update tags unless in draft status');
    }
    this.props.tags = tags.valueOf();
  }

  requestAddPhoto(documentId:string, user:Passport){
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update photos unless in draft status');
    }

    if(this.props.photos.items.length>=5){
      throw new Error('Max 5 photos allowed');
    }

    if(this.props.photos.items.find(photo=>photo.documentId == documentId)){
      throw new Error('Photo already exists');
    }

    let newPhoto = Photo.create({
      documentId: documentId,
      order: this.props.photos.items.length + 1,
    });
    this.props.photos.addItem(newPhoto);
    this.root.addDomainEvent(ListingPhotoAddedEvent,newPhoto);
  }

  async rejectPublish(rejectionReason: string){
    this.addStatusUpdate(new NewStatus(DraftStatusCodes.Rejected, rejectionReason));
  }
  async appovePublish(){
    this.addStatusUpdate(new NewStatus(DraftStatusCodes.Approved));
  }
  

  async requestPublish() : Promise<void>{ 
    this.addStatusUpdate(new NewStatus(DraftStatusCodes.Pending, 'Draft publish requested'));
    
    let publishedQuantity = 5 //;await this.props.usersCurrentPublishedListingQuantity();
    if(publishedQuantity > 5){
      throw new Error('Listing is not valid');
    }

  }
  
  requestAddCategory(category: CategoryProps) {
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot update category unless in draft status');
    }

    this.props.primaryCategory = category;
  }

  requestRemovePhoto(id: string, user: Passport){
    if(this.getCurrentStatus()!=DraftStatusCodes.Draft){
      throw new Error('Cannot remote photos unless in draft status');
    }

    let photoToRemove = this.props.photos.items.find(photo=>photo.id==id);
    if(typeof photoToRemove=='undefined'){
      throw new Error('Photo not found');
    }
    this.props.photos.removeItem(photoToRemove);
  }

}