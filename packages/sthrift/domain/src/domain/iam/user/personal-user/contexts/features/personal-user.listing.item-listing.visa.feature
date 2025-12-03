Feature: PersonalUser Item Listing Visa
	Scenario: Item listing visa evaluates owner permissions
		Given I have an item listing visa for my listing
		When I check update permission
		Then owner can update listing

	Scenario: Item listing visa is created properly
		Given I create an item listing visa
		When I check the visa
		Then it should have determineIf function
