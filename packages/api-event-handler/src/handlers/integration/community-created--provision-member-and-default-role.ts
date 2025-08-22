import { Domain, type DomainDataSource} from '@sthrift/api-domain';

const { EventBusInstance, CommunityCreatedEvent } = Domain.Events;
export default (
    domainDataSource: DomainDataSource
) => {
  console.log(domainDataSource)
    // EventBusInstance.register(CommunityCreatedEvent, async (payload) => {
    //     const { communityId } = payload;
    //     return await Domain.Services.Community.CommunityProvisioningService.provisionMemberAndDefaultRole(
    //         communityId,
    //         domainDataSource
    //     );
    // });
}