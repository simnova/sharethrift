Feature: Guest AccountPlan Passport

Scenario: Guest passport for account plan should deny access
	Given I have a guest account plan passport
	When I request access to an account plan
	Then access should be denied

Scenario: Guest account plan passport should extend GuestPassportBase
	Given I create a guest account plan passport
	When I check its prototype chain
	Then it should be an instance of the passport
