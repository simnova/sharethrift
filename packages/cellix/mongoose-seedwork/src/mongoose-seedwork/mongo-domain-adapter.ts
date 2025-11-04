import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Base } from './base.ts';
import { ObjectId } from 'mongodb';

export interface MongooseDomainAdapterType<T extends Base>
	extends DomainSeedwork.DomainEntityProps {
	readonly doc: T;
}

export abstract class MongooseDomainAdapter<T extends Base>
	implements MongooseDomainAdapterType<T>
{
	public readonly doc: T;
	constructor(doc: T) {
		this.doc = doc;
	}
	get id() {
		return this.doc.id.toString();
	}
	get createdAt() {
		return this.doc.createdAt;
	}
	get updatedAt() {
		return this.doc.updatedAt;
	}
	get schemaVersion() {
		return this.doc.schemaVersion;
	}

	/**
	 * Convenience, non-breaking helper to obtain a reference ObjectId from a
	 * domain adapter instance, a mongoose document-like object, or an object
	 * that contains an `id` or `_id` property. This does not change any
	 * existing public API and is protected for use by subclasses.
	 */
	protected refFromDoc(doc: unknown): ObjectId {
			// Narrow the incoming `doc` into a discriminated shape to avoid `any`.
			type DocLike =
				| { doc?: { _id?: ObjectId } | null; _id?: ObjectId; id?: string }
				| { _id?: ObjectId; id?: string };
			const d = doc as DocLike;
			if (!d) {
			throw new Error('ref: missing document');
		}
		// If adapter-like object with `.doc` (our MongooseDomainAdapter instances)
				if ('doc' in d && d.doc && d.doc._id) {
					return d.doc._id as ObjectId;
				}
		// If object already has _id (Mongoose document or plain object)
		if (d._id) {
			return d._id as ObjectId;
		}
		// If object has id (could be string or ObjectId-like)
		if (d.id) {
			return new ObjectId(d.id.toString());
		}
		throw new Error('ref: document does not contain id or _id');
	}

	/**
	 * Generic helper method to handle reference fields (getter/setter).
	 * Reduces duplication in domain adapters for populated references.
	 *
	 * Getter usage: protected ref<TAdapter>(field: string, Adapter: new (doc: unknown) => TAdapter): TAdapter
	 * Setter usage: protected ref<TAdapter>(field: string, Adapter: new (doc: unknown) => TAdapter, value: TAdapter | { id?: string }): void
	 */
	protected ref<TAdapter>(
		field: string,
		// biome-ignore lint/suspicious/noExplicitAny: Generic adapter constructor needs flexible type
		Adapter: new (doc: any) => TAdapter,
	): TAdapter;
	protected ref<TAdapter>(
		field: string,
		// biome-ignore lint/suspicious/noExplicitAny: Generic adapter constructor needs flexible type
		Adapter: new (doc: any) => TAdapter,
		value: TAdapter | { id?: string },
	): void;
	protected ref<TAdapter>(
		field: string,
		// biome-ignore lint/suspicious/noExplicitAny: Generic adapter constructor needs flexible type
		Adapter: new (doc: any) => TAdapter,
		value?: TAdapter | { id?: string },
	): TAdapter | undefined {
		// Setter case (value is provided)
		if (value !== undefined) {
			if (value instanceof Adapter) {
				// Value is already an adapter instance, extract the doc
				this.doc.set(field, (value as MongooseDomainAdapterType<Base>).doc);
				return;
			}
			// Value is a reference object with id
			const refValue = value as { id?: string };
			if (!refValue?.id) {
				throw new Error(`${field} reference is missing id`);
			}
			this.doc.set(field, new ObjectId(refValue.id));
			return;
		}

		// Getter case
		// biome-ignore lint/suspicious/noExplicitAny: Dynamic field access on Mongoose document
		const val = (this.doc as any)[field];
		if (!val) {
			throw new Error(`${field} is not populated`);
		}
		if (val instanceof ObjectId) {
			throw new Error(
				`${field} is not populated or is not of the correct type`,
			);
		}
		return new Adapter(val);
	}
}
