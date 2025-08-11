import { AggregateRoot } from '@cellix/domain-seedwork/src/domain-seedwork/aggregate-root.ts';
import type { PassportType } from '../passport.ts';
import {
	type Category,
	type Description,
	type ListingState,
	ListingStateEnum,
	type Location,
	type Title,
} from './item-listing.value-objects.ts';
import type { DomainEntityProps } from '@cellix/domain-seedwork/src/domain-seedwork/domain-entity.ts';

export interface ItemListingProps extends DomainEntityProps {
	readonly sharer: string; // User ID who created the listing
	readonly title: Title;
	readonly description: Description;
	readonly category: Category;
	readonly location: Location;
	readonly sharingPeriodStart: Date;
	readonly sharingPeriodEnd: Date;
	readonly state: ListingState;
	readonly updatedAt?: Date;
	readonly createdAt?: Date;
	readonly sharingHistory?: string[]; // Array of reservation/sharing IDs
	readonly reports?: number;
}

export interface ItemListingEntityReference {
	readonly id: string;
}

export class ItemListing extends AggregateRoot<ItemListingProps, PassportType> {
	get sharer(): string {
		return this.props.sharer;
	}

	get title(): Title {
		return this.props.title;
	}

	get description(): Description {
		return this.props.description;
	}

	get category(): Category {
		return this.props.category;
	}

	get location(): Location {
		return this.props.location;
	}

	get sharingPeriodStart(): Date {
		return this.props.sharingPeriodStart;
	}

	get sharingPeriodEnd(): Date {
		return this.props.sharingPeriodEnd;
	}

	get state(): ListingState {
		return this.props.state;
	}

	get updatedAt(): Date | undefined {
		return this.props.updatedAt;
	}

	get createdAt(): Date | undefined {
		return this.props.createdAt;
	}

	get sharingHistory(): readonly string[] {
		return this.props.sharingHistory ?? [];
	}

	get reports(): number {
		return this.props.reports ?? 0;
	}

	/**
	 * Determines if this listing is visible to regular users
	 */
	get isActive(): boolean {
		return this.props.state.valueOf() === ListingStateEnum.Published;
	}

	/**
	 * Determines if the current user can edit this listing
	 */
	canEdit(userId: string): boolean {
		return this.props.sharer === userId;
	}

	/**
	 * Gets a formatted date range string for display
	 */
	get dateRange(): string {
		const startDate = this.sharingPeriodStart.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		const endDate = this.sharingPeriodEnd.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		});
		return `${startDate} → ${endDate}`;
	}

	/**
	 * Gets the location in a display-friendly format
	 */
	get displayLocation(): string {
		return this.location.cityState;
	}

	/**
	 * Create a reference to this entity for use in other contexts
	 */
	getEntityReference(): ItemListingEntityReference {
		return {
			id: this.props.id,
		};
	}
}