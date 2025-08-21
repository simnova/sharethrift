import type { ListingRequestVisa } from './request.visa.ts';

export interface ListingRequestPassport {
	forListingRequest(root: object): ListingRequestVisa;
}