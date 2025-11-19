Feature: ConversationDomainAdapter

  Background:
    Given a valid Conversation document with populated sharer, reserver, and listing

  # Temporarily commenting out this test until we resolve the issue with nested array (account.profile.billing.transactions) in PersonalUserDomainAdapter
  # Scenario: Getting the sharer property when populated
  #   When I get the sharer property
  #   Then it should return a PersonalUserDomainAdapter with the correct doc

  Scenario: Getting the sharer property when not populated
    When I get the sharer property on a doc with no sharer
    Then an error should be thrown indicating sharer is not populated

  Scenario: Getting the sharer property when it is an ObjectId
    When I get the sharer property on a doc with sharer as ObjectId
    Then an error should be thrown indicating sharer is not populated or is not of the correct type

  Scenario: Setting the sharer property
    When I set the sharer property to a valid PersonalUserDomainAdapter
    Then the document's sharer should be set to an ObjectId

  # Repeat similar scenarios for reserver and listing as needed

  Scenario: Getting the messagingConversationId property
    When I get the messagingConversationId property
    Then it should return the correct value

  Scenario: Setting the messagingConversationId property
    When I set the messagingConversationId property to "twilio-456"
    Then the document's messagingConversationId should be "twilio-456"

  Scenario: Loading sharer when already populated
    When I call loadSharer on an adapter with populated sharer
    Then it should return a PersonalUserDomainAdapter

  Scenario: Loading sharer when it is an ObjectId
    When I call loadSharer on an adapter with sharer as ObjectId
    Then it should populate and return a PersonalUserDomainAdapter

  Scenario: Getting the reserver property when populated
    When I get the reserver property
    Then it should return a PersonalUserDomainAdapter with the correct doc

  Scenario: Loading reserver when already populated
    When I call loadReserver on an adapter with populated reserver
    Then it should return a PersonalUserDomainAdapter

  Scenario: Getting the listing property when populated
    When I get the listing property
    Then it should return an ItemListingDomainAdapter

  Scenario: Loading listing when already populated
    When I call loadListing on an adapter with populated listing
    Then it should return an ItemListingDomainAdapter

  Scenario: Getting messages property
    When I get the messages property
    Then it should return an empty array

  Scenario: Loading messages
    When I call loadMessages
    Then it should return an empty array
