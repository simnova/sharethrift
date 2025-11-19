Feature: PersonalUser Appeal Request Passport
	Scenario: Personal user can access listing appeal requests
		Given I have a personal user appeal request passport
		When I request access to a listing appeal request
		Then visa should be created with permission function

	Scenario: Personal user can access user appeal requests
		Given I have a personal user appeal request passport
		When I request access to a user appeal request
		Then visa should be created with permission function

	Scenario: Personal user passport extends base passport
		Given I create a personal user appeal request passport
		When I check its type
		Then it should be defined
