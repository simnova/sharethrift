import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { type FilterQuery, type FlattenMaps, isValidObjectId, type Model, type QueryOptions, type Require_id } from 'mongoose';

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
    findOne(filter: FilterQuery<TDoc>, options?: FindOneOptions): Promise<Lean<TDoc> | null>;
    findById(id: string, options?: FindOneOptions): Promise<Lean<TDoc> | null>;
}

export class MongoDataSourceImpl<TDoc extends MongooseSeedwork.Base> implements MongoDataSource<TDoc> {
    private readonly model: Model<TDoc>;
    constructor(model: Model<TDoc>) {
        this.model = model;
    }

    private buildProjection(fields?: string[] | undefined, projectionMode: 'include' | 'exclude' = "include"): Record<string, 1 | 0> {
        const projection: Record<string, 1 | 0> = {};
        if (fields) {
            for (const key of fields) {
                projection[key] = projectionMode === 'include' ? 1 : 0;
            }
        }
        return projection;
    }

    private buildFilterQuery(filter: FilterQuery<TDoc>): FilterQuery<TDoc> {
        return filter;
    }

    private appendId(doc: LeanBase<TDoc>): Lean<TDoc> {
        return {
            ...doc,
            id: String(doc._id)
        };
    };

    private buildQueryOptions(options?: FindOptions): QueryOptions {
        const findOptions: QueryOptions = {};
        if (options?.limit) { findOptions.limit = options.limit; }
        if (options?.skip) { findOptions.skip = options.skip; }
        if (options?.sort) { findOptions.sort = options.sort; }
        return findOptions;
    }

    async find(filter: FilterQuery<TDoc>, options?: FindOptions): Promise<Lean<TDoc>[]> {
        const queryOptions = this.buildQueryOptions(options);
        const docs = await this.model.find(this.buildFilterQuery(filter), this.buildProjection(options?.fields, options?.projectionMode), queryOptions).lean<LeanBase<TDoc>[]>()
        return docs.map(doc => this.appendId(doc));
    }

    async findOne(filter: FilterQuery<TDoc>, options?: FindOneOptions): Promise<Lean<TDoc> | null> {
        const doc = await this.model.findOne(this.buildFilterQuery(filter), this.buildProjection(options?.fields, options?.projectionMode)).lean<LeanBase<TDoc>>();
        if (options?.populateFields?.length) {
            await doc?.populate(options.populateFields);
        }
        return doc ? this.appendId(doc) : null;
    }

    async findById(id: string, options?: FindOneOptions): Promise<Lean<TDoc> | null> {
        if (!isValidObjectId(id)) { return null };
        const doc = await this.model.findById(id, this.buildProjection(options?.fields, options?.projectionMode)).lean<LeanBase<TDoc>>();
        return doc ? this.appendId(doc) : null;
    }

}