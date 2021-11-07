import { shield } from 'graphql-shield';
import * as permissions from '../../middleware/permission-middleware';

const accountPermissions = shield({
  Query: {
    accounts: permissions.isAccountPortalUser,
  }
});

export default accountPermissions;