Feature: <DomainAdapter> MessagingConversationDomainAdapter

Background:
Given a messaging conversation model instance

	Scenario: Accessing conversation participants
		When the participants property is accessed
		Then the participants should be defined
		And the participants should be an array

	Scenario: Accessing conversation messages
		When the messages property is accessed
		Then the messages should be defined
		And the messages should be an array

	Scenario: Accessing conversation state
		When the state property is accessed
		Then the state should be defined
		And the state should be a string
