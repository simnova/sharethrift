import type { DomainDataSource } from '@sthrift/api-domain';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
): void => {
	console.log(domainDataSource);
};
