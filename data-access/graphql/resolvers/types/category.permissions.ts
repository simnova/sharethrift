import { shield, allow } from 'graphql-shield';
import * as permissions from '../../middleware/permission-middleware';

const categoryPermissions = shield({
  Category: allow,
 
  Query: {
    category: allow,
    categories: allow,
  },
  Mutation: {
    createCategory: permissions.isAccountPortalUser,
    updateCategory: permissions.isAccountPortalUser
  }
});

export default categoryPermissions;