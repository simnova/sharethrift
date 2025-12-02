Feature: Query Item Listing By ID

  Scenario: Successfully retrieving an item listing by ID
    Given a valid item listing ID "listing-123"
    And the item listing exists
    When the queryById command is executed
    Then the item listing should be returned

  Scenario: Retrieving non-existent item listing
    Given an item listing ID "listing-999" that does not exist
    When the queryById command is executed
    Then null should be returned
