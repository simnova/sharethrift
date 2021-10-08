import { Entity } from "./entity";
import { Domain } from "./domain";


export abstract class AggregateRoot<PropType> extends Entity<PropType>  {
  //todo: add domain events / integration events

}