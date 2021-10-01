import { DataSource,DataSourceConfig } from 'apollo-datasource';
import { Context } from '../../context';


export class DomainDataSource<AggregateRoot,Repository,Context> extends DataSource<Context> {
  private readonly domainRepository: Repository;
  private context: Context;

  constructor(domainRepository: Repository) {
    super();
    this.domainRepository = domainRepository;
  }

  get repository(): Repository {
    return this.domainRepository;
  }

  public initialize(config: DataSourceConfig<Context>): void {
    this.context = config.context;
  }

}
