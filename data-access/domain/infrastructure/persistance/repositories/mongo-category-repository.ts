import { Category as CategoryDO, CategoryProps } from "../../../contexts/category";
import { CategoryRepository } from "../../../contexts/category-repository";
import { Category, CategoryModel }from "../../../../infrastructure/data-sources/cosmos-db/models/category";
import { MongoRepository } from "../mongo-repository";
import { TypeConverter } from "../../../shared/type-converter";
import { ClientSession } from "mongoose";
import { EventBus } from "../../../shared/event-bus";
export class MongoCategoryRepository<PropType extends CategoryProps> extends MongoRepository<Category,PropType,CategoryDO<PropType>> implements CategoryRepository<PropType> {
  constructor(
    eventBus: EventBus,
    modelType: typeof CategoryModel, 
    typeConverter: TypeConverter<Category, CategoryDO<PropType>>,
    session: ClientSession
  ) {
    super(eventBus,modelType,typeConverter,session);
  }

  getNewInstance(): CategoryDO<PropType> {
    return this.typeConverter.toDomain(new CategoryModel());
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }
}