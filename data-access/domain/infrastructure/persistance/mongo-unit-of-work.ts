import { PersistanceUnitOfWork } from '../../shared/unit-of-work';
import { AggregateRoot } from '../../shared/aggregate-root';
import mongoose, { ClientSession,Model,Document } from 'mongoose';
import { MongoRepositoryBase } from './mongo-repository';
import { TypeConverter } from '../../shared/type-converter';
import { EntityProps } from '../../shared/entity';
import { EventBus } from '../../shared/event-bus';
import { DomainEvent } from '../../shared/domain-event';
import { ExecutionContext } from '../../shared/execution-context';

export class MongoUnitOfWork<ContextType extends ExecutionContext, MongoType extends Document,PropType extends EntityProps, DomainType  extends AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<ContextType, MongoType,PropType,DomainType> > extends PersistanceUnitOfWork<ContextType,PropType,DomainType,RepoType> {
  async withTransaction(context:ContextType, func: (repository: RepoType) => Promise<void>): Promise<void> {
      let repoEvents: DomainEvent[] = [];
      console.log('withTransaction');
    
      await mongoose.connection.transaction(async (session:ClientSession) => {
        console.log('transaction');
        let repo = MongoRepositoryBase.create(this.bus, this.model, this.typeConverter, session, context, this.repoClass);
        console.log('repo created');
        try {
          await func(repo);
          console.log('func done');
        }
        catch(e) {
          console.log('func failed');
          console.log(e);
          throw e;
        }
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
      private typeConverter : TypeConverter<MongoType,DomainType,PropType, ContextType>,
      private repoClass : {new(bus:EventBus, model:Model<MongoType>,typeConverter:TypeConverter<MongoType,DomainType,PropType,ContextType>,session:ClientSession,context:ContextType) : RepoType}
    ){
      super();
    }
}