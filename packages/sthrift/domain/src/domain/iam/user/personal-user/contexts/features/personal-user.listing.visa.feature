Feature: PersonalUser Listing Visa
	Scenario: Personal user can view any listing
		Given I have a personal user listing visa
		When I check if user can view the listing
		Then permission should be granted

	Scenario: Personal user can create listings
		Given I have a personal user listing visa
		When I check if user can create a listing
		Then permission should be granted

	Scenario: Personal user can update own listing
		Given I have a listing owned by the personal user
		When I check if user can update the listing
		Then permission should be granted

	Scenario: Personal user cannot update other's listing
		Given I have a listing owned by another user
		When I check if user can update the listing
		Then permission should be denied

	Scenario: Personal user can delete own listing
		Given I have a listing owned by the personal user
		When I check if user can delete the listing
		Then permission should be granted

	Scenario: Personal user cannot delete other's listing
		Given I have a listing owned by another user
		When I check if user can delete the listing
		Then permission should be denied

	Scenario: Personal user can publish own listing
		Given I have a listing owned by the personal user
		When I check if user can publish the listing
		Then permission should be granted

	Scenario: Personal user cannot publish other's listing
		Given I have a listing owned by another user
		When I check if user can publish the listing
		Then permission should be denied

	Scenario: Personal user can unpublish own listing
		Given I have a listing owned by the personal user
		When I check if user can unpublish the listing
		Then permission should be granted

	Scenario: Personal user cannot unpublish other's listing
		Given I have a listing owned by another user
		When I check if user can unpublish the listing
		Then permission should be denied

	Scenario: Listing visa is created properly
		Given I create a listing visa
		When I check the visa
		Then it should have determineIf function
