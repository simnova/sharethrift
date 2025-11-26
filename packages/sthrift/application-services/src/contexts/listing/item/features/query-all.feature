Feature: Query All Item Listings

  Scenario: Successfully retrieving all listings
    Given there are 3 listings in the system
    When the queryAll command is executed
    Then 3 listings should be returned

  Scenario: Retrieving all listings when none exist
    Given there are no listings in the system
    When the queryAll command is executed
    Then an empty array should be returned
