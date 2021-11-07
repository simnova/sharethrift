import { ApolloError } from 'apollo-server-azure-functions';
import { shield, deny } from 'graphql-shield';
import { Context } from '../../context';
import { Resolvers } from '../../generated';

const defaultPermissions = shield<Resolvers,Context>({
  Mutation: {
    "*": deny
  }
},
{
  fallbackError: async (thrownThing, parent, args, context, info) => {
    if (thrownThing instanceof ApolloError) {
      // expected errors
      return thrownThing
    } else if (thrownThing instanceof Error) {
      // unexpected errors
      console.error(thrownThing)
//      await Sentry.report(thrownThing)
      return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
    } else {
      // what the hell got thrown
      console.error('The resolver threw something that is not an error.')
      console.error(thrownThing)
      return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
    }
  }
});

export default defaultPermissions;