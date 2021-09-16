import { MongoDataSource } from 'apollo-datasource-mongodb';
import * as Listing from '../../../shared/data-sources/cosmos-db/models/listing';
import {Context} from '../../context';
import {ListingDetail} from '../../generated';

export default class Listings extends MongoDataSource<Listing.Listing, Context> {

  async getListing(listingId : string): Promise<Listing.Listing> {
    var result = await this?.findOneById(listingId);
    console.log("getListing", result);
    return result;
  }

  async getListings(): Promise<Listing.Listing[]> {
    
    return this.model
      .find({})
//      .populate('primaryCategory')
      .exec();
  }

  createListing(listingDetail:ListingDetail): Promise<Listing.Listing> {
    var listing = new this.model(
      {...listingDetail}
    );
    return listing.save();
  }
}