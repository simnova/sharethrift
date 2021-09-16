import {MongoBase} from './interfaces/mongo-base';

export interface PointType extends MongoBase {
  type: string;
  /**
   * @description
   * Latitude must be the first coordinate
   */
  coordinates: number[];
}