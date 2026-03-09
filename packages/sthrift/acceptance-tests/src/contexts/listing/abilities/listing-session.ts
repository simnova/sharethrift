export interface ListingDetails {
	title: string;
	description: string;
	category: string;
	location: string;
	dailyRate?: string;
	weeklyRate?: string;
	deposit?: string;
	tags?: string;
}

export interface CreateItemListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
	isDraft?: boolean;
}

export interface ItemListing {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	state: 'draft' | 'published';
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images: string[];
}
