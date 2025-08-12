import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain, DomainDataSource } from '@ocom/api-domain';

export const Persistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
	domainServices: Domain.Services,
): DomainDataSource => {
	// [NN] [ESLINT] disabling the ESLint rule here to ensure that the initializedService is checked for null or undefined
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}
	console.log(domainServices);
	const dataSource: DomainDataSource = {
		domainContexts: null,
	};
	return dataSource;
};
