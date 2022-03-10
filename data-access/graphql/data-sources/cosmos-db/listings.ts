import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Listing } from '../../../infrastructure/data-sources/cosmos-db/models/listing';
import { Context } from '../../context';

export class Listings extends MongoDataSource<Listing, Context> {

  async getListing(listingId : string): Promise<Listing> {
    console.log(`ListingAPI:getListing:${listingId}`);
    return this.findOneById(listingId);
  }
  
  async getListings(): Promise<Listing[]> {
    let userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
    let user = await this.context.dataSources.userAPI.getByExternalId(userExternalId);
    console.log(`ListingAPI:listings`);
    return this.model
      .find({})
      .exec();
  }

  async getListingsForAccount(accountId : string): Promise<Listing[]> {
    console.log(`ListingAPI:getListingsForAccount`);
    let userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
    let user = await this.context.dataSources.userAPI.getByExternalId(userExternalId);
    let account = await this.context.dataSources.accountAPI.getAccount(accountId);
    if(account && account.contacts.some(c => c.user.toString() === user._id.toString())){
    return this.findByFields({account: accountId});
    }
    return null;
  }

  async getListingsByAccountHandle(handle : string): Promise<Listing[]> {
    console.log(`ListingAPI:getListingsForAccount`);
    try {
      let userExternalId = this.context.VerifiedUser.VerifiedJWT.sub;
      let user = await this.context.dataSources.userAPI.getByExternalId(userExternalId);
      let account = await this.context.dataSources.accountAPI.getAccountByHandle(handle);
      if(account && account.contacts.some(c => c.user.toString() === user._id.toString())){
        return (await this.findByFields({account: account.id}));
      }
    } catch (error) {
      console.log(error);
    
      
    }

    return null;
  }
}