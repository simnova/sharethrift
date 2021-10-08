import { Location } from "../../../../infrastructure/data-sources/cosmos-db/models/location";
import { LocationProps } from "../../../contexts/location";
import { MongooseDomainAdapater } from "../mongo-domain-adapter";

export class LocationDomainAdapter extends MongooseDomainAdapater<Location> implements LocationProps {
  constructor(props: Location) {super(props);}
  get position(){
    if(!this.props || !this.props.position) return null;
    return{
      get type(){return this.props.position.type},
      set type(value){this.props.position.type = value},
      get coordinates(){return this.props.position.coordinates},
      set coordinates(value){this.props.position.coordinates = value}
    }
  }
  get address() {
    if(!this.props || !this.props.address) return null;
    return {
      get streetNumber(): string { return this.props.address.streetNumber; },
      set streetNumber(value: string) { this.props.address.streetNumber = value; },
      get streetName(): string { return this.props.address.streetName; },
      set streetName(value: string) { this.props.address.streetName = value; },
      get municipality(): string { return this.props.address.municipality; },
      set municipality(value: string) { this.props.address.municipality = value; },
      get municipalitySubdivision(): string { return this.props.address.municipalitySubdivision; },
      set municipalitySubdivision(value: string) { this.props.address.municipalitySubdivision = value; },
      get countrySecondarySubdivision(): string { return this.props.address.countrySecondarySubdivision; },
      set countrySecondarySubdivision(value: string) { this.props.address.countrySecondarySubdivision = value; },
      get countryTertiarySubdivision(): string { return this.props.address.countryTertiarySubdivision; },
      set countryTertiarySubdivision(value: string) { this.props.address.countryTertiarySubdivision = value; },
      get countrySubdivision(): string { return this.props.address.countrySubdivision; },
      set countrySubdivision(value: string) { this.props.address.countrySubdivision = value; },
      get countrySubdivisionName(): string { return this.props.address.countrySubdivisionName; },
      set countrySubdivisionName(value: string) { this.props.address.countrySubdivisionName = value; },
      get postalCode(): string { return this.props.address.postalCode; },
      set postalCode(value: string) { this.props.address.postalCode = value; },
      get extendedPostalCode(): string { return this.props.address.extendedPostalCode; },
      set extendedPostalCode(value: string) { this.props.address.extendedPostalCode = value; },
      get countryCode(): string { return this.props.address.countryCode; },
      set countryCode(value: string) { this.props.address.countryCode = value; },
      get country(): string { return this.props.address.countr; },
      set country(value: string) { this.props.address.country = value; },
      get countryCodeISO3(): string { return this.props.address.countryCodeISO3; },
      set countryCodeISO3(value: string) { this.props.address.countryCodeISO3 = value; },
      get freeformAddress(): string { return this.props.address.freeformAddress; },
      set freeformAddress(value: string) { this.props.address.freeformAddress = value; }
    }
  }
}