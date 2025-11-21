Feature: Query Item Listings By Sharer

  Scenario: Successfully retrieving listings for a sharer
    Given a valid sharer ID "user-123"
    And the sharer has 2 listings
    When the queryBySharer command is executed
    Then 2 listings should be returned

  Scenario: Retrieving listings for sharer with no listings
    Given a valid sharer ID "user-456"
    And the sharer has no listings
    When the queryBySharer command is executed
    Then an empty array should be returned
