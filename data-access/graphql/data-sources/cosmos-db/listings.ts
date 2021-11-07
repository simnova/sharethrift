import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { Context } from '../../context';

export class Listings extends MongoDataSource<Listing, Context> {

  async getListing(listingId : string): Promise<Listing> {
    console.log(`ListingAPI:getListing:${listingId}`);
    return this.findOneById(listingId);
  }
  
  async getListings(): Promise<Listing[]> {
    var userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
    var user = await this.context.dataSources.userAPI.getByExternalId(userExternalId);
    console.log(`ListingAPI:listings`);
    return this.model
      .find({})
      .exec();
  }
  
}