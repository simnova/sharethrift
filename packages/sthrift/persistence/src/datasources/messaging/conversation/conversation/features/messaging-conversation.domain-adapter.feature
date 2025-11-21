Feature: <DomainAdapter> MessagingConversationDomainAdapter

Background:
Given a messaging conversation model instance

	Scenario: Converting messaging conversation to domain conversation props
		When toDomainConversationProps is called with messaging conversation data
		Then it should return valid domain conversation props
		And the props should have all required fields
		And the messaging conversation ID should be extracted correctly
		And async loader functions should work

	Scenario: Converting messaging conversation with original SID in metadata
		When toDomainConversationProps is called with metadata containing originalSid
		Then the messagingConversationId should use the originalSid value
		And it should not use the conversation id

	Scenario: Converting messaging conversation without metadata
		When toDomainConversationProps is called without metadata
		Then the messagingConversationId should use the conversation id
		And default dates should be used for missing timestamps

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

	Scenario: Converting multiple messages with author mapping
		When toDomainMessages is called with messages and author ID map
		Then it should return an array of domain message entity references
		And each message should have the correct author ID from the map

	Scenario: Converting multiple messages with missing authors
		When toDomainMessages is called with messages missing author field
		Then it should use ANONYMOUS_AUTHOR_ID for those messages
		And the conversion should not fail

	Scenario: Converting multiple messages with unknown authors
		When toDomainMessages is called with authors not in the map
		Then it should use ANONYMOUS_AUTHOR_ID for unknown authors
		And other messages with known authors should use mapped IDs
