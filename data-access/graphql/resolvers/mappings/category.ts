import * as DTO from '../../../shared/data-sources/cosmos-db/models/category';
import * as Graph from '../types/category';

export const ConvertDtoToGraph = (dto: DTO.Category | string):Graph.CategoryType => {
  if(dto == null || typeof dto == 'string') {
    return null;
  }
  var result = new Graph.Category();
    result.id = dto.id;
    result.schemaVersion = dto.schemaVersion;
    result.name = dto.name;
    result.parentId = ConvertDtoToGraph(dto.parentId);
    result.childrenIds = dto.childrenIds.map(child => ConvertDtoToGraph(child));
    result.createdAt = dto.createdAt;
    result.updatedAt = dto.updatedAt;
  return result;
}