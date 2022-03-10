import { Entity, EntityProps } from './entity';

export interface PropArray<propType extends EntityProps> {
  get items(): ReadonlyArray<propType>;
  addItem(item: propType): propType;
  getNewItem(): propType;
  removeItem(item: propType): void;
}