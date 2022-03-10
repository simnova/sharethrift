import { Account, AccountProps } from './account';
import { Repository } from '../../shared/repository';
import { DomainExecutionContext } from '../context';

export interface AccountRepository<props extends AccountProps> extends Repository<Account<props>> {
  getByUserId(userId: string,context:DomainExecutionContext): Promise<Account<props>[]>;
  getByHandle(handle: string,context:DomainExecutionContext): Promise<Account<props>>;
}