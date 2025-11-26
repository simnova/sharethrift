Feature: PersonalUser Listing Appeal Request Visa
	Scenario: Listing appeal request visa evaluates permissions
		Given I have a listing appeal request visa
		When I check create permission
		Then permission should be based on user blocked status

	Scenario: Listing appeal visa is created properly
		Given I create a listing appeal request visa
		When I check the visa
		Then it should have determineIf function
