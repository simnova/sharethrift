import { DataSource,DataSourceConfig } from 'apollo-datasource';
import { MongoUnitOfWork } from '../../../domain/infrastructure/persistance/mongo-unit-of-work';
import { MongoRepository } from '../../../domain/infrastructure/persistance/mongo-repository';
import { AggregateRoot } from '../../../domain/shared/aggregate-root';
import { EntityProps } from '../../../domain/shared/entity';

export class DomainDataSource<Context,MongoType,PropType extends EntityProps,DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepository<MongoType,PropType,DomainType>> extends DataSource<Context> {
  private context: Context;

  constructor(private unitOfWork: MongoUnitOfWork<MongoType,PropType,DomainType,RepoType>) {
    super();
  }

  public withTransaction(func:(repo:RepoType) => Promise<void>): Promise<void> {
    return this.unitOfWork.withTransaction((repo:RepoType) => func(repo));
  }

  public initialize(config: DataSourceConfig<Context>): void {
    this.context = config.context;
  }
}