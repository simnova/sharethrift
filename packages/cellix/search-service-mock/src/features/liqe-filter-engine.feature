Feature: LiQE Filter Engine

  Scenario: Applying empty filter returns all results
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply an empty filter
    Then all 4 results should be returned

  Scenario: Applying whitespace-only filter returns all results
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply a whitespace-only filter
    Then all 4 results should be returned

  Scenario: Filtering by exact equality with eq operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "state eq 'active'"
    Then 2 results should be returned
    And all results should have state "active"

  Scenario: Exact match should not match substrings
    Given a LiQEFilterEngine instance
    And a set of test search results including "inactive"
    When I apply filter "state eq 'active'"
    Then no results should have state "inactive"

  Scenario: Filtering by inequality with ne operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "state ne 'active'"
    Then 2 results should be returned
    And no results should have state "active"

  Scenario: Filtering by greater than with gt operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "price gt 100"
    Then 2 results should be returned
    And all results should have price greater than 100

  Scenario: Filtering by less than with lt operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "price lt 200"
    Then 2 results should be returned
    And all results should have price less than 200

  Scenario: Filtering by greater than or equal with ge operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "price ge 200"
    Then 2 results should be returned
    And all results should have price greater than or equal to 200

  Scenario: Filtering by less than or equal with le operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "price le 100"
    Then 2 results should be returned
    And all results should have price less than or equal to 100

  Scenario: Filtering with AND operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "state eq 'active' and price gt 100"
    Then 1 result should be returned
    And the result should have id "3"

  Scenario: Filtering with OR operator
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "state eq 'pending' or price gt 250"
    Then 2 results should be returned

  Scenario: Filtering with contains function
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "contains(title, 'Bike')"
    Then 1 result should be returned
    And the result should have title "Bike"

  Scenario: Filtering with startswith function
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "startswith(title, 'Sk')"
    Then 1 result should be returned
    And the result should have title "Skateboard"

  Scenario: Filtering with endswith function
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply filter "endswith(title, 'er')"
    Then 1 result should be returned
    And the result should have title "Scooter"

  Scenario: Filtering by boolean equality
    Given a LiQEFilterEngine instance
    And search results with boolean fields
    When I apply filter "isActive eq true"
    Then 1 result should be returned
    And the result should have isActive true

  Scenario: Validating empty filter support
    Given a LiQEFilterEngine instance
    When I check if empty filter is supported
    Then it should return true

  Scenario: Validating whitespace filter support
    Given a LiQEFilterEngine instance
    When I check if whitespace-only filter is supported
    Then it should return true

  Scenario: Validating eq filter support
    Given a LiQEFilterEngine instance
    When I check if "state eq 'active'" is supported
    Then it should return true

  Scenario: Validating ne filter support
    Given a LiQEFilterEngine instance
    When I check if "state ne 'inactive'" is supported
    Then it should return true

  Scenario: Validating comparison operators support
    Given a LiQEFilterEngine instance
    When I check if comparison operators are supported
    Then gt, lt, ge, le should all return true

  Scenario: Validating logical operators support
    Given a LiQEFilterEngine instance
    When I check if "state eq 'active' and price gt 100" is supported
    Then it should return true
    When I check if "state eq 'active' or price gt 100" is supported
    Then it should return true

  Scenario: Validating string functions support
    Given a LiQEFilterEngine instance
    When I check if contains, startswith, endswith functions are supported
    Then all should return true

  Scenario: Validating invalid filter without operators
    Given a LiQEFilterEngine instance
    When I check if "invalid query" is supported
    Then it should return false

  Scenario: Validating malformed syntax
    Given a LiQEFilterEngine instance
    When I check if malformed syntax is supported
    Then it should return false

  Scenario: Getting supported operators
    Given a LiQEFilterEngine instance
    When I get supported features
    Then operators should include eq, ne, gt, lt, ge, le, and, or

  Scenario: Getting supported functions
    Given a LiQEFilterEngine instance
    When I get supported features
    Then functions should include contains, startswith, endswith

  Scenario: Getting example queries
    Given a LiQEFilterEngine instance
    When I get supported features
    Then examples should be an array with at least one example

  Scenario: Handling nested field access in basic filter
    Given a LiQEFilterEngine instance
    And search results with nested fields
    When I apply filter with nested field access
    Then it should handle the filter gracefully

  Scenario: Skipping overly long filter strings for safety
    Given a LiQEFilterEngine instance
    And a set of test search results
    When I apply a filter longer than 2048 characters
    Then it should handle the filter safely

  Scenario: Handling multiple AND conditions in basic filter
    Given a LiQEFilterEngine instance
    And a set of test search results with multiple fields
    When I apply filter "state eq 'active' and category eq 'sports'"
    Then 1 result should be returned
    And the result should have id "1"
