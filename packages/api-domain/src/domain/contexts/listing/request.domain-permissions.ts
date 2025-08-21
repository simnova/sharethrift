export interface ListingRequestDomainPermissions {
	canCreateListingRequest: boolean;
	canUpdateListingRequest: boolean;
	canDeleteListingRequest: boolean;
	canViewListingRequest: boolean;
	canManageListingRequest: boolean; // Accept/reject requests (for listing owner)
	canCancelListingRequest: boolean; // Cancel own requests
}