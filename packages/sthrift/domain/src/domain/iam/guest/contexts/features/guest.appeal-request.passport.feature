Feature: Guest Appeal Request Passport

Scenario: Guest passport for listing appeal request should deny access
	Given I have a guest appeal request passport
	When I request access to a listing appeal request
	Then access should be denied

Scenario: Guest passport for user appeal request should deny access
	Given I have a guest appeal request passport
	When I request access to a user appeal request
	Then access should be denied

Scenario: Guest passport should extend GuestPassportBase
	Given I create a guest appeal request passport
	When I check its prototype chain
	Then it should be an instance of the passport
