import { rule } from 'graphql-shield'
import { Context } from '../context'

export const isAccountPortalUser = rule()(async (parent, args, context: Context, info) => {
  let result = context.VerifiedUser && context.VerifiedUser.OpenIdConfigKey === 'AccountPortal';
  console.log('isAcountPortalUser', result)
  return result;
})