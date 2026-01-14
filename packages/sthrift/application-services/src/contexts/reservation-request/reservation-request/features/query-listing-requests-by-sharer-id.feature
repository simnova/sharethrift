Feature: Query Listing Reservation Requests By Sharer ID

  Scenario: Successfully retrieving reservation requests for sharer's listings
    Given a valid sharer ID "user-123"
    And the sharer has listings with 4 reservation requests
    When the queryListingRequestsBySharerId command is executed
    Then 4 reservation requests should be returned

  Scenario: Retrieving requests for sharer with no listings or requests
    Given a valid sharer ID "user-456"
    And the sharer has no reservation requests
    When the queryListingRequestsBySharerId command is executed
    Then an empty array should be returned

  Scenario: Retrieving reservation requests with pagination
    Given a valid sharer ID "user-123"
    And the sharer has listings with 10 reservation requests
    When the queryListingRequestsBySharerId command is executed with page 2 and pageSize 3
    Then 3 reservation requests should be returned for page 2

  Scenario: Retrieving reservation requests with search filter
    Given a valid sharer ID "user-123"
    And the sharer has listings with reservation requests for different items
    When the queryListingRequestsBySharerId command is executed with searchText "camera"
    Then only reservation requests for listings containing "camera" should be returned

  Scenario: Retrieving reservation requests with status filters
    Given a valid sharer ID "user-123"
    And the sharer has listings with reservation requests in different states
    When the queryListingRequestsBySharerId command is executed with statusFilters ["Approved"]
    Then only reservation requests with "Approved" status should be returned

  Scenario: Retrieving reservation requests with sorting
    Given a valid sharer ID "user-123"
    And the sharer has listings with reservation requests created at different times
    When the queryListingRequestsBySharerId command is executed with sorter field "createdAt" order "descend"
    Then reservation requests should be sorted by createdAt in descending order
