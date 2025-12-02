Feature: Item Listing Application Service

  Scenario: Creating an item listing through the application service
    Given an item listing application service
    When I create an item listing
    Then it should delegate to the create function

  Scenario: Querying an item listing by ID through the application service
    Given an item listing application service
    When I query for listing with id "listing-123"
    Then it should delegate to the queryById function

  Scenario: Querying item listings by sharer through the application service
    Given an item listing application service
    When I query for listings by sharer "sharer-1"
    Then it should delegate to the queryBySharer function

  Scenario: Querying all item listings through the application service
    Given an item listing application service
    When I query for all listings
    Then it should delegate to the queryAll function

  Scenario: Cancelling an item listing through the application service
    Given an item listing application service
    When I cancel listing "listing-123"
    Then it should delegate to the cancel function

  Scenario: Querying paged item listings through the application service
    Given an item listing application service
    When I query for paged listings
    Then it should delegate to the queryPaged function

  Scenario: Updating an item listing through the application service
    Given an item listing application service
    When I update listing "listing-123"
    Then it should delegate to the update function
