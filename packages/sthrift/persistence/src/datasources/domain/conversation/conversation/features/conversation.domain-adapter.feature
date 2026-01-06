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
    Then it should return a UserEntityReference with id

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
    Then it should return a PersonalUserEntityReference

  Scenario: Loading sharer when it is an ObjectId
    When I call loadSharer on an adapter with sharer as ObjectId
    Then it should populate and return a PersonalUserEntityReference

  Scenario: Getting the reserver property when populated
    When I get the reserver property
    Then it should return a PersonalUserEntityReference with the correct id

  Scenario: Getting the reserver property when it is an ObjectId
    When I get the reserver property on a doc with reserver as ObjectId
    Then an error should be thrown indicating reserver is not populated or is not of the correct type

  Scenario: Getting the listing property when not populated
    When I get the listing property on a doc with no listing
    Then an error should be thrown indicating listing is not populated

  Scenario: Loading reserver when already populated
    When I call loadReserver on an adapter with populated reserver
    Then it should return a PersonalUserEntityReference

  Scenario: Getting the listing property when populated
    When I get the listing property
    Then it should return an ItemListingDomainAdapter

  Scenario: Getting the listing property when it is an ObjectId
    When I get the listing property on a doc with listing as ObjectId
    Then it should return an ItemListingEntityReference with id

  Scenario: Loading listing when already populated
    When I call loadListing on an adapter with populated listing
    Then it should return an ItemListingDomainAdapter

  Scenario: Getting messages property
    When I get the messages property
    Then it should return an empty array

  Scenario: Loading messages
    When I call loadMessages
    Then it should return an empty array

  Scenario: Setting sharer property with valid reference
    When I set the sharer property to a reference with id
    Then the document's sharer should be set correctly

  Scenario: Setting sharer property with missing id throws error
    When I set the sharer property to a reference missing id
    Then an error should be thrown indicating sharer reference is missing id

  Scenario: Setting reserver property with valid reference
    When I set the reserver property to a reference with id
    Then the document's reserver should be set correctly

  Scenario: Setting reserver property with missing id throws error
    When I set the reserver property to a reference missing id
    Then an error should be thrown indicating reserver reference is missing id

  Scenario: Setting listing property with valid reference
    When I set the listing property to a reference with id
    Then the document's listing should be set correctly

  Scenario: Setting listing property with missing id throws error
    When I set the listing property to a reference missing id
    Then an error should be thrown indicating listing reference is missing id

  Scenario: Loading reserver when it is an ObjectId
    When I call loadReserver on an adapter with reserver as ObjectId
    Then it should populate and return a PersonalUserDomainAdapter

  Scenario: Loading listing when it is an ObjectId
    When I call loadListing on an adapter with listing as ObjectId
    Then it should populate and return an ItemListingDomainAdapter

  Scenario: Getting sharer when it is an admin user
    Given a conversation with an admin user as sharer
    When I access the sharer property
    Then it should return an AdminUserDomainAdapter

  Scenario: Setting sharer with PersonalUser domain entity
    Given a PersonalUser domain entity
    When I set the sharer property with the domain entity
    Then the sharer should be set correctly

  Scenario: Setting listing with ItemListing domain entity
    Given an ItemListing domain entity
    When I set the listing property with the domain entity
    Then the listing should be set correctly

  Scenario: Getting reserver when it is an admin user
    Given a conversation with an admin user as reserver
    When I access the reserver property
    Then it should return an AdminUserDomainAdapter for reserver

  Scenario: Loading sharer when it is an admin user
    Given a conversation with an admin user as sharer
    When I call loadSharer on the adapter
    Then it should return an AdminUserDomainAdapter for sharer

  Scenario: Loading reserver when it is an admin user
    Given a conversation with an admin user as reserver
    When I call loadReserver on the adapter
    Then it should return an AdminUserDomainAdapter for reserver

  Scenario: Getting the sharer property when populated as personal user
    When I get the sharer property
    Then it should return a PersonalUserDomainAdapter entityReference

  Scenario: Setting messages property
    When I set the messages property to a list
    Then the messages property should be set correctly

  Scenario: Loading listing when not populated
    When I call loadListing on an adapter with no listing
    Then an error should be thrown indicating listing is not populated in load

  Scenario: Getting expiresAt when not set
    When I get the expiresAt property when it is undefined
    Then it should return undefined

  Scenario: Getting expiresAt when set
    When I get the expiresAt property when it is set
    Then it should return the correct date

  Scenario: Setting expiresAt property
    When I set the expiresAt property to a date
    Then the document's expiresAt should be set correctly
