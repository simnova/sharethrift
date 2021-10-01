
import { isValidObjectId, ObjectId } from 'mongoose';
import * as DTO from '../../../infrastructure/data-sources/cosmos-db/models/category';
import * as Graph from '../types/category';
import * as Domain from '../../../domain/contexts/category';

export const ConvertDtoToGraph = (dto: DTO.Category | ObjectId):Graph.CategoryType | ObjectId => {
  if(dto == null) { return null; }
  if(isValidObjectId(dto.toString())){
    return dto as ObjectId;
  }
  return convertDtoObjectToGraph(dto as DTO.Category);
}

var convertDtoObjectToGraph = (dto: DTO.Category):Graph.CategoryType => {
  var result = new Graph.Category();
  result.id = dto.id;
  result.schemaVersion = dto.schemaVersion;
  result.name = dto.name;
  result.parentId = ConvertDtoToGraph(dto.parentId);
  result.childrenIds = dto.childrenIds?.map(child => ConvertDtoToGraph(child));
  result.createdAt = dto.createdAt;
  result.updatedAt = dto.updatedAt;
  return result;
}

export const ConvertDomainToGraph  = (domain: Domain.Category):Graph.CategoryType => {
  if (domain === null || typeof domain === 'undefined') { return null; }
  var result = new Graph.Category();
  result.id = domain.id;
  result.schemaVersion = domain.schemaVersion;
  result.name = domain.name;
  result.parentId = ConvertDomainToGraph(domain.parentId);
  result.childrenIds = domain.childrenIds?.map(child => ConvertDomainToGraph(child));
  result.createdAt = domain.createdAt;
  result.updatedAt = domain.updatedAt;
  return result;
}
