import type {
	ItemListingUnitOfWork,
	ItemListingRepository,
    ItemListingProps,
	Passport,
} from '@ocom/api-domain';
import { ItemListingRepositoryImpl } from './item-listing.repository.ts';

export class ItemListingUnitOfWorkImpl<PassportType extends ItemListingProps>
	implements ItemListingUnitOfWork<PassportType>
{
	public readonly itemListingRepository: ItemListingRepository<PassportType>;
	// biome-ignore lint/suspicious/noExplicitAny: Required for mongoose unit of work interface
	private readonly mongoUnitOfWork: any; // Use any for now to avoid generic complexity

	constructor(
		// biome-ignore lint/suspicious/noExplicitAny: Required for mongoose model interface
		itemListingModel: any,
		createPassport: () => Passport,
		// biome-ignore lint/suspicious/noExplicitAny: Required for mongoose unit of work interface
		mongoUnitOfWork: any,
	) {
		this.itemListingRepository = new ItemListingRepositoryImpl(
			itemListingModel,
			createPassport,
		);
		this.mongoUnitOfWork = mongoUnitOfWork;
	}

	withTransaction<T>(
		func: (uow: ItemListingUnitOfWork<PassportType>) => Promise<T>,
	): Promise<T> {
		return this.mongoUnitOfWork.withTransaction(() => {
			return func(this);
		});
	}
}