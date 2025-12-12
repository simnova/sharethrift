Feature: RoleName value object

  Scenario: Creating a RoleName with a valid value
    When I create a RoleName with "Administrator"
    Then the value should be "Administrator"

  Scenario: Creating a RoleName with minimum length value
    When I create a RoleName with "A"
    Then the value should be "A"

  Scenario: Creating a RoleName with maximum length value
    When I create a RoleName with a string of 50 characters
    Then the value should be that 50-character string

  Scenario: Creating a RoleName with an empty string
    When I try to create a RoleName with an empty string
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a RoleName with a string longer than 50 characters
    When I try to create a RoleName with a string of 51 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a RoleName with null
    When I try to create a RoleName with null
    Then an error should be thrown indicating the value is invalid
 