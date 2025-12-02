Feature: Guest Conversation Passport

Scenario: Guest passport for conversation should deny access
	Given I have a guest conversation passport
	When I request access to a conversation
	Then access should be denied

Scenario: Guest conversation passport should extend GuestPassportBase
	Given I create a guest conversation passport
	When I check its prototype chain
	Then it should be an instance of the passport
