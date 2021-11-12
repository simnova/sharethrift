import { Base } from "../../../infrastructure/data-sources/cosmos-db/models/interfaces/base";
import { Entity, EntityProps } from "../../shared/entity";
import { PropArray } from "../../shared/prop-array";
import mongoose from "mongoose";

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

export class getPropArray {
  getPropArray<propType extends EntityProps, domainType extends Entity<propType>, docType extends mongoose.Document>(docArray:mongoose.Types.DocumentArray<docType>,adapter:new(doc:docType)=>propType) : PropArray<propType,domainType> {
    var mixin = new MongoosePropArrayMixIn(docArray,adapter);
    var result = mixin.items;
    result.prototype.addItem = mixin.addItem;
    result.prototype.removeItem = mixin.removeItem;
  }

  }
}
class MongoosePropArrayMixIn<propType extends EntityProps, domainType extends Entity<propType>, docType extends mongoose.Document>  {
  constructor(private docArray:mongoose.Types.DocumentArray<docType>,private adapter:new(doc:docType)=>propType) {}
  addItem(item: domainType): void {
    this.docArray.push(item.props);
  }
  removeItem(item: domainType): void {
    this.docArray.pull(item.props);
  }
  get items(): ReadonlyArray<propType> {
    return this.docArray.map((doc) => new this.adapter(doc));
  }
}

export class MongoosePropArray<propType extends EntityProps, domainType extends Entity<propType>, docType extends mongoose.Document> implements PropArray<propType, domainType> {
  constructor(private docArray:mongoose.Types.DocumentArray<docType>,private adapter:new(doc:docType)=>propType) {}
  addItem(item: domainType): void {
    this.docArray.push(item.props);
  }
  removeItem(item: domainType): void {
    this.docArray.pull(item.props);
  }
  get items(): ReadonlyArray<propType> {
    return this.docArray.map((doc) => new this.adapter(doc));
  }
}