Feature: Create Reservation Request

  Scenario: Successfully creating a reservation request
    Given a valid listing ID "listing-123"
    And a valid reserver email "reserver@example.com"
    And a valid reservation period from "2024-01-01" to "2024-01-07"
    And the listing exists
    And the reserver exists
    And there are no overlapping reservation requests
    When the create command is executed
    Then a new reservation request should be created
    And the reservation request should have status "Requested"

  Scenario: Creating reservation request when listing not found
    Given a listing ID "listing-999" that does not exist
    And a valid reserver email "reserver@example.com"
    And a valid reservation period from "2024-01-01" to "2024-01-07"
    When the create command is executed
    Then an error should be thrown with message "Listing not found"

  Scenario: Creating reservation request when reserver not found
    Given a valid listing ID "listing-123"
    And a reserver email "unknown@example.com" that does not exist
    And a valid reservation period from "2024-01-01" to "2024-01-07"
    And the listing exists
    When the create command is executed
    Then an error should be thrown with message "Reserver not found. Ensure that you are logged in."

  Scenario: Creating reservation request with overlapping period
    Given a valid listing ID "listing-123"
    And a valid reserver email "reserver@example.com"
    And a valid reservation period from "2024-01-01" to "2024-01-07"
    And the listing exists
    And the reserver exists
    And there are overlapping active reservation requests
    When the create command is executed
    Then an error should be thrown with message "Reservation period overlaps with existing active reservation requests"
