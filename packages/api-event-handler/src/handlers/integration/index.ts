import type { DomainDataSource } from '@sthrift/api-domain';
// import RegisterCommunityCreatedProvisionMemberAndDefaultRoleHandler from './community-created--provision-member-and-default-role.ts';

export const RegisterIntegrationEventHandlers = (
    domainDataSource: DomainDataSource
): void => {
  console.log(domainDataSource)
    // RegisterCommunityCreatedProvisionMemberAndDefaultRoleHandler(domainDataSource);
};

