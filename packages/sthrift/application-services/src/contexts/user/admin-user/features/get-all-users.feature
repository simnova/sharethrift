Feature: Get All Admin Users

  Scenario: Successfully retrieving all admin users with pagination
    Given a request for admin users with page 1 and pageSize 10
    And multiple admin users exist
    When the getAllUsers command is executed
    Then a paginated list of admin users should be returned
    And the result should include total count and page information

  Scenario: Retrieving admin users with search filter
    Given a request for admin users with search text "john"
    When the getAllUsers command is executed
    Then only admin users matching the search criteria should be returned
