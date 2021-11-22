import { Schema, model, Model } from 'mongoose';
import { Base, BaseOptions } from './interfaces/base';

/**
 * @description
 * Point model - used to store lat/long coordinates
 */
export interface Point extends Base {
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
    ...BaseOptions,
  }
));