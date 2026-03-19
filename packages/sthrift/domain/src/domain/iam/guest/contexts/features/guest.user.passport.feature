Feature: Guest User Passport

Scenario: Guest passport for user should deny access
	Given I have a guest user passport
	When I request access to a user
	Then access should be denied

Scenario: Guest passport for admin user should deny access
	Given I have a guest user passport
	When I request access to an admin user
	Then access should be denied

Scenario: Guest user passport should extend GuestPassportBase
	Given I create a guest user passport
	When I check its prototype chain
	Then it should be an instance of the passport
