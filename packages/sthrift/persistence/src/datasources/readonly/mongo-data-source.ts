import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	type FilterQuery,
	type FlattenMaps,
	isValidObjectId,
	type Model,
	type QueryOptions,
	type Require_id,
} from 'mongoose';

type LeanBase<T> = Readonly<Require_id<FlattenMaps<T>>>;
type Lean<T> = LeanBase<T> & { id: string };

export type FindOptions = {
	fields?: string[] | undefined;
	projectionMode?: 'include' | 'exclude';
	populateFields?: string[] | undefined;
	limit?: number;
	skip?: number;
	sort?: Partial<Record<string, 1 | -1>>;
};

export type FindOneOptions = Omit<FindOptions, 'limit' | 'skip' | 'sort'>;
export interface MongoDataSource<TDoc extends MongooseSeedwork.Base> {
	find(filter: FilterQuery<TDoc>, options?: FindOptions): Promise<Lean<TDoc>[]>;
	findOne(
		filter: FilterQuery<TDoc>,
		options?: FindOneOptions,
	): Promise<Lean<TDoc> | null>;
	findById(id: string, options?: FindOneOptions): Promise<Lean<TDoc> | null>;
}

export class MongoDataSourceImpl<TDoc extends MongooseSeedwork.Base>
	implements MongoDataSource<TDoc>
{
	private readonly model: Model<TDoc>;
	constructor(model: Model<TDoc>) {
		this.model = model;
	}

	private buildProjection(
		fields?: string[] | undefined,
		projectionMode: 'include' | 'exclude' = 'include',
	): Record<string, 1 | 0> {
		const projection: Record<string, 1 | 0> = {};
		if (fields) {
			for (const key of fields) {
				projection[key] = projectionMode === 'include' ? 1 : 0;
			}
		}
		return projection;
	}

	private buildFilterQuery(filter: FilterQuery<TDoc>): FilterQuery<TDoc> {
		// Remove keys with undefined or null values
		return Object.fromEntries(
			Object.entries(filter).filter(([_, v]) => v !== undefined && v !== null),
		) as FilterQuery<TDoc>;
	}

	private appendId(doc: LeanBase<TDoc>): Lean<TDoc> {
		const result: Lean<TDoc> = {
			...doc,
			id: String(doc._id),
		}
		
        // Also append id to any populated subdocuments
		const resultAsRecord = result as Record<string, unknown>;
		for (const key in resultAsRecord) {
			const value = resultAsRecord[key];
			if (value && typeof value === 'object' && '_id' in value && !('id' in value)) {
				resultAsRecord[key] = {
					...(value as Record<string, unknown>),
					id: String((value as { _id: unknown })._id),
				};
			}
		}
		
		return result;
	}

	private buildQueryOptions(options?: FindOptions): QueryOptions {
		const findOptions: QueryOptions = {};
		if (options?.limit) {
			findOptions.limit = options.limit;
		}
		if (options?.skip) {
			findOptions.skip = options.skip;
		}
		if (options?.sort) {
			findOptions.sort = options.sort;
		}
		return findOptions;
	}

	async find(
		filter: FilterQuery<TDoc>,
		options?: FindOptions,
	): Promise<Lean<TDoc>[]> {
		const queryOptions = this.buildQueryOptions(options);
		let query = this.model
			.find(
				this.buildFilterQuery(filter),
				this.buildProjection(options?.fields, options?.projectionMode),
				queryOptions,
			)
			.lean<LeanBase<TDoc>[]>();
		if (options?.populateFields?.length) {
			query = query.populate(options.populateFields);
		}
		const docs = await query;
		return docs.map((doc) => this.appendId(doc));
	}

	async findOne(
		filter: FilterQuery<TDoc>,
		options?: FindOneOptions,
	): Promise<Lean<TDoc> | null> {
		let query = this.model
			.findOne(
				this.buildFilterQuery(filter),
				this.buildProjection(options?.fields, options?.projectionMode),
			)
			.lean<LeanBase<TDoc>>();
		if (options?.populateFields?.length) {
			query = query.populate(options.populateFields);
		}
		const doc = await query;
		return doc ? this.appendId(doc) : null;
	}

	async findById(
		id: string,
		options?: FindOneOptions,
	): Promise<Lean<TDoc> | null> {
		if (!isValidObjectId(id)) {
			return null;
		}
		let query = this.model
			.findById(
				id,
				this.buildProjection(options?.fields, options?.projectionMode),
			);
		
		if (options?.populateFields?.length) {
			for (const field of options.populateFields) {
				query = query.populate(field);
			}
		}
		
		const doc = await query.lean<LeanBase<TDoc>>();
		return doc ? this.appendId(doc) : null;
	}
}
