Feature: makeNewableMock helper

  Scenario: Constructor behaviour
    Given an implementation function that constructs `Impl` instances
    When makeNewableMock is created from that function
    Then the returned function can be used as a constructor and produce an `Impl` instance with expected value

  Scenario: Callable behaviour
    Given a function that returns the sum of two numbers
    When makeNewableMock is created from that function
    Then calling the returned function should proxy the call and return the sum
