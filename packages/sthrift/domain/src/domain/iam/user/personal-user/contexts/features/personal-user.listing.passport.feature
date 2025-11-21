Feature: PersonalUser Listing Passport
	Scenario: Personal user can access item listings
		Given I have a personal user listing passport
		When I request access to an item listing
		Then visa should be created with permission function

	Scenario: Personal user listing passport is defined
		Given I create a personal user listing passport
		When I check the passport
		Then it should be defined
