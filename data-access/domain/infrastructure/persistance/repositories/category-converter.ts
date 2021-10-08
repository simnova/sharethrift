import { Category as CategoryDO } from "../../../contexts/category";
import { Category } from "../../../../infrastructure/data-sources/cosmos-db/models/category";
import { TypeConverter } from "../../../shared/type-converter";
import { CategoryDomainAdapter } from "../adapters/category-domain-adapter";

export class CategoryConverter implements TypeConverter<Category, CategoryDO<CategoryDomainAdapter>> {
  toDomain(mongoType: Category): CategoryDO<CategoryDomainAdapter> {
    return new CategoryDO(new CategoryDomainAdapter(mongoType))
  }
  toMongo(domainType: CategoryDO<CategoryDomainAdapter>): Category {
    return domainType.props.props;
  }
}