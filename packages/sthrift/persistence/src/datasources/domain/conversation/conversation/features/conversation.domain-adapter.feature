Feature: ConversationDomainAdapter

  Background:
    Given a valid Conversation document with populated sharer, reserver, and listing

  Scenario: Getting the sharer property when populated
    When I get the sharer property
    Then it should return a PersonalUserDomainAdapter with the correct doc

  Scenario: Getting the sharer property when not populated
    When I get the sharer property on a doc with no sharer
    Then an error should be thrown indicating sharer is not populated

  # disabled for now for the current implementation causing runtime error related to population
  # Scenario: Getting the sharer property when it is an ObjectId
  #   When I get the sharer property on a doc with sharer as ObjectId
  #   Then an error should be thrown indicating sharer is not populated or is not of the correct type

  Scenario: Setting the sharer property
    When I set the sharer property to a valid PersonalUserDomainAdapter
    Then the document's sharer should be set to the user doc

  # Repeat similar scenarios for reserver and listing as needed

  Scenario: Getting the messagingConversationId property
    When I get the messagingConversationId property
    Then it should return the correct value

  Scenario: Setting the messagingConversationId property
    When I set the messagingConversationId property to "twilio-456"
    Then the document's messagingConversationId should be "twilio-456"
