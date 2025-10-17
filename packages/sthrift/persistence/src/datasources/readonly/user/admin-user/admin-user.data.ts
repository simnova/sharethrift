import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Model, Types } from 'mongoose';
import { isValidObjectId } from 'mongoose';
import type { FilterQuery, Require_id, FlattenMaps } from 'mongoose';
import type { FindOptions, FindOneOptions } from '../../mongo-data-source.ts';

type LeanBase<T> = Readonly<Require_id<FlattenMaps<T>>>;
type Lean<T> = LeanBase<T> & { id: Types.ObjectId };

export interface AdminUserDataSource {
	find(filter: FilterQuery<Models.User.AdminUser>, options?: FindOptions): Promise<Lean<Models.User.AdminUser>[]>;
	findOne(filter: FilterQuery<Models.User.AdminUser>, options?: FindOneOptions): Promise<Lean<Models.User.AdminUser> | null>;
	findById(id: string, options?: FindOneOptions): Promise<Lean<Models.User.AdminUser> | null>;
}

export class AdminUserDataSourceImpl implements AdminUserDataSource {
	private readonly model: Model<Models.User.AdminUser>;

	constructor(model: Model<Models.User.AdminUser>) {
		this.model = model;
	}

	private appendId(doc: LeanBase<Models.User.AdminUser>): Lean<Models.User.AdminUser> {
		return {
			...doc,
			id: doc._id as Types.ObjectId,
		};
	}

	async findById(id: string, options?: FindOneOptions): Promise<Lean<Models.User.AdminUser> | null> {
		if (!isValidObjectId(id)) {
			return null;
		}
		
		let query = this.model.findById(id);
		
		const shouldPopulate = options?.populateFields?.includes('role');
		
		if (shouldPopulate) {
			query = query.populate('role');
			// Don't use lean when populating - domain adapters need Mongoose documents
			const doc = await query.exec();
			return doc as unknown as Lean<Models.User.AdminUser>;
		}
		
		const doc = await query.lean<LeanBase<Models.User.AdminUser>>({ defaults: true });
		return doc ? this.appendId(doc) : null;
	}

	async findOne(filter: FilterQuery<Models.User.AdminUser>, options?: FindOneOptions): Promise<Lean<Models.User.AdminUser> | null> {
		let query = this.model.findOne(filter);
		
		const shouldPopulate = options?.populateFields?.includes('role');
		
		if (shouldPopulate) {
			query = query.populate('role');
			const doc = await query.exec();
			return doc as unknown as Lean<Models.User.AdminUser>;
		}
		
		const doc = await query.lean<LeanBase<Models.User.AdminUser>>({ defaults: true });
		return doc ? this.appendId(doc) : null;
	}

	async find(filter: FilterQuery<Models.User.AdminUser>, options?: FindOptions): Promise<Lean<Models.User.AdminUser>[]> {
		let query = this.model.find(filter);
		
		const shouldPopulate = options?.populateFields?.includes('role');
		
		if (shouldPopulate) {
			query = query.populate('role');
		}
		
		if (options?.limit) {
			query = query.limit(options.limit);
		}
		if (options?.skip) {
			query = query.skip(options.skip);
		}
		if (options?.sort) {
			query = query.sort(options.sort as Record<string, 1 | -1>);
		}
		
		if (shouldPopulate) {
			const docs = await query.exec();
			return docs as unknown as Lean<Models.User.AdminUser>[];
		}
		
		const docs = await query.lean<LeanBase<Models.User.AdminUser>[]>({ defaults: true });
		return docs.map((doc) => this.appendId(doc));
	}
}
