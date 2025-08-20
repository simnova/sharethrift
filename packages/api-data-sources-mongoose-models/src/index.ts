export * as Models from './models/index.ts';
export { mongooseContextBuilder } from './models/index.ts';

export type MongooseModelsType = ReturnType<typeof import('./models/index.ts').mongooseContextBuilder>;
