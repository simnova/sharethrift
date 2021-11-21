import { Repository } from './repository';
import { AggregateRoot } from './aggregate-root';
import { EntityProps } from './entity';

export interface UnitOfWork<PropType extends EntityProps,Root extends AggregateRoot<PropType>, RepoType extends Repository<Root>> {
  withTransaction(func: (repository:RepoType) => Promise<void>): Promise<void>;
}

export abstract class PersistanceUnitOfWork<PropType extends EntityProps,Root extends AggregateRoot<PropType>, RepoType extends Repository<Root>> implements UnitOfWork<PropType,Root,RepoType> {
  abstract withTransaction(func: (repository:RepoType) => Promise<void>): Promise<void>;
}