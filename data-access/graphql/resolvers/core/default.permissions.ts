import { ApolloError } from 'apollo-server-azure-functions';
import { shield, deny, allow } from 'graphql-shield';
import { Context } from '../../context';
import { Resolvers } from '../../generated';

const defaultPermissions = shield({
  Location: {
    "*": allow,
  },
  Listing: {
    "*": allow,
  },
  Category: {
    "*": allow,
  },
  Query: {
    "*": allow,
  },
  Mutation: {
    "*": allow
  }
},
{
  allowExternalErrors: true,
  debug:true,
  fallbackRule: allow,
  fallbackError: async (thrownThing, parent, args, context, info) => {
    console.log(`Shield Error: ${thrownThing}`)
    if (thrownThing instanceof ApolloError) {
      // expected errors
      console.error(thrownThing)
      console.log(JSON.stringify(thrownThing));
      return thrownThing
    } else if (thrownThing instanceof Error) {
      // unexpected errors
      console.error(thrownThing)
      console.log(JSON.stringify(thrownThing));
//      await Sentry.report(thrownThing)
      return new ApolloError('Internal server error1', 'ERR_INTERNAL_SERVER')
    } else {
      // what the hell got thrown
      console.error('The resolver threw something that is not an error.')
      console.error(thrownThing)
      return new ApolloError('Internal server error2S', 'ERR_INTERNAL_SERVER')
    }
  }
});

export default defaultPermissions;