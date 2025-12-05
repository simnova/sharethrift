Feature: User Appeal Request Application Service

  Scenario: Creating a user appeal request through the application service
    Given a user appeal request application service
    When I create a user appeal request
    Then it should delegate to the create function

  Scenario: Getting a user appeal request by ID through the application service
    Given a user appeal request application service
    When I get a user appeal request by id "appeal-1"
    Then it should delegate to the getById function

  Scenario: Getting all user appeal requests through the application service
    Given a user appeal request application service
    When I get all user appeal requests with page 1 and pageSize 10
    Then it should delegate to the getAll function

  Scenario: Updating a user appeal request state through the application service
    Given a user appeal request application service
    When I update user appeal request "appeal-1" state to "accepted"
    Then it should delegate to the updateState function
