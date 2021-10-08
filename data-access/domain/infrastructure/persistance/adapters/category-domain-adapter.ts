import { Category } from "../../../../infrastructure/data-sources/cosmos-db/models/category";
import { CategoryProps } from "../../../contexts/category";
import { MongooseDomainAdapater } from "../mongo-domain-adapter";

export class CategoryDomainAdapter extends MongooseDomainAdapater<Category> implements CategoryProps {
  constructor(props: Category) { super(props); }

  get name(): string { return this.props.name; }
  set name(value: string) { this.props.name = value; }

  get path(): string { return this.props.path; }
  set path(value: string) { this.props.path = value; }

  get parentId(): CategoryDomainAdapter { return new CategoryDomainAdapter(this.props.parentId); }
  set parentId(value: CategoryDomainAdapter) { this.props.parentId = value.props; }

  get childrenIds(): CategoryDomainAdapter[] { return this.props.childrenIds.map((child) => new CategoryDomainAdapter(child)); }
  set childrenIds(value: CategoryDomainAdapter[]) { this.props.childrenIds = value.map(x => x.props); }
}