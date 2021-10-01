import * as DTO from '../../../infrastructure/data-sources/cosmos-db/models/user';
import * as Graph from '../types/User';
import { isValidObjectId, ObjectId } from 'mongoose';
import * as Domain from '../../../domain/contexts/user'

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

export const ConvertDomainToGraph = (domain: Domain.User | ObjectId) : Graph.UserType | ObjectId => {
  if(domain == null) { return null; }
  if(isValidObjectId(domain.toString())) {
    return domain as ObjectId;
  }
  return convertDomainObjectToGraph(domain as Domain.User);
}

var convertDomainObjectToGraph = (domain: Domain.User):Graph.UserType => {
  return {
    id: domain.id,
    schemaVersion: domain.schemaVersion,
    firstName: domain.firstName,
    lastName: domain.lastName,
    email: domain.email,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt
  }
}