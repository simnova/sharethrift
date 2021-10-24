import { Category as CategoryDO, CategoryEntityReference, CategoryProps } from '../../../domain/contexts/listing/category';
import {CategoryDomainAdapter}from '../../../domain/infrastructure/persistance/adapters/category-domain-adapter';
import { MongoCategoryRepository } from '../../../domain/infrastructure/persistance/repositories/mongo-category-repository';
import {Context} from '../../context';
import { CategoryDetail } from '../../generated';
import { DomainDataSource } from './domain-data-source';
import { Category } from '../../../infrastructure/data-sources/cosmos-db/models/category';

type PropType = CategoryDomainAdapter;
type DomainType = CategoryDO<PropType>;
type RepoType = MongoCategoryRepository<PropType>;
export default class Categorys extends DomainDataSource<Context,Category,PropType,DomainType,RepoType> {
  async updateCategory(category: CategoryDetail) {
    this.withTransaction(async (repo) => {
      let domainObject =await repo.get("somide");
      //.(category.description);
      repo.save(domainObject);
    });
  }
  async addCategory(category: CategoryDetail) : Promise<CategoryEntityReference> {
    //If there are conversions between GraphQL Types and domain types, it should happen here
    var result : CategoryEntityReference;
    await this.withTransaction(async (repo) => {
      var domainObject = repo.getNewInstance();
      domainObject.name = category.name;
    //  domainObject.requestUpdateDescription(category.description);
      result = await repo.save(domainObject);
    });
    return result;
  }
}