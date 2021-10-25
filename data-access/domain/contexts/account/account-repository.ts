import {Account, AccountProps} from './account';
import { Repository } from '../../shared/repository';

export interface AccountRepository<props extends AccountProps> extends Repository<Account<props>> {
  getByUserId(userId: string): Promise<Account<props>[]>;
}