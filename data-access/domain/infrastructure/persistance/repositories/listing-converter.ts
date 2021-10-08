import { Listing as ListingDO } from "../../../contexts/listing";
import { Listing } from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { TypeConverter } from "../../../shared/type-converter";
import { ListingDomainAdapter } from "../adapters/listing-domain-adapter";

export class ListingConverter implements TypeConverter<Listing, ListingDO<ListingDomainAdapter>> {
  toDomain(mongoType: Listing): ListingDO<ListingDomainAdapter> {
    return new ListingDO(new ListingDomainAdapter(mongoType))
  }
  toMongo(domainType: ListingDO<ListingDomainAdapter>): Listing {
    return domainType.props.props;
  }
}