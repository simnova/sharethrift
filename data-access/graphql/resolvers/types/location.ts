import * as Point from './point';

export interface LocationType {
  id: string;
  position: Point.PointType;
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
}