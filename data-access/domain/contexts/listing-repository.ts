import {Listing} from './listing-aggregate';
import { Repository } from '../shared/repository';

export interface ListingRepository extends Repository<Listing> {
  delete(id:string): Promise<void>;
}