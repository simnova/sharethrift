import type { Domain } from '@sthrift/domain';
import type {
	FindOneOptions,
	FindOptions,
	MongoDataSource,
} from './mongo-data-source.ts';
import type { FilterQuery } from 'mongoose';
import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';

/**
 * Interface for converters that transform documents to domain entities
 */
export interface DomainConverter<TDoc, TEntity> {
	toDomain(doc: TDoc | Record<string, unknown>, passport: Domain.Passport): TEntity;
}

/**
 * Base class for read repositories that provides common query helper methods
 * to reduce duplication across repository implementations
 */
export abstract class BaseReadRepository<TDoc extends MongooseSeedwork.Base, TEntity> {
	protected readonly mongoDataSource: MongoDataSource<TDoc>;
	protected readonly converter: DomainConverter<TDoc, TEntity>;
	protected readonly passport: Domain.Passport;

	constructor(
		mongoDataSource: MongoDataSource<TDoc>,
		converter: DomainConverter<TDoc, TEntity>,
		passport: Domain.Passport,
	) {
		this.mongoDataSource = mongoDataSource;
		this.converter = converter;
		this.passport = passport;
	}

	/**
	 * Helper method for querying multiple documents
	 */
	protected async queryMany(
		filter: FilterQuery<TDoc>,
		options?: FindOptions,
	): Promise<TEntity[]> {
		const docs = await this.mongoDataSource.find(filter, options);
		return docs.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	/**
	 * Helper method for querying a single document
	 */
	protected async queryOne(
		filter: FilterQuery<TDoc>,
		options?: FindOneOptions,
	): Promise<TEntity | null> {
		const doc = await this.mongoDataSource.findOne(filter, options);
		return doc ? this.converter.toDomain(doc, this.passport) : null;
	}

	/**
	 * Helper method for querying by ID
	 */
	protected async queryById(
		id: string,
		options?: FindOneOptions,
	): Promise<TEntity | null> {
		const doc = await this.mongoDataSource.findById(id, options);
		return doc ? this.converter.toDomain(doc, this.passport) : null;
	}
}
