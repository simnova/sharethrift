Feature: ConversationRepository

Background:
  Given a ConversationRepository instance with a configured Mongoose model, type converter, and authentication passport
  And a valid Conversation document exists in the database

Scenario: Retrieve a conversation by ID with references
  When I call getByIdWithReferences with a valid conversation ID
  Then I should receive a corresponding Conversation domain object
  And the object's sharer, reserver, and listing should be populated
  And the object's twilioConversationId should match the stored data

Scenario: Attempt to retrieve a non-existent conversation by ID
  When I call getByIdWithReferences with an invalid or non-existent conversation ID
  Then an error should be thrown indicating the conversation was not found

Scenario: Retrieve a conversation by Twilio SID
  Given a valid Twilio conversation SID
  When I call getByTwilioSid with the Twilio SID
  Then I should receive a corresponding Conversation domain object
  And the object's twilioConversationId should match the provided SID

Scenario: Retrieve a non-existent conversation by Twilio SID
  Given a Twilio conversation SID that does not exist
  When I call getByTwilioSid with the non-existent Twilio SID
  Then I should receive null

Scenario: Retrieve a conversation by sharer and reserver IDs
  Given valid sharer and reserver user IDs
  When I call getByIdWithSharerReserver with the sharer and reserver IDs
  Then I should receive a corresponding Conversation domain object
  And the object's sharer and reserver should match the provided IDs

Scenario: Retrieve a non-existent conversation by sharer and reserver IDs
  Given sharer and reserver IDs that do not match any conversation
  When I call getByIdWithSharerReserver with the IDs
  Then I should receive null

Scenario: Create a new conversation instance
  Given a valid sharer domain object
  And a valid reserver domain object
  And a valid listing domain object
  When I call getNewInstance with the sharer, reserver, and listing
  Then I should receive a new Conversation domain object
  And the object's sharer should reference the provided sharer
  And the object's reserver should reference the provided reserver
  And the object's listing should reference the provided listing
  And the object's messages array should be empty
