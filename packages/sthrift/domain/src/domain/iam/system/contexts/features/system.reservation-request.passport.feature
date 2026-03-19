Feature: System Reservation Request Passport

Scenario: System passport for reservation request should use permission function
	Given I have a system reservation request passport
	When I request access to a reservation request
	Then visa should use permission function

Scenario: System reservation request passport should extend SystemPassportBase
	Given I create a system reservation request passport
	When I check its prototype chain
	Then it should be an instance of the passport
