import { Schema, model, Model } from 'mongoose';
import * as Point from './point';

export interface LocationType {
  _id: string;
  schemaVersion: string,
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

export const LocationModel = model<LocationType>('Location', new Schema<LocationType, Model<LocationType>, LocationType>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    position: Point.PointModel.schema,
    address: {
      streetNumber: {
        type: String,
        required: true,
      },
      streetName: {
        type: String,
        required: true,
      },
      municipality: {
        type: String,
        required: true,
      },
      municipalitySubdivision: {
        type: String,
        required: true,
      },
      countrySecondarySubdivision: {
        type: String,
        required: true,
      },
      countryTertiarySubdivision: {
        type: String,
        required: true,
      },
      countrySubdivision: {
        type: String,
        required: true,
      },
      countrySubdivisionName: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      extendedPostalCode: {
        type: String,
        required: true,
      },
      countryCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      countryCodeISO3: {
        type: String,
        required: true,
      },
      freeformAddress: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true, 
    versionKey: true, 
    collection: 'locations',
  }
));