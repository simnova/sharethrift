Feature: LiQE Filter Engine

  Scenario: Empty filter returns all results
    Given a set of test search results
    When I apply an empty filter
    Then all results should be returned

  Scenario: Filtering by exact equality
    Given a set of test search results
    When I apply filter "state eq 'active'"
    Then only results with state "active" should be returned

  Scenario: Filtering by inequality
    Given a set of test search results
    When I apply filter "state ne 'active'"
    Then results without state "active" should be returned

  Scenario: Filtering by comparison operators
    Given a set of test search results
    When I apply filter "price gt 100"
    Then only results with price greater than 100 should be returned

  Scenario: Filtering with AND logic
    Given a set of test search results
    When I apply filter "state eq 'active' and price gt 100"
    Then only results matching both conditions should be returned

  Scenario: Filtering with OR logic
    Given a set of test search results
    When I apply filter "state eq 'pending' or price gt 250"
    Then results matching either condition should be returned

  Scenario: Filtering with contains function
    Given a set of test search results
    When I apply filter "contains(title, 'Bike')"
    Then only results with "Bike" in title should be returned

  Scenario: Validating supported filters
    When I check if "state eq 'active'" is supported
    Then it should return true
