import * as DTO from '../../../shared/data-sources/cosmos-db/models/user';
import * as Graph from '../types/User';
import { isValidObjectId, ObjectId } from 'mongoose';

export const ConvertDtoToGraph = (dto: DTO.User | ObjectId) : Graph.UserType | ObjectId => {
  if(dto == null) { return null; }
  if(isValidObjectId(dto.toString())) {
    return dto as ObjectId;
  }
  return convertDtoObjectToGraph(dto as DTO.User);
}

var convertDtoObjectToGraph = (dto: DTO.User):Graph.UserType => {
  return {
    id: dto.id,
    schemaVersion: dto.schemaVersion,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
  }
}