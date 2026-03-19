Feature: Personal User AccountPlan Passport

Scenario: Personal user can access account plan entities
	Given I have a personal user account plan passport
	When I request access to an account plan
	Then visa should be created with permission function

Scenario: Personal user account plan passport is defined
	Given I create a personal user account plan passport
	When I check the passport
	Then it should be defined
