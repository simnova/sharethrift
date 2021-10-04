import { Listing } from '../../../domain/contexts/listing-aggregate';
import { MongoListingRepository } from '../../../domain/infrastructure/persistance/mongo-listing-repository';
import {Context} from '../../context';
import { ListingDetail } from '../../generated';
import { DomainDataSource } from './domain-data-source';

export default class Listings extends DomainDataSource<Listing, MongoListingRepository, Context> {
  updateListing(listing: ListingDetail) {
    this.repository.update(listing as Listing);
  }
  async addListing(listing: ListingDetail) : Promise<Listing> {
    //If there are conversions between GraphQL Types and domain types, it should happen here
    return this.repository.add(listing as Listing);
  }
  
}