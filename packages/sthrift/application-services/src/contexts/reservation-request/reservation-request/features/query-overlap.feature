Feature: Query Overlapping Reservation Requests

  Scenario: Finding overlapping active reservation requests
    Given a valid listing ID "listing-123"
    And a reservation period from "2024-01-05" to "2024-01-10"
    And there are active requests that overlap this period
    When the queryOverlapByListingIdAndReservationPeriod command is executed
    Then the overlapping reservation requests should be returned

  Scenario: No overlapping active reservation requests found
    Given a valid listing ID "listing-123"
    And a reservation period from "2024-02-01" to "2024-02-07"
    And there are no active requests that overlap this period
    When the queryOverlapByListingIdAndReservationPeriod command is executed
    Then an empty array should be returned
