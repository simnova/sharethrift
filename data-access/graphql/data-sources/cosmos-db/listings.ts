import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Listing from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import {Context} from '../../context';
import {ListingDetail} from '../../generated';

export default class Listings extends MongoDataSource<Listing.Listing, Context> {

  async getListing(listingId : string): Promise<Listing.Listing> {
    console.log(`ListingAPI:getListing:${listingId}`);
    return this?.findOneById(listingId);
  }
  
  async getListings(): Promise<Listing.Listing[]> {
    console.log(`ListingAPI:listings`);
    var result = this.model
      .find({})
      .populate('owner')
    ///  .populate('primaryCategory')
      .exec();
    console.log(JSON.stringify(await result));
    return result;
  }

  createListing(listingDetail:ListingDetail): Promise<Listing.Listing> {
    var listing = new this.model(
      {...listingDetail}
    );
    return listing.save();
  }
  
}