export interface PointType {
  _id: string;
  schemaVersion: string;
  type: string;
  /**
   * @description
   * Latitude must be the first coordinate
   */
  coordinates: number[];
}