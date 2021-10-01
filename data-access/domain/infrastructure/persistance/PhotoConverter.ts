import { Photo as PhotoDO } from "../../contexts/photo";
import { Photo } from "../../../infrastructure/data-sources/cosmos-db/models/listing";
import { TypeConverter } from "../../shared/infrasctructure/mongo-repository";

export class PhotoConverter implements TypeConverter<Photo, PhotoDO> {
  toDomain(mongoType: Photo): PhotoDO {
    return {
      id: mongoType.id,
      order: mongoType.order,
      documentId: mongoType.documentId,
      isMarkedForDeletion: false,
    };
  }
  toMongo(domainType: PhotoDO): Photo {
    return {
      id: domainType.id,
      order: domainType.order,
      documentId: domainType.documentId
    } as Photo;
  }
}
