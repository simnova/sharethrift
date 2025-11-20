Feature: Azure Functions GraphQL Handler

  Background:
    Given an Apollo Server instance
    And Azure Functions middleware options

  Scenario: Creating handler with required context function
    When startServerAndCreateHandler is called with server and context options
    Then it should return an HttpHandler function
    And the server should start in background

  Scenario: Handler processes a valid GraphQL POST request
    Given a handler is created
    When a POST request with valid GraphQL query is received
    Then it should normalize the request
    And it should execute the GraphQL request
    And it should return a successful response with status 200

  Scenario: Handler returns error for chunked responses
    Given a handler is created
    When a request results in chunked response
    Then it should return status 501
    And the body should contain incremental delivery error

  Scenario: Handler catches and logs errors
    Given a handler is created
    When request processing throws an error
    Then it should log the error to context
    And it should return status 400
    And the body should contain the error message

  Scenario: Normalizing request with valid POST and JSON content
    When normalizing a POST request with application/json content-type
    Then it should parse the JSON body
    And it should normalize headers into HeaderMap
    And it should extract search params from URL

  Scenario: Normalizing request without valid content-type
    When normalizing a request without application/json content-type
    Then the body should be null

  Scenario: Normalizing request without method
    When normalizing a request without method
    Then it should throw "No method" error
