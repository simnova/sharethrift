Feature: Search Listings

  As a ShareThrift user
  I want to search for available listings
  So that I can find items to borrow

  Background:
    Given the following listings exist:
      | title           | category    | location    | status    |
      | Camera          | Electronics | Seattle, WA | published |
      | Mountain Bike   | Sports      | Seattle, WA | published |
      | Camping Tent    | Outdoor     | Portland, OR| published |
      | Power Drill     | Tools       | Seattle, WA | draft     |

  Scenario: Search by keyword
    When Alice searches for "camera"
    Then she should see 1 listing in the results
    And the first result should be titled "Camera"

  Scenario: Filter by category
    When Alice searches with filters:
      | category | Sports |
    Then she should see 1 listing in the results
    And the first result should be titled "Mountain Bike"

  Scenario: Filter by location
    When Alice searches with filters:
      | location | Seattle, WA |
    Then she should see 2 listings in the results
    And all results should be in "Seattle, WA"

  Scenario: Search with no results
    When Alice searches for "unicorn"
    Then she should see 0 listings in the results
    And she should see a "No results found" message

  Scenario: Published listings only
    When Alice searches for listings in "Seattle, WA"
    Then she should see 2 listings in the results
    And draft listings should not appear in results
