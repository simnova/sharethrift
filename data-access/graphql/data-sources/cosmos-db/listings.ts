import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Listing from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import {Context} from '../../context';
import {ListingDetail} from '../../generated';
import { ListingDomainAdapter } from '../../../domain/infrastructure/persistance/adapters/listing-domain-adapter';
import { ListingEntityReference } from '../../../domain/contexts/listing';

export default class Listings extends MongoDataSource<Listing.Listing, Context> {

  async getListing(listingId : string): Promise<ListingEntityReference> {
    console.log(`ListingAPI:getListing:${listingId}`);
    return new ListingDomainAdapter(await this.findOneById(listingId));
  }
  
  async getListings(): Promise<ListingEntityReference[]> {
    console.log(`ListingAPI:listings`);
    var result = (await this.model
      .find({})
      .populate('owner')
    ///  .populate('primaryCategory')
      .exec()).map(listing => new ListingDomainAdapter(listing));
    console.log(JSON.stringify(result));
    return result;
  }
/*
  createListing(listingDetail:ListingDetail): Promise<Listing.Listing> {
    var listing = new this.model(
      {...listingDetail}
    );
    return listing.save();
  }
  */
}