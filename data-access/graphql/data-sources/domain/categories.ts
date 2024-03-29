import { Category as CategoryDO } from '../../../domain/contexts/listing/category';
import {CategoryDomainAdapter, CategoryConverter}from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { MongoCategoryRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-category-repository';
import {Context} from '../../context';
import { CategoryDetail, UpdateCategory } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Category } from '../../../infrastructure/data-sources/cosmos-db/models/category';

type PropType = CategoryDomainAdapter;
type DomainType = CategoryDO<PropType>;
type RepoType = MongoCategoryRepository<PropType>;

export class Categories extends DomainDataSource<Context,Category,PropType,DomainType,RepoType> {

  async updateCategory(category: UpdateCategory): Promise<Category> {
    let result : Category;
    this.withTransaction(async (repo) => {
      let domainObject =await repo.get(category.id);
      result = (new CategoryConverter()).toMongo(await repo.save(domainObject));
    });
    return result;
  }

  async addCategory(category: CategoryDetail) : Promise<Category> {
    let result : Category;
    await this.withTransaction(async (repo) => {
      
      const domainObject = repo.getNewInstance();
      domainObject.name = category.name;
      if(category.parentId) {
        let parent = await repo.get(category.parentId);
        domainObject.setParentId(repo.typeConverter.toAdapter(parent));
        result = repo.typeConverter.toMongo(await repo.save(domainObject));
        parent.addChildId(repo.typeConverter.toAdapter(domainObject));
        await repo.save(parent);
      } else {
        result = repo.typeConverter.toMongo(await repo.save(domainObject));
      }
    });
    return result;
  }
}