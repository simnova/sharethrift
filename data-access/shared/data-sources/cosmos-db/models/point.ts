import { Schema, model, Model } from 'mongoose';

/**
 * @description
 * Point model - used to store lat/long coordinates
 */
export interface Point {
  _id: string;
  schemaVersion: string;
  type: string;
  /**
   * @description
   * Latitude must be the first coordinate
   */
  coordinates: number[];
}

export const PointModel = model<Point>('Point', new Schema<Point, Model<Point>, Point>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  {
    timestamps: true, 
    versionKey: true, 
    collection: 'points',
  }
));

