import {Account, AccountProps} from './account';
import { Repository } from '../../shared/repository';

export interface AcccountRepository<props extends AccountProps> extends Repository<Account<props>> {
  getByUserId(userId: string): Promise<Account<props>[]>;
}