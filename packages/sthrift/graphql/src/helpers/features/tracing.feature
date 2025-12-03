Feature: Tracing Helper

As an API developer
I want to use OpenTelemetry tracing in my functions
So that I can monitor and debug application performance

  Scenario: Successfully tracing a function
    Given a tracer name and span name
    When withTrace is called with a successful function
    Then it should create a span with the operation attribute
    And it should set the span status to OK
    And it should return the function result

  Scenario: Tracing a function that throws an error
    Given a tracer name and span name
    When withTrace is called with a function that throws
    Then it should set the error attribute on the span
    And it should set the span status to ERROR
    And it should rethrow the error
