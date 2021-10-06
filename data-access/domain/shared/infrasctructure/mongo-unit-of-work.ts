import { PersistanceUnitOfWork } from "../unit-of-work";
import { AggregateRoot } from "../aggregate-root";
import mongoose, {ClientSession,Model,Document} from 'mongoose';
import { MongoRepository, TypeConverter } from "./mongo-repository";

export class MongoUnitOfWork<MongoType,PropType,DomainType extends AggregateRoot<PropType>, RepoType extends MongoRepository<MongoType,PropType,DomainType>  > extends PersistanceUnitOfWork<PropType,DomainType,RepoType> {
  withTransaction(func: (repository: RepoType) => Promise<void>): Promise<void> {
    return mongoose.connection.transaction((session:ClientSession) => {
      var repo = MongoRepository.create(this.model, this.typeConverter, session, this.repoClass);
      return func(repo);
    });
  }
  constructor(
      private model : Model<MongoType>, 
      private typeConverter : TypeConverter<Document<MongoType>,DomainType>,
      private repoClass : {new(model:Model<MongoType>,typeConverter:TypeConverter<Document<MongoType>,DomainType>,session:ClientSession) : RepoType}
    ){
      super();
    }
}