Feature: Query Active Reservation Request By Reserver ID And Listing ID

  Scenario: Query active reservation without fields
    Given a reserverId "reserver-456" and listingId "listing-789"
    And an active reservation exists for this combination
    When the queryActiveByReserverIdAndListingId command is executed
    Then the active reservation should be returned
    And no specific fields should be requested

  Scenario: Query active reservation with specific fields
    Given a reserverId "reserver-456" and listingId "listing-789"
    And specific fields are requested: "id, status, reservationPeriod"
    And an active reservation exists for this combination
    When the queryActiveByReserverIdAndListingId command is executed
    Then the active reservation should be returned
    And the specific fields should be included in the query

  Scenario: Query when no active reservation exists
    Given a reserverId "reserver-999" and listingId "listing-999"
    And no active reservation exists for this combination
    When the queryActiveByReserverIdAndListingId command is executed
    Then null should be returned

  Scenario: Query with empty fields array
    Given a reserverId "reserver-123" and listingId "listing-456"
    And an empty fields array is provided
    When the queryActiveByReserverIdAndListingId command is executed
    Then the query should include an empty fields array
