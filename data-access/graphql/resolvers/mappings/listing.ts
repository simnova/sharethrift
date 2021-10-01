import * as DTO from '../../../infrastructure/data-sources/cosmos-db/models/listing';

import { User as UserDto } from '../../../infrastructure/data-sources/cosmos-db/models/user';
import { Category as CategoryDto } from '../../../infrastructure/data-sources/cosmos-db/models/category';

import * as Graph from '../types/Listing';
import * as User from './user';
import * as Category from './category';
import * as Domain from '../../../domain/contexts/listing';

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

export const ConvertDomainToGraph = (domain: Domain.Listing) : Graph.ListingType => {
  return {
    id: domain.id,
    schemaVersion: domain.schemaVersion,
    owner: User.ConvertDomainToGraph(domain.owner),
    title: domain.title,
    description: domain.description,
    primaryCategory: Category.ConvertDomainToGraph(domain.primaryCategory),
    photos: domain.photos,
    location: domain.location,
    updatedAt: domain.updatedAt,
    createdAt: domain.createdAt
  }
}

