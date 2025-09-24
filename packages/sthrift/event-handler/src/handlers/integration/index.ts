import type { DomainDataSource } from '@sthrift/domain';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
): void => {
	console.log(domainDataSource);
};
