Feature: ConversationDomainAdapter

  Background:
    Given a valid Conversation document with populated sharer, reserver, and listing

  Scenario: Getting the sharer property when populated
    When I get the sharer property
    Then it should return a PersonalUserDomainAdapter with the correct doc

  Scenario: Getting the sharer property when not populated
    When I get the sharer property on a doc with no sharer
    Then an error should be thrown indicating sharer is not populated

  Scenario: Getting the sharer property when it is an ObjectId
    When I get the sharer property on a doc with sharer as ObjectId
    Then an error should be thrown indicating sharer is not populated or is not of the correct type

  Scenario: Setting the sharer property
    When I set the sharer property to a valid PersonalUserDomainAdapter
    Then the document's sharer should be set to the user doc

  # Repeat similar scenarios for reserver and listing as needed

  Scenario: Getting the twilioConversationId property
    When I get the twilioConversationId property
    Then it should return the correct value

  Scenario: Setting the twilioConversationId property
    When I set the twilioConversationId property to "twilio-456"
    Then the document's twilioConversationId should be "twilio-456"
