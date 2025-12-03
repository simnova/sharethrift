Feature: Listing Appeal Request Application Service

  Scenario: Creating a listing appeal request through the application service
    Given a listing appeal request application service
    When I create a listing appeal request
    Then it should delegate to the create function

  Scenario: Getting a listing appeal request by ID through the application service
    Given a listing appeal request application service
    When I get a listing appeal request by id "appeal-1"
    Then it should delegate to the getById function

  Scenario: Getting all listing appeal requests through the application service
    Given a listing appeal request application service
    When I get all listing appeal requests with page 1 and pageSize 10
    Then it should delegate to the getAll function

  Scenario: Updating a listing appeal request state through the application service
    Given a listing appeal request application service
    When I update listing appeal request "appeal-1" state to "accepted"
    Then it should delegate to the updateState function
