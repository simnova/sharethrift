Feature: Get All User Appeal Requests

  Scenario: Retrieving paginated user appeal requests
    Given a page number of 1 and page size of 10
    When the getAll command is executed
    Then it should return a paginated result with items array
    And the result should contain total count, page, and pageSize

  Scenario: Retrieving user appeal requests with state filters
    Given a page number of 1 and page size of 10
    And state filters for "requested" and "accepted"
    When the getAll command is executed
    Then it should return only appeal requests with the specified states

  Scenario: Retrieving user appeal requests with sorting
    Given a page number of 1 and page size of 10
    And a sorter with field "createdAt" and order "descend"
    When the getAll command is executed
    Then the results should be sorted by the specified field in descending order

  Scenario: Retrieving user appeal requests when none exist
    Given a page number of 1 and page size of 10
    When the getAll command is executed for an empty dataset
    Then it should return an empty items array
    And the total count should be 0

  Scenario: Retrieving user appeal requests with invalid sorter order
    Given a page number of 1 and page size of 10
    And a sorter with invalid order
    When the getAll command is executed
    Then the results should use default ascend order
