import { Entity, EntityProps } from "./entity";

export interface PropArray<propType extends EntityProps, domainType extends Entity<propType>> {
  get items(): ReadonlyArray<propType>;
  addItem(item: domainType): void;
  removeItem(item: domainType): void;
}