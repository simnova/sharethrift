Feature: PersonalUser User Visa
	Scenario: User visa recognizes own account editing
		Given I have a user visa for my own account
		When I check own account flag
		Then flag should be true

	Scenario: User visa is created properly
		Given I create a user visa
		When I check the visa
		Then it should have determineIf function
