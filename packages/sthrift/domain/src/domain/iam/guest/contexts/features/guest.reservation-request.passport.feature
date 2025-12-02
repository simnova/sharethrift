Feature: Guest Reservation Request Passport

Scenario: Guest passport for reservation request should deny access
	Given I have a guest reservation request passport
	When I request access to a reservation request
	Then access should be denied

Scenario: Guest reservation request passport should extend GuestPassportBase
	Given I create a guest reservation request passport
	When I check its prototype chain
	Then it should be an instance of the passport
