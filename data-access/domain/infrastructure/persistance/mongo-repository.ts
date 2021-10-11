import { Repository } from "../../shared/repository";
import { AggregateRoot } from "../../shared/aggregate-root";
import { Model, ClientSession,Document } from "mongoose";
import { TypeConverter } from "../../shared/type-converter";
import { EntityProps } from "../../shared/entity";
import { EventBus } from "../../shared/event-bus";

export abstract class MongoRepository<MongoType,PropType extends EntityProps,DomainType extends AggregateRoot<PropType>> implements Repository<DomainType> {
  
  constructor(
    protected eventBus: EventBus,
    protected model : Model<MongoType>, 
    protected typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    protected session:ClientSession) {}
  
  async get(id: string): Promise<DomainType> {
    return this.typeConverter.toDomain(await this.model.findById(id,null,{session:this.session}).exec());
  }

  async save(item: DomainType): Promise<DomainType> {
   item.getDomainEvents().forEach(event => this.eventBus.dispatch(event,event['payload']));
   return this.typeConverter.toDomain(await this.typeConverter.toMongo(item).save({session:this.session}));
  }

  static create<MongoType,PropType extends EntityProps, DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepository<MongoType,PropType,DomainType>>(
    bus: EventBus,
    model: Model<MongoType>, 
    typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    session:ClientSession,
    repoClass: new(bus:EventBus,model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) =>RepoType ): RepoType {
      return new repoClass(bus,model,typeConverter,session);
  }
}

export class MongoFactory{
  static create<MongoType,PropType extends EntityProps, DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepository<MongoType,PropType,DomainType>>(
    bus: EventBus,
    model: Model<MongoType>, 
    typeConverter:TypeConverter<Document<MongoType>,DomainType>, 
    session:ClientSession,
    repoClass: new(bus:EventBus, model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) =>RepoType ): RepoType {
      return new repoClass(bus,model,typeConverter,session);
  }
}