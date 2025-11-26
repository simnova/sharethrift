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
