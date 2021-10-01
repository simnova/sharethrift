import { AggregateRoot } from "../shared/aggregate-root";
import { Domain } from "../shared/domain";
import { Category,CategoryDetails } from "./category";
import { Passport } from "./identity-and-access";
import { Location, LocationDetails } from "./location";
import { Photo, PhotoDetails, NewPhoto } from "./photo";
import { User, UserDetails } from "./user";


export interface ListingProps {
  id: string;
  title: string;
  description: string;
  location: Location;
  photos: Photo[];
  owner: User;
  primaryCategory: Category;
}

export class Listing  implements Domain, ListingDetails, AggregateRoot {
  id: string;
  title: string;
  description: string;
  location: Location;
  photos: Photo[];
  owner: User;
  primaryCategory: Category;
  schemaVersion: string;
  updatedAt: Date;
  createdAt: Date;

  

  constructor(props: ListingProps) {
    this.id=props.id;
    this.title = props.title;
    this.description = props.description;
    this.location = props.location;
    this.photos = props.photos;
    this.owner = props.owner;
    this.primaryCategory = props.primaryCategory
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

  requestCreateNewListing(listing: Listing, user: Passport): Promise<Listing> {
    throw new Error("Method not implemented.");
  }

}

export interface ListingDetails {
  readonly id: string;
  readonly owner: UserDetails;
  readonly title: string;
  readonly description: string;
  readonly location: LocationDetails;
  readonly primaryCategory: CategoryDetails;
  readonly photos: PhotoDetails[];

  requestAddPhoto(newPhoto:NewPhoto, user:Passport): void;
  requestRemovePhoto(id: string, user: Passport): void;
  requestCreateNewListing(listing: Listing, user: Passport): Promise<ListingDetails>;

}