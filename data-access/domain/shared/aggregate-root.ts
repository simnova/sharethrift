import { Entity } from "./entity";
import { Domain } from "./domain";
export abstract class AggregateRoot<PropType> extends Entity<PropType> implements Domain {
  //todo: add domain events / integration events
  protected _id: string;
  get id(): string {
    return this._id;
  }
}