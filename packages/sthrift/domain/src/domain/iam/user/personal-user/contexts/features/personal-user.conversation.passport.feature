Feature: PersonalUser Conversation Passport
	Scenario: Personal user can access conversations
		Given I have a personal user conversation passport
		When I request access to a conversation
		Then visa should be created with permission function

	Scenario: Personal user passport provides conversation access
		Given I create a personal user conversation passport
		When I check the passport
		Then it should be defined
