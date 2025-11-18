Feature: Update Item Listing

  Scenario: Successfully blocking a listing
    Given a valid listing ID "listing-123"
    And the listing exists
    When the update command is executed with isBlocked true
    Then the listing should be blocked

  Scenario: Successfully deleting a listing
    Given a valid listing ID "listing-123"
    And the listing exists
    When the update command is executed with isDeleted true
    Then the listing should be deleted
