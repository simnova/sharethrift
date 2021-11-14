import { rule } from 'graphql-shield'
import { Context } from '../context'

export const isAccountPortalUser = rule()(async (parent, args, ctx: Context, info) => {
  let result = ctx.VerifiedUser && ctx.VerifiedUser.OpenIdConfigKey === 'AccountPortal';
  console.log('isAcountPortalUser', result)
  return result;
})