import {  Document, SchemaOptions } from 'mongoose';

 export interface MongoBase {
  id?: any;
  schemaVersion: string;
  createdAt?: Date;
  updatedAt?: Date;
  version: number;
}

/**
 * This _should not_ extend document, but because of this issue we're stuck: https://github.com/GraphQLGuide/apollo-datasource-mongodb/issues/78
 * 
 * Can also change type to "any" in the data source but loose type safety
 */
export interface Base extends Document,MongoBase  {
}

export const BaseOptions : SchemaOptions = {
  timestamps: true, 
  versionKey: 'version', 
}
