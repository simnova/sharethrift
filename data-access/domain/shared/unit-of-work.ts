import { Repository } from "./repository";
import { AggregateRoot } from "./aggregate-root";

export interface UnitOfWork<PropType,Root extends AggregateRoot<PropType>, RepoType extends Repository<Root>> {
  withTransaction(func: (repository:RepoType) => Promise<void>): Promise<void>;
}

export abstract class PersistanceUnitOfWork<PropType,Root extends AggregateRoot<PropType>, RepoType extends Repository<Root>> implements UnitOfWork<PropType,Root,RepoType> {
  abstract withTransaction(func: (repository:RepoType) => Promise<void>): Promise<void>;
}