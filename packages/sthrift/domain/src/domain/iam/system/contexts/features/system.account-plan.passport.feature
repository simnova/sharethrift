Feature: System AccountPlan Passport

Scenario: System passport for account plan should use permission function
	Given I have a system account plan passport
	When I request access to an account plan
	Then visa should use permission function

Scenario: System account plan passport should extend SystemPassportBase
	Given I create a system account plan passport
	When I check its prototype chain
	Then it should be an instance of the passport
