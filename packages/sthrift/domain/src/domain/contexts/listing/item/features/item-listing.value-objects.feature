Feature: Listing value objects

  # ListingState
  Scenario: Creating a ListingState with a valid predefined value
    When I create a ListingState with "Active"
    Then the value should be "Active"

  Scenario: Creating a ListingState with an invalid value
    When I try to create a ListingState with "InvalidState"
    Then an error should be thrown indicating the value is invalid

  Scenario: Checking if a ListingState is active
    Given a ListingState with value "Published"
    When I check isActive
    Then the result should be true

  Scenario: Checking if an Active ListingState is considered active
    Given a ListingState with value "Active"
    When I check isActive
    Then the result should be true

  Scenario: Checking if a ListingState is inactive
    Given a ListingState with value "Draft"
    When I check isActive
    Then the result should be false

  Scenario: Using ListingState.Active static instance
    When I use ListingState.Active
    Then the value should be "Active"
    And isActive should be true

  Scenario: Using ListingState.Draft static instance
    When I use ListingState.Draft
    Then the value should be "Draft"
    And isActive should be false

  Scenario: Using ListingState.Paused static instance
    When I use ListingState.Paused
    Then the value should be "Paused"
    And isActive should be false

  Scenario: Using ListingState.Cancelled static instance
    When I use ListingState.Cancelled
    Then the value should be "Cancelled"
    And isActive should be false

  Scenario: Using ListingState.Expired static instance
    When I use ListingState.Expired
    Then the value should be "Expired"
    And isActive should be false

  Scenario: Using ListingState.Blocked static instance
    When I use ListingState.Blocked
    Then the value should be "Blocked"
    And isActive should be false

  Scenario: Creating a ListingState with too long a string
    When I try to create a ListingState with a string longer than 50 characters
    Then an error should be thrown indicating the value is too long

  # Category
  Scenario: Creating a Category with a valid value
    When I create a Category with "Electronics"
    Then the value should be "Electronics"

  Scenario: Using Category.Electronics static instance
    When I use Category.Electronics
    Then the value should be "Electronics"

  Scenario: Using Category.ToolsEquipment static instance
    When I use Category.ToolsEquipment
    Then the value should be "Tools & Equipment"

  Scenario: Using Category.SportsOutdoors static instance
    When I use Category.SportsOutdoors
    Then the value should be "Sports & Outdoors"

  Scenario: Using Category.HomeGarden static instance
    When I use Category.HomeGarden
    Then the value should be "Home & Garden"

  Scenario: Using Category.PartyEvents static instance
    When I use Category.PartyEvents
    Then the value should be "Party & Events"

  Scenario: Using Category.VehiclesTransportation static instance
    When I use Category.VehiclesTransportation
    Then the value should be "Vehicles & Transportation"

  Scenario: Using Category.KidsBaby static instance
    When I use Category.KidsBaby
    Then the value should be "Kids & Baby"

  Scenario: Using Category.BooksMedia static instance
    When I use Category.BooksMedia
    Then the value should be "Books & Media"

  Scenario: Using Category.ClothingAccessories static instance
    When I use Category.ClothingAccessories
    Then the value should be "Clothing & Accessories"

  Scenario: Using Category.Miscellaneous static instance
    When I use Category.Miscellaneous
    Then the value should be "Miscellaneous"

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
 