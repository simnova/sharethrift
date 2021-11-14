import { User, UserProps } from './user';
import { Repository } from '../../shared/repository';

export interface UserRepository<props extends UserProps> extends Repository<User<props>> {
  delete(id:string): Promise<void>;
  getByExternalId(externalId:string): Promise<User<props>>;
}