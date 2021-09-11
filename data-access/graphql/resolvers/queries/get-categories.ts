import { Resolvers } from '../../generated';
import * as GraphQL from '../types/category';
import * as Mongoose from '../../../shared/data-sources/cosmos-db/models/category';

export const getCategories : Resolvers = {
  Query: {
    getCategories : async (parent, args, context, info) => {
      var categoryDto = await context.dataSources.categoryAPI.getCategories()
      return categoryDto.map(convertCategoryDtoToCategoryType);
    }
  }  
}

var convertCategoryDtoToCategoryType = (categoryDto: Mongoose.Category | string):GraphQL.CategoryType => {
  if(categoryDto == null || typeof categoryDto == 'string') {
    return null;
  }
  var result = new GraphQL.Category();
    result._id = categoryDto._id;
    result.schemaVersion = categoryDto.schemaVersion;
    result.name = categoryDto.name;
    result.parentId = categoryDto.parentId;
    result.childrenIds = categoryDto.childrenIds;
    result.createdAt = categoryDto.createdAt;
    result.updatedAt = categoryDto.updatedAt;
  return result;
}