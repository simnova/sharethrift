Feature: System Listing Passport

Scenario: System passport for listing should use permission function
	Given I have a system listing passport
	When I request access to a listing
	Then visa should use permission function

Scenario: System listing passport should extend SystemPassportBase
	Given I create a system listing passport
	When I check its prototype chain
	Then it should be an instance of the passport
