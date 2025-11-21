Feature: System User Passport

Scenario: System passport for user should use permission function
	Given I have a system user passport
	When I request access to a user
	Then visa should use permission function

Scenario: System user passport should extend SystemPassportBase
	Given I create a system user passport
	When I check its prototype chain
	Then it should be an instance of the passport
