Feature: PersonalUser User Appeal Request Visa
	Scenario: User appeal request visa evaluates permissions
		Given I have a user appeal request visa
		When I check view permission
		Then user can view their own appeal

	Scenario: User appeal visa is created properly
		Given I create a user appeal request visa
		When I check the visa
		Then it should have determineIf function
