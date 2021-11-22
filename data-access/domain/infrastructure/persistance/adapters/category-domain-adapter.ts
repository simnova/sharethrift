import { Category } from '../../../../infrastructure/data-sources/cosmos-db/models/category';
import { Category as CategoryDO, CategoryProps } from '../../../contexts/listing/category';
import { MongooseDomainAdapater, MongoosePropArray } from '../mongo-domain-adapter';

import { MongoTypeConverter } from '../mongo-type-converter';

export class CategoryConverter extends MongoTypeConverter<Category,CategoryDomainAdapter,CategoryDO<CategoryDomainAdapter>> {
  constructor() {
    super(CategoryDomainAdapter, CategoryDO);
  }
}

export class CategoryDomainAdapter extends MongooseDomainAdapater<Category> implements CategoryProps {
  constructor(props: Category) { super(props); }

  get name(): string { return this.props.name; }
  set name(value: string) { this.props.name = value; }

  get path(): string { return this.props.path; }
  set path(value: string) { this.props.path = value; }

  get parentId(): CategoryDomainAdapter { return new CategoryDomainAdapter(this.props.parentId); }
  set parentId(value: CategoryDomainAdapter) { this.props.parentId = value.props; }

  public childrenIds = new MongoosePropArray(this.props.childrenIds, CategoryDomainAdapter);
}