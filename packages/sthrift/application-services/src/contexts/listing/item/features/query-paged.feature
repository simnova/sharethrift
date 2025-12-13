Feature: Query Paged Item Listings

  Scenario: Query with basic page and pageSize only
    Given page 1 and pageSize 20
    When the queryPaged command is executed
    Then a paged result should be returned
    And default admin status filters should be applied

  Scenario: Query with search text
    Given page 1 and pageSize 10
    And searchText "test search"
    When the queryPaged command is executed
    Then a paged result with search text should be returned

  Scenario: Query with explicit status filters
    Given page 1 and pageSize 10
    And statusFilters "Active, Blocked"
    When the queryPaged command is executed
    Then a paged result with custom status filters should be returned

  Scenario: Query with sharerId
    Given page 1 and pageSize 10
    And sharerId "sharer-123"
    When the queryPaged command is executed
    Then a paged result for the sharer should be returned
    And no default status filters should be applied

  Scenario: Query with sorter
    Given page 1 and pageSize 10
    And sorter field "createdAt" with order "descend"
    When the queryPaged command is executed
    Then a paged result with sorting should be returned

  Scenario: Query with all parameters
    Given page 2 and pageSize 25
    And searchText "furniture"
    And statusFilters "Active"
    And sharerId "user-456"
    And sorter field "title" with order "ascend"
    When the queryPaged command is executed
    Then a paged result with all parameters should be returned

  Scenario: Return results from repository
    Given page 1 and pageSize 10
    And the repository returns 2 item listings
    When the queryPaged command is executed
    Then the result should contain 2 item listings

  Scenario: Use default admin status filters without sharerId
    Given page 1 and pageSize 10
    And no sharerId is provided
    When the queryPaged command is executed
    Then default admin status filter "Blocked" should be applied

  Scenario: No default status filters when sharerId provided
    Given page 1 and pageSize 10
    And sharerId "sharer-789"
    When the queryPaged command is executed
    Then no default status filters should be applied
