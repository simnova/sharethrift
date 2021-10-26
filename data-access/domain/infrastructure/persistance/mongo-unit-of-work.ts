import { PersistanceUnitOfWork } from "../../shared/unit-of-work";
import { AggregateRoot } from "../../shared/aggregate-root";
import mongoose, {ClientSession,Model,Document} from 'mongoose';
import { MongoRepositoryBase } from "./mongo-repository";
import { TypeConverter } from "../../shared/type-converter";
import { EntityProps } from "../../shared/entity";
import { EventBus } from "../../shared/event-bus";
import { DomainEvent } from "../../shared/domain-event";

export class MongoUnitOfWork<MongoType,PropType extends EntityProps, DomainType  extends AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<MongoType,PropType,DomainType> > extends PersistanceUnitOfWork<PropType,DomainType,RepoType> {
  async withTransaction(func: (repository: RepoType) => Promise<void>): Promise<void> {
      var repoEvents: DomainEvent[] = [];
      console.log('withTransaction');
      await mongoose.connection.transaction(async (session:ClientSession) => {
        console.log('transaction');
        var repo = MongoRepositoryBase.create(this.bus, this.model, this.typeConverter, session, this.repoClass);
        console.log('repo created');
        await func(repo);
        console.log('func done');
        repoEvents = await repo.getIntegrationEvents();
      });
      console.log('integration events');
      //Send integration events after transaction is completed
      for await(let event of repoEvents){
        await this.integrationEventBus.dispatch(event as any,event['payload'])
      }  
  }
  
  constructor(
      private bus : EventBus,
      private integrationEventBus: EventBus,
      private model : Model<MongoType>, 
      private typeConverter : TypeConverter<Document<MongoType>,DomainType>,
      private repoClass : {new(bus:EventBus, model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) : RepoType}
    ){
      super();
    }
}