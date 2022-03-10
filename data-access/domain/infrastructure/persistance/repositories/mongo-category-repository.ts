import { Category as CategoryDO, CategoryProps } from '../../../contexts/listing/category';
import { CategoryRepository } from '../../../contexts/listing/category-repository';
import { Category, CategoryModel }from '../../../../infrastructure/data-sources/cosmos-db/models/category';
import { MongoRepositoryBase } from '../mongo-repository';
import { TypeConverter } from '../../../shared/type-converter';
import { ClientSession } from 'mongoose';
import { EventBus } from '../../../shared/event-bus';
import { DomainExecutionContext } from '../../../contexts/context';

export class MongoCategoryRepository<PropType extends CategoryProps> extends MongoRepositoryBase<DomainExecutionContext,Category,PropType,CategoryDO<PropType>> implements CategoryRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof CategoryModel, 
    typeConverter: TypeConverter<Category, CategoryDO<PropType>,PropType,DomainExecutionContext>,
    session: ClientSession,
    context: DomainExecutionContext
  ) {
    super(eventBus,modelType,typeConverter,session,context);
  }

  getNewInstance(): CategoryDO<PropType> {
    return this.typeConverter.toDomain(new CategoryModel(), this.context);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}