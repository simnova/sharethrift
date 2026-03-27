export interface ListingNotes {
	lastListingId: string;
	lastListingTitle: string;
	lastListingStatus: string;
	lastValidationError: string;
}

export interface ListingDetails {
	title: string;
	description: string;
	category: string;
	location: string;
	dailyRate?: string;
	weeklyRate?: string;
	deposit?: string;
	tags?: string;
	isDraft?: boolean | string;
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

export interface ItemListingResponse {
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
