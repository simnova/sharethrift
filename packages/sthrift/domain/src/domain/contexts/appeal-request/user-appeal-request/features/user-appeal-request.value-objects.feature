Feature: UserAppealRequest Value Objects

  # Note: UserAppealRequest uses the same value objects as ListingAppealRequest
  # (Reason, State, Type) - these are exported from listing-appeal-request.value-objects.ts
  # All validation scenarios are identical to those in listing-appeal-request.value-objects.feature

  # Reason
  Scenario: Creating a Reason with valid value
    When I create a Reason with "This user was incorrectly blocked and should be restored"
    Then the value should be "This user was incorrectly blocked and should be restored"
  
  Scenario: Creating a Reason with leading and trailing whitespace
    When I create a Reason with "  This user was incorrectly blocked  "
    Then the value should be "This user was incorrectly blocked"

  Scenario: Creating a Reason with minimum length value
    When I create a Reason with "Ten chars!"
    Then the value should be "Ten chars!"

  Scenario: Creating a Reason with maximum length value
    When I create a Reason with a string of 1000 characters
    Then the value should be that 1000-character string

  Scenario: Creating a Reason with empty string
    When I try to create a Reason with an empty string
    Then an error should be thrown indicating the reason cannot be empty

  Scenario: Creating a Reason with too short value
    When I try to create a Reason with "Too short"
    Then an error should be thrown indicating the reason must be at least 10 characters

  Scenario: Creating a Reason with too long value
    When I try to create a Reason with a string of 1001 characters
    Then an error should be thrown indicating the reason cannot exceed 1000 characters

  # State
  Scenario: Creating a State with valid requested value
    When I create a State with "requested"
    Then the value should be "requested"

  Scenario: Creating a State with valid denied value
    When I create a State with "denied"
    Then the value should be "denied"

  Scenario: Creating a State with valid accepted value
    When I create a State with "accepted"
    Then the value should be "accepted"

  Scenario: Creating a State with invalid value
    When I try to create a State with "invalid_state"
    Then an error should be thrown indicating invalid state

  # Type
  Scenario: Creating a Type with valid user value
    When I create a Type with "user"
    Then the value should be "user"

  Scenario: Creating a Type with valid listing value
    When I create a Type with "listing"
    Then the value should be "listing"

  Scenario: Creating a Type with invalid value
    When I try to create a Type with "invalid_type"
    Then an error should be thrown indicating invalid type
