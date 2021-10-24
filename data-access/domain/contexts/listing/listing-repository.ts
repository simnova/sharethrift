import {Listing, ListingProps} from './listing';
import { Repository } from '../../shared/repository';

export interface ListingRepository<props extends ListingProps> extends Repository<Listing<props>> {
  delete(id:string): Promise<void>;
}