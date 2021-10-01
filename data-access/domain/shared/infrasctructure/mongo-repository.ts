import { Repository } from "../repository";
import { Domain } from "../domain";
import { Model } from "mongoose";
/*
import { Model as MongooseModel } from "mongoose";

export type MongoTypePair<T,U = MongooseModel<T,{},{}>>

export interface MongoTypePair<MongoType,MongoModel extends Model<MongoType,{},{}>> { 
  type: MongoType;
  model: MongoModel;
}
*/

export abstract class MongoRepository<MongoType, DomainType extends Domain> implements Repository<DomainType> {

  constructor(private model : Model<MongoType>, private typeConverter:TypeConverter<MongoType,DomainType>) {
    this.model = model;
  }
  async get(id: string): Promise<DomainType> {
    return this.typeConverter.toDomain(await this.model.findById(id).exec());
  }
  async update(item: DomainType): Promise<void> {
    this.model.updateOne({_id: item.id as any}, this.typeConverter.toMongo(item)).exec();
  }
  async add(item: DomainType): Promise<DomainType> {
    return this.typeConverter.toDomain(await this.model.create(this.typeConverter.toMongo(item)));
  }
}

export interface TypeConverter<MongoType, DomainType> {
  toDomain(mongoType: MongoType): DomainType;
  toMongo(domainType: DomainType): MongoType;
}