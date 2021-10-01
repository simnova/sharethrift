export class Location {
  position:  {
    id: string,
    type: string;
    coordinates: number[];
  } 
  address: {
    streetNumber: string;
    streetName: string;
    municipality: string;
    municipalitySubdivision: string;
    countrySecondarySubdivision: string;
    countryTertiarySubdivision: string;
    countrySubdivision: string;
    countrySubdivisionName: string;
    postalCode: string;
    extendedPostalCode: string;
    countryCode: string;
    country: string;
    countryCodeISO3: string;
    freeformAddress: string;
  }
  id: any
  name: any
  description: any
  city: any
  state: any
  zip: any
  country: any
  latitude: any
  longitude: any
  createdAt: any
  updatedAt: any
}

export interface LocationDetails {
  readonly position:  {
    readonly type: string;
    readonly coordinates: number[];
  } 
  readonly address: {
    readonly streetNumber: string;
    readonly streetName: string;
    readonly municipality: string;
    readonly municipalitySubdivision: string;
    readonly countrySecondarySubdivision: string;
    readonly countryTertiarySubdivision: string;
    readonly countrySubdivision: string;
    readonly countrySubdivisionName: string;
    readonly postalCode: string;
    readonly extendedPostalCode: string;
    readonly countryCode: string;
    readonly country: string;
    readonly countryCodeISO3: string;
    readonly freeformAddress: string;
  }
}
