import * as DTO from '../../../shared/data-sources/cosmos-db/models/user';
import * as Graph from '../types/User';

export const ConvertDtoToGraph = (dto: DTO.User) : Graph.UserType => {
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