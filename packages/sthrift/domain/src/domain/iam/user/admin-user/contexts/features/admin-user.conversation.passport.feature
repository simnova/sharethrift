Feature: AdminUser Conversation Passport
	Scenario: Admin user can access conversations
		Given I have an admin user conversation passport
		When I request access to a conversation
		Then visa should be created with permission function

	Scenario: Admin user passport provides conversation access
		Given I create an admin user conversation passport
		When I check the passport
		Then it should be defined
