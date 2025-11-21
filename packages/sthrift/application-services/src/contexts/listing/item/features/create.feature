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
