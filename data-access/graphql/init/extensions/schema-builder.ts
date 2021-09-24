import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema, mergeSchemas, makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '../../resolvers';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import * as Scalars from 'graphql-scalars';

const schema = loadSchemaSync('./graphql.schema.json', {
  loaders: [new JsonFileLoader()],
});

const appSchema = addResolversToSchema(schema,resolvers)

const scalarSchema = makeExecutableSchema({
  typeDefs:[
    ...Scalars.typeDefs,
  ],
  resolvers:{
    ...Scalars.resolvers,
  }
});

export const combinedSchema = mergeSchemas({
  schemas: [
    appSchema,
    scalarSchema,
  ]
});