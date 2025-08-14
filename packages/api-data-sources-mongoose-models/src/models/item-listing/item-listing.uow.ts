import type {
	ItemListingUnitOfWork,
	ItemListingRepository,
    ItemListingProps,
	Passport,
} from '@ocom/api-domain';
import { ItemListingRepositoryImpl } from './item-listing.repository.ts';

export class ItemListingUnitOfWorkImpl implements ItemListingUnitOfWork {
	public readonly itemListingRepository: ItemListingRepository<ItemListingProps>;
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

	withTransaction<TReturn>(
		_passport: Passport,
		func: (repository: ItemListingRepository<ItemListingProps>) => Promise<TReturn>,
	): Promise<TReturn> {
		return this.mongoUnitOfWork.withTransaction(() => {
			return func(this.itemListingRepository);
		});
	}
}