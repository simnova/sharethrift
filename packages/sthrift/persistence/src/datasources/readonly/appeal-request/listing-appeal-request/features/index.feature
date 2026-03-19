Feature: ListingAppealRequestReadRepository Listing Appeal Request Read Repository Exports

	Scenario: ListingAppealRequestReadRepository exports
		Then getListingAppealRequestReadRepository should be exported from index
		And getListingAppealRequestReadRepository should be a function
		And ListingAppealRequestReadRepository type should be exported from index
