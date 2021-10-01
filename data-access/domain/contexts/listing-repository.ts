import {Listing} from './listing';
import { Repository } from '../shared/repository';

export interface ListingRepository extends Repository<Listing> {
  delete(id:string): Promise<void>;
}