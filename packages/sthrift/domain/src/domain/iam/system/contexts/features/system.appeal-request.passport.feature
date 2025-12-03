Feature: System Appeal Request Passport

Scenario: System passport for listing appeal request should use permission function
	Given I have a system appeal request passport
	When I request access to a listing appeal request
	Then visa should use permission function

Scenario: System passport for user appeal request should use permission function
	Given I have a system appeal request passport
	When I request access to a user appeal request
	Then visa should use permission function

Scenario: System passport should extend SystemPassportBase
	Given I create a system appeal request passport
	When I check its prototype chain
	Then it should be an instance of the passport
