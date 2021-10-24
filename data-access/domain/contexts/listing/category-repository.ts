import {Category, CategoryProps} from './category';
import { Repository } from '../../shared/repository';

export interface CategoryRepository<props extends CategoryProps> extends Repository<Category<props>> {
  delete(id:string): Promise<void>;
}