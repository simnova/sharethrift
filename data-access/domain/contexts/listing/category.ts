import { AggregateRoot } from '../../shared/aggregate-root';
import { PropArray } from '../../shared/prop-array';

export interface CategoryProps {
  id:string;
  name: string;
  path: string;
  parentId: CategoryProps;
  childrenIds: PropArray<CategoryProps>;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}
export class Category<props extends CategoryProps> extends AggregateRoot<props> implements CategoryEntityReference{
  constructor(props: props) { super(props); }

  get id(): string {return this.props.id;}
  get name(): string {return this.props.name;}
  get path(): string {return this.props.path;}
  get parentId(): CategoryEntityReference {return new Category(this.props.parentId)}
  get childrenIds(): CategoryEntityReference[] {return this.props.childrenIds.items.map((category) => new Category(category));}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  set name(name: string) {this.props.name = name;}

  setParentId(parentId: CategoryProps) {
    this.props.parentId = parentId;  
    this.props.path = parentId.path ? parentId.path + '/' + this.id : this.id;
  }
  addChildId(childId: CategoryProps) {
    console.log('addChildId',JSON.stringify(childId));
    this.props.childrenIds.addItem(childId);
  }
}

export interface CategoryEntityReference {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  readonly parentId: CategoryEntityReference | string;
  readonly childrenIds: CategoryEntityReference[] | string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
}