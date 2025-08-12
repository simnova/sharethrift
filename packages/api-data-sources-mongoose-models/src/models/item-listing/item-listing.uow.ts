import {
	type ItemListingUnitOfWork,
	type ItemListingRepository,
} from '@ocom/api-domain';
import { ItemListingRepositoryImpl } from './item-listing.repository.ts';

export class ItemListingUnitOfWorkImpl<PassportType>
	implements ItemListingUnitOfWork<PassportType>
{
	public readonly itemListingRepository: ItemListingRepository<PassportType>;
	private readonly mongoUnitOfWork: any; // Use any for now to avoid generic complexity

	constructor(
		itemListingModel: any,
		createPassport: () => PassportType,
		mongoUnitOfWork: any,
	) {
		this.itemListingRepository = new ItemListingRepositoryImpl(
			itemListingModel,
			createPassport,
		);
		this.mongoUnitOfWork = mongoUnitOfWork;
	}

	async withTransaction<T>(
		func: (uow: ItemListingUnitOfWork<PassportType>) => Promise<T>,
	): Promise<T> {
		return this.mongoUnitOfWork.withTransaction(async () => {
			return func(this);
		});
	}
}