import { DataSource,DataSourceConfig } from 'apollo-datasource';
import { MongoUnitOfWork } from '../../../domain/infrastructure/persistance/mongo-unit-of-work';
import { MongoRepositoryBase } from '../../../domain/infrastructure/persistance/mongo-repository';
import { AggregateRoot } from '../../../domain/shared/aggregate-root';
import { EntityProps } from '../../../domain/shared/entity';
import { Document } from 'mongoose';
import { DomainExecutionContext } from '../../../domain/contexts/context';
import { getPassport } from './domain-data-utils';
import { Context as GraphQLContext } from '../../context';

export class DomainDataSource<Context extends GraphQLContext,MongoType extends Document,PropType extends EntityProps,DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<DomainExecutionContext, MongoType,PropType,DomainType>> extends DataSource<Context> {
  private _context: Context;
  
  constructor(private unitOfWork: MongoUnitOfWork<DomainExecutionContext,MongoType,PropType,DomainType,RepoType>) { super();}

  public get context(): Context { return this._context;}

  public async withTransaction(func:(repo:RepoType) => Promise<void>): Promise<void> {
    const executionContext:DomainExecutionContext = {
      passport: await getPassport(this.context),
    }
    
    return this.unitOfWork.withTransaction(executionContext,(repo:RepoType) => func(repo));
  }

  public initialize(config: DataSourceConfig<Context>): void {
    this._context = config.context;    
  }
  
}