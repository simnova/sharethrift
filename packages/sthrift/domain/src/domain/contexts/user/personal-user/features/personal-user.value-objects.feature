Feature: PersonalUser value objects

  # Username value object tests
  Scenario: Creating a Username with a valid value
    When I create a Username with "john_doe"
    Then the value should be "john_doe"

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
    When I try to create a Username with "john@doe"
    Then an error should be thrown indicating the value contains invalid characters

  Scenario: Creating a Username with empty string
    When I try to create a Username with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # FirstName value object tests
  Scenario: Creating a FirstName with a valid value
    When I create a FirstName with "John"
    Then the value should be "John"

  Scenario: Creating a FirstName with maximum length value
    When I create a FirstName with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a FirstName with too long value
    When I try to create a FirstName with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a FirstName with empty string
    When I try to create a FirstName with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # LastName value object tests
  Scenario: Creating a LastName with a valid value
    When I create a LastName with "Doe"
    Then the value should be "Doe"

  Scenario: Creating a LastName with maximum length value
    When I create a LastName with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a LastName with too long value
    When I try to create a LastName with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a LastName with empty string
    When I try to create a LastName with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # Address value object tests
  Scenario: Creating an Address with a valid value
    When I create an Address with "123 Main St"
    Then the value should be "123 Main St"

  Scenario: Creating an Address with maximum length value
    When I create an Address with a string of 200 characters
    Then the value should be that 200-character string

  Scenario: Creating an Address with too long value
    When I try to create an Address with a string of 201 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating an Address with empty string
    When I try to create an Address with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # City value object tests
  Scenario: Creating a City with a valid value
    When I create a City with "New York"
    Then the value should be "New York"

  Scenario: Creating a City with maximum length value
    When I create a City with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a City with too long value
    When I try to create a City with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a City with empty string
    When I try to create a City with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # State value object tests
  Scenario: Creating a State with a valid value
    When I create a State with "California"
    Then the value should be "California"

  Scenario: Creating a State with maximum length value
    When I create a State with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a State with too long value
    When I try to create a State with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a State with empty string
    When I try to create a State with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # Country value object tests
  Scenario: Creating a Country with a valid value
    When I create a Country with "United States"
    Then the value should be "United States"

  Scenario: Creating a Country with maximum length value
    When I create a Country with a string of 100 characters
    Then the value should be that 100-character string

  Scenario: Creating a Country with too long value
    When I try to create a Country with a string of 101 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a Country with empty string
    When I try to create a Country with an empty string
    Then an error should be thrown indicating the value cannot be empty

  # ZipCode value object tests
  Scenario: Creating a ZipCode with a valid 5-digit value
    When I create a ZipCode with "12345"
    Then the value should be "12345"

  Scenario: Creating a ZipCode with a valid 9-digit value
    When I create a ZipCode with "12345-6789"
    Then the value should be "12345-6789"

  Scenario: Creating a ZipCode with invalid format
    When I try to create a ZipCode with "1234"
    Then an error should be thrown indicating invalid zip code format

  Scenario: Creating a ZipCode with empty string
    When I try to create a ZipCode with an empty string
    Then an error should be thrown indicating the value cannot be empty
 