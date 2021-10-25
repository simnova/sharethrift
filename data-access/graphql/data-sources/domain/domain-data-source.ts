import { DataSource,DataSourceConfig } from 'apollo-datasource';
import { MongoUnitOfWork } from '../../../domain/infrastructure/persistance/mongo-unit-of-work';
import { MongoRepositoryBase } from '../../../domain/infrastructure/persistance/mongo-repository';
import { AggregateRoot } from '../../../domain/shared/aggregate-root';
import { EntityProps } from '../../../domain/shared/entity';

export class DomainDataSource<Context,MongoType,PropType extends EntityProps,DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepositoryBase<MongoType,PropType,DomainType>> extends DataSource<Context> {
  private _context: Context;
  
  constructor(private unitOfWork: MongoUnitOfWork<MongoType,PropType,DomainType,RepoType>) { super();}

  public get context(): Context { return this._context;}

  public withTransaction(func:(repo:RepoType) => Promise<void>): Promise<void> {
    return this.unitOfWork.withTransaction((repo:RepoType) => func(repo));
  }

  public initialize(config: DataSourceConfig<Context>): void {
    this._context = config.context;
  }
}