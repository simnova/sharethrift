import { Resolvers } from '../../generated';

export const resolvers : Resolvers = {
  Query: {
    getUser: (parent, args, context, info) => {
      return `Hello world! ${JSON.stringify(args.id)}`;
    }
  }
  
}