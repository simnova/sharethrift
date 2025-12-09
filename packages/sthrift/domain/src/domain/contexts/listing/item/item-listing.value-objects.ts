import { VOString } from '@lucaspaganini/value-objects';

/**
 * Enumeration of possible listing states
 */
export const ListingStateEnum = {
	Published: 'Published',
	Paused: 'Paused',
	Cancelled: 'Cancelled',
	Draft: 'Draft',
	Expired: 'Expired',
	Blocked: 'Blocked',
} as const;

export class ListingState extends VOString({
	trim: true,
	minLength: 0,
	maxLength: 50,
}) {
	static Published = new ListingState(ListingStateEnum.Published);
	static Paused = new ListingState(ListingStateEnum.Paused);
	static Cancelled = new ListingState(ListingStateEnum.Cancelled);
	static Draft = new ListingState(ListingStateEnum.Draft);
	static Expired = new ListingState(ListingStateEnum.Expired);
	static Blocked = new ListingState(ListingStateEnum.Blocked);

	get isActive(): boolean {
		return this.valueOf() === ListingStateEnum.Published;
	}
}

/**
 * Item categories for filtering and organization
 */
export class Category extends VOString({
	trim: true,
	minLength: 0,
	maxLength: 100,
}) {
	static ToolsEquipment = new Category('Tools & Equipment');
	static Electronics = new Category('Electronics');
	static SportsOutdoors = new Category('Sports & Outdoors');
	static HomeGarden = new Category('Home & Garden');
	static PartyEvents = new Category('Party & Events');
	static VehiclesTransportation = new Category('Vehicles & Transportation');
	static KidsBaby = new Category('Kids & Baby');
	static BooksMedia = new Category('Books & Media');
	static ClothingAccessories = new Category('Clothing & Accessories');
	static Miscellaneous = new Category('Miscellaneous');
}

/**
 * Location information for listings
 */
export class Location extends VOString({
	trim: true,
	minLength: 0,
	maxLength: 255,
}) {
	get cityState(): string {
		// For now, return the value as-is. In the future, this could parse
		// and format city/state information
		return this.valueOf();
	}
}

/**
 * Listing title
 */
export class Title extends VOString({
	trim: true,
	minLength: 0,
	maxLength: 200,
}) {}

/**
 * Listing description
 */
export class Description extends VOString({
	trim: true,
	minLength: 0,
	maxLength: 2000,
}) {}
