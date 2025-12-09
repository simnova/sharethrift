Feature: Listing value objects

  # ListingState
  Scenario: Creating a ListingState with a valid predefined value
    When I create a ListingState with "Published"
    Then the value should be "Published"

  Scenario: Creating a ListingState with an invalid value
    When I try to create a ListingState with "InvalidState"
    Then an error should be thrown indicating the value is invalid

  Scenario: Checking if a ListingState is active
    Given a ListingState with value "Published"
    When I check isActive
    Then the result should be true

  Scenario: Checking if a ListingState is inactive
    Given a ListingState with value "Draft"
    When I check isActive
    Then the result should be false

 

  Scenario: Creating a ListingState with too long a string
    When I try to create a ListingState with a string longer than 50 characters
    Then an error should be thrown indicating the value is too long

  # Category
  Scenario: Creating a Category with a valid value
    When I create a Category with "Electronics"
    Then the value should be "Electronics"


  Scenario: Creating a Category with too long a value
    When I try to create a Category with a string longer than 100 characters
    Then an error should be thrown indicating the value is too long

  # Location
  Scenario: Creating a Location with a valid city and state
    When I create a Location with "Philadelphia, PA"
    Then the value should be "Philadelphia, PA"
    And cityState should return "Philadelphia, PA"

  Scenario: Creating a Location with too long a value
    When I try to create a Location with a string longer than 255 characters
    Then an error should be thrown indicating the value is too long

  # Title
  Scenario: Creating a Title with valid text
    When I create a Title with "Cordless Drill"
    Then the value should be "Cordless Drill"

  Scenario: Creating a Title with too long a value
    When I try to create a Title with a string longer than 200 characters
    Then an error should be thrown indicating the value is too long

  # Description
  Scenario: Creating a Description with valid text
    When I create a Description with "Professional-grade cordless drill with multiple attachments."
    Then the value should be "Professional-grade cordless drill with multiple attachments."

  Scenario: Creating a Description with too long a value
    When I try to create a Description with a string longer than 2000 characters
    Then an error should be thrown indicating the value is too long
 