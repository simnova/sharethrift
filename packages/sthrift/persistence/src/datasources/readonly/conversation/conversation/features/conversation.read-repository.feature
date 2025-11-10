Feature: Conversation Read Repository

Background:
  Given a ConversationReadRepository with a Mongoose model and passport

Scenario: Retrieve all conversations
  When I call getAll
  Then I should receive a list of ConversationEntityReference objects
  And each object should have sharer, reserver, listing, and twilioConversationId

Scenario: Retrieve all conversations with pagination options
  Given pagination options with limit and skip
  When I call getAll with the pagination options
  Then I should receive a paginated list of ConversationEntityReference objects

Scenario: Retrieve a conversation by ID
  Given a valid conversation ID
  When I call getById with the conversation ID
  Then I should receive the ConversationEntityReference for that ID
  And the object should have the correct twilioConversationId

Scenario: Retrieve a non-existent conversation by ID
  Given a conversation ID that does not exist
  When I call getById with the non-existent ID
  Then I should receive null

Scenario: Retrieve conversations by user ID
  Given a valid user ID
  When I call getByUser with the user ID
  Then I should receive a list of ConversationEntityReference objects
  And each conversation should have the user as either sharer or reserver

Scenario: Retrieve conversations by user ID with no results
  Given a user ID that has no conversations
  When I call getByUser with that user ID
  Then I should receive an empty array

Scenario: Retrieve conversations by user ID with empty string
  Given an empty string as user ID
  When I call getByUser with the empty string
  Then I should receive an empty array

Scenario: Retrieve conversations by user ID with invalid ObjectId
  Given an invalid ObjectId string
  When I call getByUser with the invalid ID
  Then I should receive an empty array
