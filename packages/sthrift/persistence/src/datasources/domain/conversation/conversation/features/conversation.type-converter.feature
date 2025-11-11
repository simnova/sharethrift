Feature: ConversationConverter

  Background:
    Given a valid Conversation document with populated sharer, reserver, and listing

  Scenario: Converting a Mongoose Conversation document to a domain object
    Given a ConversationConverter instance
    When I call toDomain with the Mongoose Conversation document
    Then I should receive a Conversation domain object
    And the domain object's sharer should be a PersonalUserDomainAdapter with the correct doc
    And the domain object's reserver should be a PersonalUserDomainAdapter with the correct doc
    And the domain object's listing should be an ItemListingDomainAdapter with the correct doc
    And the domain object's messagingConversationId should be the correct value

  Scenario: Converting a domain object to a Mongoose Conversation document
    Given a ConversationConverter instance
    And a Conversation domain object with valid sharer, reserver, listing, and messagingConversationId
    When I call toPersistence with the Conversation domain object
    Then I should receive a Mongoose Conversation document
    And the document's sharer should be set to the correct user document
    And the document's reserver should be set to the correct user document
    And the document's listing should be set to the correct listing document
    And the document's messagingConversationId should be set to the correct value
