Feature: Create Item Listing

  Scenario: Successfully creating a new listing
    Given valid listing details
    And a valid sharer "user-123"
    When the create command is executed
    Then a new listing should be created

  Scenario: Creating a draft listing
    Given valid listing details
    And the isDraft flag is true
    When the create command is executed
    Then a draft listing should be created

  Scenario: Creating a listing with images
    Given valid listing details
    And images are provided
    When the create command is executed
    Then a listing with images should be created

  Scenario: Creating a listing with expiration date
    Given valid listing details
    And an expiration date is provided
    When the create command is executed
    Then a listing with expiration date should be created

  Scenario: Creating a listing with isDraft explicitly set to false
    Given valid listing details
    And the isDraft flag is false
    When the create command is executed
    Then a non-draft listing should be created

  Scenario: Creating a listing fails when save returns undefined
    Given valid listing details
    And the repository save returns undefined
    When the create command is executed
    Then an error should be thrown with message "ItemListing not created"
