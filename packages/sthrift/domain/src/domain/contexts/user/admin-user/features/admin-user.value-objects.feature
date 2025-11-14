Feature: AdminUser Value Objects Validation

  Scenario: Creating a Username with a valid value
    When I create a Username with "admin_user"
    Then the value should be "admin_user"

  Scenario: Creating a Username with minimum length value
    When I create a Username with "abc"
    Then the value should be "abc"

  Scenario: Creating a Username with maximum length value
    When I create a Username with a string of 50 characters
    Then the value should be that 50-character string

  Scenario: Creating a Username with too short value
    When I try to create a Username with "ab"
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a Username with too long value
    When I try to create a Username with a string of 51 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a Username with invalid characters
    When I try to create a Username with "admin@user"
    Then an error should be thrown indicating the value contains invalid characters

  Scenario: Creating a Username with empty string
    When I try to create a Username with an empty string
    Then an error should be thrown indicating the value cannot be empty

  Scenario: Creating a FirstName with a valid value
    When I create a FirstName with "Admin"
    Then the value should be "Admin"

  Scenario: Creating a FirstName with maximum length value
    When I create a FirstName with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a FirstName with too long value
    When I try to create a FirstName with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a FirstName with empty string
    When I try to create a FirstName with an empty string
    Then an error should be thrown indicating the value cannot be empty

  Scenario: Creating a LastName with a valid value
    When I create a LastName with "User"
    Then the value should be "User"

  Scenario: Creating a LastName with maximum length value
    When I create a LastName with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a LastName with too long value
    When I try to create a LastName with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a LastName with empty string
    When I try to create a LastName with an empty string
    Then an error should be thrown indicating the value cannot be empty
