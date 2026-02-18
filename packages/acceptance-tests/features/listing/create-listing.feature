Feature: Create Listing

  As a ShareThrift user
  I want to create listings for items I want to share
  So that others can borrow them

  Background:
    Given Alice is an authenticated user

  Scenario: Create a draft listing with basic details
    When Alice creates a listing with:
      | title       | Vintage Camera              |
      | description | Canon AE-1 in great condition |
      | category    | Electronics                 |
      | location    | Seattle, WA                 |
    Then the listing should be in draft status
    And the listing title should be "Vintage Camera"

  Scenario: Create listing with all optional fields
    When Alice creates a listing with:
      | title          | Mountain Bike                   |
      | description    | Trek 3900 with 21-speed gears   |
      | category       | Sports Equipment                |
      | location       | Portland, OR                    |
      | dailyRate      | 25.00                           |
      | weeklyRate     | 150.00                          |
      | deposit        | 100.00                          |
      | tags           | bike, outdoor, sports           |
    Then the listing should be in draft status
    And the listing should have a daily rate of "$25.00"

  Scenario: Publish a draft listing
    Given Alice has created a draft listing titled "Camping Tent"
    When Alice publishes the listing
    Then the listing should be in published status
    And the listing should be visible in search results

  @validation
  Scenario: Cannot create listing without required fields
    When Alice attempts to create a listing with:
      | description | Missing title |
      | category    | Camping       |
    Then she should see a validation error for "title"
    And no listing should be created

  @validation
  Scenario: Title must be between 5 and 100 characters
    When Alice attempts to create a listing with:
      | title       | Too                    |
      | description | Short title            |
      | category    | Other                  |
      | location    | Anywhere               |
    Then she should see a validation error "Title must be at least 5 characters"
