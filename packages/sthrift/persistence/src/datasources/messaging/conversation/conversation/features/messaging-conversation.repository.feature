Feature: <Repository> MessagingConversationRepository

Background:
Given a MessagingConversationRepository instance with messaging service and passport

	Scenario: Repository initialization
		Then the repository should be defined
		And the repository should have a getMessages method
		And the repository should have a sendMessage method
