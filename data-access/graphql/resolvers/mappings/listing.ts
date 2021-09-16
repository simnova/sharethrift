import * as DTO from '../../../shared/data-sources/cosmos-db/models/listing';

import { User as UserDto } from '../../../shared/data-sources/cosmos-db/models/user';
import { Category as CategoryDto } from '../../../shared/data-sources/cosmos-db/models/category';

import * as Graph from '../types/Listing';
import * as User from './user';
import * as Category from './category';

export const ConvertDtoToGraph = (dto: DTO.Listing) : Graph.ListingType => {
  return {
    id: dto.id,
    schemaVersion: dto.schemaVersion,
    owner: User.ConvertDtoToGraph(dto.owner as UserDto),
    title: dto.title,
    description: dto.description,
    primaryCategory: Category.ConvertDtoToGraph(dto.primaryCategory as CategoryDto),
    photos: dto.photos,
    location: dto.location,
    updatedAt: dto.updatedAt,
    createdAt: dto.createdAt
  }
}