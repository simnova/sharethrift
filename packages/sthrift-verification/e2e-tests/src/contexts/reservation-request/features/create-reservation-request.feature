Feature: Create Reservation Request

  As a ShareThrift user
  I want to create reservation requests for items I want to borrow
  So that I can arrange a borrowing period with the item owner

  Background:
    Given Alice is an authenticated user
    And Bob has created a listing with:
      | title       | Vintage Camera              |
      | description | Canon AE-1 in great condition |
      | category    | Electronics                 |
      | location    | Seattle, WA                 |
      | isDraft     | false                       |

  Scenario: Create a reservation request with valid dates
    When Alice creates a reservation request for Bob's listing with:
      | reservationPeriodStart | +1 |
      | reservationPeriodEnd   | +5 |
    Then the reservation request should be in requested status
    And the reservation request should have a start date that is 1 day from now
    And the reservation request should have an end date that is 5 days from now

  Scenario: Cannot create reservation request without required fields
    When Alice attempts to create a reservation request with:
      | reservationPeriodStart | +1 |
    Then she should see a reservation error for "reservationPeriodEnd"
    And no reservation request should be created

  Scenario: Cannot create overlapping reservation requests
    Given Alice has already created a reservation request for Bob's listing with:
      | reservationPeriodStart | +1 |
      | reservationPeriodEnd   | +5 |
    When Alice attempts to create another reservation request for the same listing with:
      | reservationPeriodStart | +3 |
      | reservationPeriodEnd   | +8 |
    Then she should see a reservation error "Reservation period overlaps with existing active reservation requests"
    And only one reservation request should exist for the listing
