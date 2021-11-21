import { Base } from '../../../infrastructure/data-sources/cosmos-db/models/interfaces/base';
import { EntityProps } from '../../shared/entity';
import { PropArray } from '../../shared/prop-array';
import mongoose from 'mongoose';

export abstract class MongooseDomainAdapater<T extends Base> implements MongooseDomainAdapaterType<T>{
  constructor(public readonly props: T) { }
  get id() {return this.props.id;}
  get createdAt() {return this.props.createdAt;}
  get updatedAt() {return this.props.updatedAt;}
  get schemaVersion() {return this.props.schemaVersion;}
}

export interface MongooseDomainAdapaterType<T extends Base> extends EntityProps {
  readonly props: T;
}

export class MongoosePropArray<propType extends EntityProps, docType extends mongoose.Document> implements PropArray<propType> {
  constructor( private docArray:mongoose.Types.DocumentArray<docType> ,private adapter:new(doc:docType)=>propType) {}
  addItem(item: propType): void {
    this.docArray.push(item['props']);
  }
  removeItem(item: propType): void {
    this.docArray.pull(item['props']);
  }
  getNewItem(): propType {
    if(!this.docArray) {
      this.docArray = new mongoose.Types.DocumentArray<docType>([]);
    }
    return new this.adapter(this.docArray.create({_id: new mongoose.Types.ObjectId()}));
  }
  get items(): ReadonlyArray<propType> {
    return this.docArray.map((doc) => new this.adapter(doc));
  }
}