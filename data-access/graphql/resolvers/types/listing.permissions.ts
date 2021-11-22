import { shield, allow } from 'graphql-shield';
import * as permissions from '../../middleware/permission-middleware';

const accountPermissions = shield({
  Listing: allow,
 
  Query: {
    listing: allow,
    listings: allow,
  },
  Mutation: {
    createListing: permissions.isAccountPortalUser,
    updateDraft: permissions.isAccountPortalUser,
    publishDraft: permissions.isAccountPortalUser,
  }
});

export default accountPermissions;