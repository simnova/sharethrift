Feature: Updating a reservation request

  Scenario: Successfully updating a reservation request state to Accepted
    Given a reservation request ID "req-123"
    And the reservation request exists with state "Requested"
    When the update command is executed with state "Accepted"
    Then the reservation request state should be updated to "Accepted"
    And the update operation should succeed

  Scenario: Successfully updating closeRequestedBySharer flag
    Given a reservation request ID "req-123"
    And the reservation request exists with state "Accepted"
    When the update command is executed with closeRequestedBySharer true
    Then the closeRequestedBySharer flag should be set to true
    And the update operation should succeed

  Scenario: Successfully updating closeRequestedByReserver flag
    Given a reservation request ID "req-123"
    And the reservation request exists with state "Accepted"
    When the update command is executed with closeRequestedByReserver true
    Then the closeRequestedByReserver flag should be set to true
    And the update operation should succeed

  Scenario: Auto-rejecting overlapping requests when accepting a request
    Given a reservation request ID "req-123"
    And the reservation request exists with state "Requested"
    And the reservation request has listing ID "listing-456"
    And there are overlapping pending requests for the same listing
    When the update command is executed with state "Accepted"
    Then the reservation request state should be updated to "Accepted"
    And all overlapping pending requests should be automatically rejected

  Scenario: Updating a reservation request that does not exist
    Given a reservation request ID "req-999" that does not exist
    When the update command is executed with state "Accepted"
    Then an error should be thrown with message "Reservation request not found"

  Scenario: Updating multiple fields at once
    Given a reservation request ID "req-123"
    And the reservation request exists with state "Requested"
    When the update command is executed with state "Accepted" and closeRequestedBySharer true
    Then the reservation request state should be updated to "Accepted"
    And the closeRequestedBySharer flag should be set to true
    And the update operation should succeed
