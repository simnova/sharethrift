import { AggregateRoot } from "../shared/aggregate-root";
import { DomainEvent } from "../shared/domain-event";
import { Category, CategoryEntityReference, CategoryProps } from "./category";
import { Passport } from "./identity-and-access";
import { Location, LocationEntityReference, LocationProps } from "./location";
import { Photo, PhotoProps, PhotoEntityReference } from "./photo";
import { User, UserProps, UserEntityReference } from "./user";
import  { ListingPhotoAddedEvent } from "../events/listing-photo-added";
import {ListingPublishedEvent, ListingPublishedProps} from "../events/listing-published";
import { EntityProps } from "../shared/entity";
import { CategoryDomainAdapter } from "../infrastructure/persistance/adapters/category-domain-adapter";

export interface ListingProps {
  id: string;
  title: string;
  description: string;
  location: LocationProps;
  photos: PhotoProps[];
  owner: UserProps;
  primaryCategory: CategoryProps;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

export class Listing<props extends ListingProps> extends AggregateRoot<props> implements ListingEntityReference {

  constructor(props: props) {super(props);}

  get id(): string {return this.props.id;}
  get title(): string {return this.props.title;}
  get description(): string {return this.props.description;}
  get location(): LocationEntityReference {return new Location(this.props.location);}
  get photos(): PhotoEntityReference[] { return this.props.photos.map(photo=>new Photo(photo));} //should be REadOnyArray<PhotoEntityReference> but gen has issues
  get owner(): UserEntityReference { return new User(this.props.owner);}
  get primaryCategory(): CategoryEntityReference { return new Category(this.props.primaryCategory);}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  //Somthing to consider: https://lostechies.com/jimmybogard/2007/10/24/entity-validation-with-visitors-and-extension-methods/
  // This would allow us to validate the listing before publishing it, using external services.. e.g. check if the user has too many listings alraedy, (e.g. business rule of user can have at max 15 listings)

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
    var newPhoto = Photo.create({
      documentId: documentId,
      order: this.props.photos.length + 1,
    });
    this.props.photos.push(newPhoto);
    this.addDomainEvent(ListingPhotoAddedEvent,newPhoto);
  }
  requestPublish(){
    this.addDomainEvent(ListingPublishedEvent,{listingId: this.props.id});
  }
  requestAddOwner(owner:UserProps){
    this.props.owner = owner;
  }
  requestAddCategory(category: CategoryProps) {
    this.props.primaryCategory = category;
  }

  requestRemovePhoto(id: string, user: Passport){
    var photoToRemove = this.props.photos.find(photo=>photo.id==id);
    if(typeof photoToRemove=="undefined"){
      throw new Error("Photo not found");
    }
    this.props.photos.splice(this.props.photos.indexOf(photoToRemove),1);
  }

}

export interface ListingEntityReference {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly location?: LocationEntityReference;
  readonly photos?: PhotoEntityReference[];
  readonly owner?: UserEntityReference | string;
  readonly primaryCategory?: CategoryEntityReference;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
}