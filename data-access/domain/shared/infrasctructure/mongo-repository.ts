import { Repository } from "../repository";
import { AggregateRoot } from "../aggregate-root";
import { Model, ClientSession,Document } from "mongoose";

export abstract class MongoRepository<MongoType,PropType,DomainType extends AggregateRoot<PropType>> implements Repository<DomainType> {
  constructor(
    protected model : Model<MongoType>, 
    protected typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    protected session:ClientSession) {}
  
  async get(id: string): Promise<DomainType> {
    return this.typeConverter.toDomain(await this.model.findById(id,null,{session:this.session}).exec());
  }

  async save(item: DomainType): Promise<DomainType> {
   return this.typeConverter.toDomain(await this.typeConverter.toMongo(item).save({session:this.session}));
  }

  static create<MongoType,PropType, DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepository<MongoType,PropType,DomainType>>(
    model: Model<MongoType>, 
    typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    session:ClientSession,
    repoClass: new(model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) =>RepoType ): RepoType {
      return new repoClass(model,typeConverter,session);
  }
}

export class MongoFactory{
  static create<MongoType,PropType, DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepository<MongoType,PropType,DomainType>>(
    model: Model<MongoType>, 
    typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    session:ClientSession,
    repoClass: new(model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) =>RepoType ): RepoType {
      return new repoClass(model,typeConverter,session);
  }
}

export interface TypeConverter<MongoType, DomainType> {
  toDomain(mongoType: MongoType): DomainType;
  toMongo(domainType: DomainType): MongoType;
}