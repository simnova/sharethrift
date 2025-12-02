Feature: System Conversation Passport

Scenario: System passport for conversation should use permission function
	Given I have a system conversation passport
	When I request access to a conversation
	Then visa should use permission function

Scenario: System conversation passport should extend SystemPassportBase
	Given I create a system conversation passport
	When I check its prototype chain
	Then it should be an instance of the passport
