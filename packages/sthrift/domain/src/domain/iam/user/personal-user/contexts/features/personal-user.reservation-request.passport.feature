Feature: PersonalUser Reservation Request Passport
	Scenario: Personal user can access reservation requests
		Given I have a personal user reservation request passport
		When I request access to a reservation request
		Then visa should be created with permission function

	Scenario: Personal user reservation passport is defined
		Given I create a personal user reservation request passport
		When I check the passport
		Then it should be defined
