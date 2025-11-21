Feature: Get All Listing Appeal Requests

  Scenario: Successfully retrieving paginated listing appeal requests
    Given a page number of 1 and page size of 10
    When the getAll command is executed
    Then it should return a paginated result with items array
    And the result should contain total count, page, and pageSize

  Scenario: Retrieving listing appeal requests with state filters
    Given a page number of 1 and page size of 10
    And state filters including "requested" and "accepted"
    When the getAll command is executed
    Then it should return only appeal requests matching the state filters

  Scenario: Retrieving listing appeal requests with sorting
    Given a page number of 1 and page size of 10
    And a sorter with field "createdAt" and order "descend"
    When the getAll command is executed
    Then it should return appeal requests sorted by the specified field and order

  Scenario: Handling empty results
    Given a page number of 999 and page size of 10
    When the getAll command is executed
    Then it should return an empty items array with total count 0

  Scenario: Retrieving listing appeal requests with invalid sorter order
    Given a page number of 1 and page size of 10
    And a sorter with field "createdAt" and invalid order
    When the getAll command is executed
    Then it should return appeal requests with default ascend order
