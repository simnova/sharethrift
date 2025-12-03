Feature: ListingAppealRequestDomainAdapter

  Background:
    Given a valid ListingAppealRequest document

  Scenario: Getting the userId property
    When I get the userId property
    Then it should return the correct value

  Scenario: Getting the listingId property
    When I get the listingId property
    Then it should return the correct value

  Scenario: Getting the reason property
    When I get the reason property
    Then it should return the correct value

  Scenario: Getting the blockerId property
    When I get the blockerId property
    Then it should return the correct value

  Scenario: Setting the user property with valid reference
    When I set the user property with a valid reference
    Then the document user field should be updated

  Scenario: Setting the user property with missing id throws error
    When I set the user property with a reference missing id
    Then it should throw an error about missing id

  Scenario: Setting the listing property with valid reference
    When I set the listing property with a valid reference
    Then the document listing field should be updated

  Scenario: Setting the listing property with missing id throws error
    When I set the listing property with a reference missing id
    Then it should throw an error about missing id

  Scenario: Setting the blocker property with valid reference
    When I set the blocker property with a valid reference
    Then the document blocker field should be updated

  Scenario: Setting the blocker property with missing id throws error
    When I set the blocker property with a reference missing id
    Then it should throw an error about missing id

  Scenario: Loading user when populated as ObjectId
    When the user is an ObjectId and I call loadUser
    Then it should populate the user field
    And return a PersonalUserDomainAdapter

  Scenario: Loading listing when populated as ObjectId
    When the listing is an ObjectId and I call loadListing
    Then it should populate the listing field
    And return an ItemListingDomainAdapter

  Scenario: Loading blocker when populated as ObjectId
    When the blocker is an ObjectId and I call loadBlocker
    Then it should populate the blocker field
    And return a PersonalUserDomainAdapter

  Scenario: Setting and getting reason property
    When I set the reason to "New reason"
    Then the reason should be "New reason"

  Scenario: Setting and getting state property
    When I set the state to "accepted"
    Then the state should be "accepted"

  Scenario: Getting type property
    When I get the type property
    Then it should return the document type value
