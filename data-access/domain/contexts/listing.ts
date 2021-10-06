import { AggregateRoot } from "../shared/aggregate-root";
import { Domain } from "../shared/domain";
import { Entity } from "../shared/entity";
import { Category,CategoryDetails } from "./category";
import { Passport } from "./identity-and-access";
import { Location, LocationDetails } from "./location";
import { Photo, PhotoDetails, NewPhoto } from "./photo";
import { User, UserDetails } from "./user";


export interface ListingProps {
  id?: string;
  title: string;
  description: string;
  location: Location;
  photos: Photo[];
  owner: User;
  primaryCategory: Category;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}
export class Listing<props extends ListingProps> extends AggregateRoot<props>  {
  private ownerProp: User ;

 
  get title(): string {
    return this.props.title;
  }
  get description(): string {
    return this.props.description;
  }
  get location(): Location {
    return this.props.location;
  }
  get photos(): Photo[] {
    return this.props.photos;
  }
  get owner(): User {
    return this.props.owner; //is this mutatable and link back to this.props.owner?
  }
  get primaryCategory(): Category {
    return this.props.primaryCategory;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get schemaVersion(): string {
    return this.props.schemaVersion;
  }
  
  constructor(props: props) {
    super(props);
    this._id = props.id;
    this.ownerProp = new User(props.owner);
  }
  requestUpdateDescription(description: string){
    this.props.description=description;
  }
  requestAddPhoto(newPhoto:NewPhoto, user:Passport){
    if(this.photos.length>=5){
      throw new Error("Max 5 photos allowed");
    }
    if(this.photos.find(photo=>photo.documentId==newPhoto.documentId)){
      throw new Error("Photo already exists");
    }
    throw new Error("Method not implemented.");
    //Add DomainEvent - photoAdded
  }

  requestRemovePhoto(id: string, user: Passport){
    var photoToRemove = this.photos.find(photo=>photo.id==id);
    if(typeof photoToRemove=="undefined"){
      throw new Error("Photo not found");
    }
    if(photoToRemove.isMarkedForDeletion){
      throw new Error("Photo already marked for deletion")
    }
    photoToRemove.isMarkedForDeletion=true;
  }

  requestCreateNewListing(listing: this, user: Passport): Promise<this> {
    throw new Error("Method not implemented.");
  }

}