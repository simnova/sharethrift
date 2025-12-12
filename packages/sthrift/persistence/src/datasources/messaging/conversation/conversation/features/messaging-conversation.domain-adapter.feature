Feature: <DomainAdapter> MessagingConversationDomainAdapter

Background:
Given a messaging message model instance

	Scenario: Converting a single message to domain message
		When toDomainMessage is called with messaging message data
		Then it should return a valid domain message entity reference
		And the message should have the correct messaging message ID
		And the message should have the correct content
		And the message should extract originalSid from metadata if present

	Scenario: Converting a single message without metadata
		When toDomainMessage is called without metadata
		Then it should use the message id as messagingId
		And it should use default date for missing createdAt
