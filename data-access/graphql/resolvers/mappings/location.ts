import * as Domain from '../../../domain/contexts/location';
import * as Graph from '../types/location';

export const ConvertDomainToGraphQL = (domain: Domain.Location): Graph.LocationType => {
    return {
        position: domain.position,
        address: domain.address,
    };
}